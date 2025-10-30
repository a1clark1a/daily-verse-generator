import * as fs from "fs";
import * as path from "path";
import { onRequest } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

import { icon, IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCross,
  faDove,
  faBible,
  faHeart,
  faAnchor,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

// eslint-disable-next-line @typescript-eslint/no-require-imports
import sharp = require("sharp");

// eslint-disable-next-line @typescript-eslint/no-require-imports
import cors = require("cors");

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Initialize CORS middleware
const corsHandler = cors({ origin: true });

// Helper function to get a random item
const getRandomItem = <T>(arr: T[]): T | undefined => {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};

const availableIcons: IconDefinition[] = [
  faCross,
  faDove,
  faBible,
  faHeart,
  faAnchor,
  faBookOpen,
];

// --- Define Path to Font File ---
const fontPath = path.join(__dirname, "assets", "EBGaramond-Regular.ttf");
// --- Renamed variable for caching ---
let cachedBase64FontData: string | null = null;

// Helper function to creathe verse text as an SVG buffer
const createTextSVG = (
  verse: number,
  chapter: number,
  book: string,
  text: string,
  translation: string
): Buffer => {
  // --- Configuration ---
  const svgWidth = 700; // Keep consistent with SVG width attribute
  const svgHeight = 400; // Keep consistent with SVG height attribute
  const titleRefY = "18%"; // Position title reference higher up (adjust %)
  const verseTextStartY = "30%"; // Start verse text block below title (adjust %)
  const translationY = "92%"; // Position translation name near bottom (adjust %)

  const titleRefFontSize = 32; // Larger font size for the title reference
  const verseTextFontSize = 26; // Slightly smaller verse text font size
  const translationFontSize = 16; // Smaller font size for translation

  const verseTextLineHeightEm = 1.3; // Line height for verse text (in em units)
  const maxLineLength = 48; // Max characters per line for verse text (adjust as needed)

  let svgBase64FontData: string = "";

  // --- Read Font File and Convert to Base64 (Cached) ---
  // Read only once per function instance cold start
  if (cachedBase64FontData === null) {
    // Check cache
    try {
      const fontBuffer = fs.readFileSync(fontPath);
      cachedBase64FontData = fontBuffer.toString("base64"); // Update cache
      functions.logger.info("Successfully loaded and encoded font file.");
    } catch (err) {
      functions.logger.error("!!! FAILED TO READ FONT FILE !!!", err);
      // Set cache to empty string on error to prevent retry & use fallback
      cachedBase64FontData = "";
    }
  }

  // Assign the cached value (or empty string) to the variable used in SVG
  svgBase64FontData = cachedBase64FontData;

  // --- Text Wrapping (Verse Text) ---
  const words = text.trim().split(" "); // Trim input text first
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine ? currentLine + " " + word : word; // Handle first word correctly
    // Rough estimate of line width (adjust multiplier if needed for font)
    if (testLine.length > maxLineLength && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine); // Add the last line

  // Create tspan elements for each line of the verse
  const tspanElements = lines
    .map(
      (line, index) =>
        `<tspan x="50%" dy="${
          index === 0 ? 0 : `${verseTextLineHeightEm}em` // Use constant
        }">${line.trim()}</tspan>`
    )
    .join("");

  const fontFormat = "truetype";
  // --- SVG Construction ---
  const svg = `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @font-face {
          font-family: 'EBGaramond';
          src: url('data:font/${fontFormat};base64,${svgBase64FontData || ""}') format('${fontFormat}');
          font-weight: normal;
          font-style: normal;
        }
        .titleRef {
          fill: #E2E8F0; font-size: ${titleRefFontSize}px; font-weight: bold;
          font-family: ${svgBase64FontData ? "'EBGaramond', serif" : "serif"};
          text-shadow: 1px 1px 3px rgba(0,0,0,0.6);
        }
        .verseText {
          fill: #FFFFFF; font-size: ${verseTextFontSize}px; font-weight: normal;
          font-family: ${svgBase64FontData ? "'EBGaramond', serif" : "serif"};
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .translationName {
          fill: #A0AEC0; font-size: ${translationFontSize}px; font-style: italic;
          font-family: ${svgBase64FontData ? "'EBGaramond', serif" : "serif"};
          text-shadow: 1px 1px 1px rgba(0,0,0,0.4);
        }
      </style>

      {/* Title Reference - Use Y constant */}
      <text x="50%" y="${titleRefY}"
            dominant-baseline="middle" text-anchor="middle" class="titleRef">
          ${book} ${chapter}:${verse}
      </text>

      {/* Verse Text Block - Use Y constant */}
      <text x="0" y="${verseTextStartY}"
            dominant-baseline="hanging" text-anchor="middle" class="verseText">
          ${tspanElements}
      </text>

      {/* Translation Name - Use Y constant */}
      <text x="50%" y="${translationY}"
            dominant-baseline="middle" text-anchor="middle" class="translationName">
          (${translation})
      </text>
    </svg>
  `;
  return Buffer.from(svg);
};

/**
 * HTTP function to generate a verse image
 */
export const generateVerseImage = onRequest(
  {
    memory: "1GiB",
    timeoutSeconds: 60,
    // enforceAppCheck: true,
    // maxInstances: 20,
  },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        // Get translation from request body, default to kjv
        const requestTranslation = req.body?.translation || "kjv";
        functions.logger.info(`Fetching verse with translation: ${requestTranslation}...`);

        // fetch verses with the specified translation
        const verseResponse = await axios.get(
          `https://bible-api.com/data/${requestTranslation}/random`
        );

        const { verse, chapter, book, text } = verseResponse.data.random_verse;
        const translation = verseResponse.data.translation.name;

        let randomIconSvgBuffer: Buffer | undefined = undefined;
        const randomIconDefinition = getRandomItem(availableIcons);

        if (randomIconDefinition) {
          const abstractIcon = icon(randomIconDefinition);
          if (abstractIcon.icon) {
            const iconSvgString = `<svg viewBox="0 0 ${abstractIcon.icon[0]} ${abstractIcon.icon[1]}" width="80" height="80" fill="rgba(255, 255, 255, 0.88)"> <path d="${abstractIcon.icon[4]}"></path> </svg>`;
            randomIconSvgBuffer = Buffer.from(iconSvgString);
            functions.logger.info(
              `Selected icon: ${randomIconDefinition.iconName}`
            );
          } else {
            functions.logger.warn("Could not get abstract icon data.");
          }
        } else {
          functions.logger.warn("No icon definition found or selected.");
        }

        // create the text SVG
        const textSvgBuffer = createTextSVG(
          verse,
          chapter,
          book,
          text.trim(),
          translation
        );

        // Generate Random DARK Gradient Background with Sharp
        functions.logger.info("Generating dark gradient background...");

        // Helper to generate a dark hex color
        const generateDarkHexColor = (): string => {
          // Limit RGB values (e.g., 0-128) to ensure darker colors
          const r = Math.floor(Math.random() * 129); // 0 to 128
          const g = Math.floor(Math.random() * 129); // 0 to 128
          const b = Math.floor(Math.random() * 129); // 0 to 128

          // Convert RGB to Hex
          const toHex = (c: number) => c.toString(16).padStart(2, "0");
          return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        };

        const darkColor1 = generateDarkHexColor();
        const darkColor2 = generateDarkHexColor();
        // Create an SVG gradient buffer
        const backgroundGradient = Buffer.from(
          `<svg width="800" height="500">
            <defs>
              <linearGradient id="darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${darkColor1}" />
                <stop offset="100%" stop-color="${darkColor2}" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#darkGrad)" />
          </svg>`
        );
        // Start sharp pipeline with the gradient SVG
        const imagePipeline = sharp(backgroundGradient);
        //Composite Layers: Background -> Icon -> Text
        const compositeOperations = [];
        if (randomIconSvgBuffer) {
          compositeOperations.push({
            input: randomIconSvgBuffer, // Use the icon SVG buffer
            gravity: "northeast", // Position (e.g., Top-right)
            top: 20, // Add some padding
            left: 20, // Add some padding (use left with northeast)
          });
        }
        compositeOperations.push({
          input: textSvgBuffer, // Add verse text SVG on top
          gravity: "center",
        });

        // Apply compositing and output final buffer
        const finalImageBuffer = await imagePipeline
          .composite(compositeOperations)
          .png() // Ensure output is PNG
          .toBuffer();

        // Increment the verse count in Firestore
        try {
          const statsRef = db.collection("stats").doc("verse");
          await statsRef.set(
            {
              count: admin.firestore.FieldValue.increment(1),
            },
            { merge: true }
          );
        } catch (error) {
          functions.logger.error("Failed to update count", error);
        }

        // return image as a Base64 data URL
        const imageUrl = `data:image/png;base64,${finalImageBuffer.toString("base64")}`;

        functions.logger.info("Successfully generated image");
        res.status(200).json({ imageUrl: imageUrl });
      } catch (error) {
        functions.logger.error("Error generating image", error);
        res.status(500).json({
          error: "Failed to generate verse image",
        });
      }
    });
  }
);

/**
 * HTTP function to get verse count
 */
export const getVerseCount = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      // Get verse count from stats document
      const statsRef = db.collection("stats").doc("verse");
      const doc = await statsRef.get();

      let count = 0;
      if (doc.exists) {
        count = doc.data()?.count || 0;
      } else {
        await statsRef.set({ count: 0 });
      }

      res.status(200).json({
        count: count,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      functions.logger.error("Error getting verse count:", error);
      res.status(500).json({
        error: "Failed to get verse count",
        count: 0,
      });
    }
  });
});
