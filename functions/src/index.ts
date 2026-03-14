/* eslint-disable @typescript-eslint/no-explicit-any */
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

//Rate Limiting Helper
/**
 * Checks and updates IP-based rate limits.
 * Throws an error if the limit is exceeded.
 * @param {string | undefined} ip The user's IP address.
 */
const verifyRateLimit = async (ip: string | undefined) => {
  if (!ip) throw new Error("Could not identify request origin");

  const now = Date.now();
  const ipRef = db.collection("rateLimitis").doc(ip);
  const doc = await ipRef.get();

  const RATE_LIMIT_COUNT = 20;
  const RATE_LIMIT_DURATIONS = 60 * 1000; // 1 minute

  if (doc.exists) {
    const data = doc.data() as { count: number; timestamp: number };
    const elapsedTime = now - data.timestamp;

    if (elapsedTime < RATE_LIMIT_DURATIONS) {
      if (data.count >= RATE_LIMIT_COUNT) {
        functions.logger.warn(`Rate limit exceeded for IP: ${ip}`);
        throw new Error("Rate limit exceeded");
      } else {
        await ipRef.update({ count: admin.firestore.FieldValue.increment(1) });
      }
    } else {
      await ipRef.set({ count: 1, timestamp: now });
    }
  } else {
    await ipRef.set({ count: 1, timestamp: now });
  }
  functions.logger.info(`Rate limit check passed for IP: ${ip}`);
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

// Cache for fetched Unsplash images within the same function instance
let cachedUnsplashImage: { url: string; buffer: Buffer } | null = null;

// Helper function to create verse text as an SVG buffer
const createTextSVG = (
  verse: number,
  chapter: number,
  book: string,
  text: string,
  translation: string,
  backgroundMode: "gradient" | "image" = "gradient",
): Buffer => {
  // --- Configuration ---
  const svgWidth = 700; // Keep consistent with SVG width attribute
  const svgHeight = 400; // Keep consistent with SVG height attribute
  const titleRefY = "18%"; // Position title reference higher up (adjust %)
  const verseTextStartY = "30%"; // Start verse text block below title (adjust %)
  const translationY = "88%"; // Position translation name near bottom (adjust %)
  const siteUrlY = "95%"; // Position site URL below translation

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
        }">${line.trim()}</tspan>`,
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
          fill: #FFFFFF; font-size: ${titleRefFontSize}px; font-weight: bold;
          font-family: ${svgBase64FontData ? "'EBGaramond', serif" : "serif"};
          ${backgroundMode === "image" ? "stroke: rgba(0,0,0,0.6); stroke-width: 2px; paint-order: stroke fill;" : ""}
        }
        .verseText {
          fill: #FFFFFF; font-size: ${verseTextFontSize}px; font-weight: normal;
          font-family: ${svgBase64FontData ? "'EBGaramond', serif" : "serif"};
          ${backgroundMode === "image" ? "stroke: rgba(0,0,0,0.5); stroke-width: 1.5px; paint-order: stroke fill;" : ""}
        }
        .translationName {
          fill: ${backgroundMode === "image" ? "#E2E8F0" : "#A0AEC0"}; font-size: ${translationFontSize}px; font-style: italic;
          font-family: ${svgBase64FontData ? "'EBGaramond', serif" : "serif"};
          ${backgroundMode === "image" ? "stroke: rgba(0,0,0,0.6); stroke-width: 1.5px; paint-order: stroke fill;" : ""}
        }
        .siteUrl {
          fill: ${backgroundMode === "image" ? "#E2E8F0" : "#718096"}; font-size: 11px;
          font-family: ${svgBase64FontData ? "'EBGaramond', serif" : "sans-serif"};
          ${backgroundMode === "image" ? "stroke: rgba(0,0,0,0.5); stroke-width: 1px; paint-order: stroke fill;" : ""}
        }
      </style>

      {/* Title Reference */}
      <text x="50%" y="${titleRefY}"
            dominant-baseline="middle" text-anchor="middle" class="titleRef">
          ${book} ${chapter}:${verse}
      </text>

      {/* Verse Text Block */}
      <text x="0" y="${verseTextStartY}"
            dominant-baseline="hanging" text-anchor="middle" class="verseText">
          ${tspanElements}
      </text>

      {/* Translation Name */}
      <text x="50%" y="${translationY}"
            dominant-baseline="middle" text-anchor="middle" class="translationName">
          (${translation})
      </text>

      {/* Site URL */}
      <text x="50%" y="${siteUrlY}"
            dominant-baseline="middle" text-anchor="middle" class="siteUrl">
          daily-verse-generator.vercel.app
      </text>
    </svg>
  `;
  return Buffer.from(svg);
};

// Helper to generate a dark gradient background pipeline
const createGradientPipeline = (): sharp.Sharp => {
  const generateDarkHexColor = (): string => {
    const r = Math.floor(Math.random() * 129);
    const g = Math.floor(Math.random() * 129);
    const b = Math.floor(Math.random() * 129);
    const toHex = (c: number) => c.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const darkColor1 = generateDarkHexColor();
  const darkColor2 = generateDarkHexColor();

  const backgroundGradient = Buffer.from(
    `<svg width="800" height="500">
      <defs>
        <linearGradient id="darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${darkColor1}" />
          <stop offset="100%" stop-color="${darkColor2}" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#darkGrad)" />
    </svg>`,
  );

  return sharp(backgroundGradient);
};

/**
 * HTTP function to generate a verse image
 */
export const generateVerseImage = onRequest(
  {
    memory: "1GiB",
    timeoutSeconds: 60,
    maxInstances: 20,
  },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        // Rate Limit
        await verifyRateLimit(req.ip);

        // Get parameters from request body
        const requestTranslation = req.body?.translation || "kjv";
        const backgroundMode: "gradient" | "image" =
          req.body?.backgroundMode === "image" ? "image" : "gradient";
        const unsplashImageUrl: string | null =
          req.body?.unsplashImageUrl || null;

        // Validate Unsplash URL to prevent SSRF
        if (unsplashImageUrl) {
          try {
            const parsed = new URL(unsplashImageUrl);
            if (parsed.hostname !== "images.unsplash.com") {
              throw new Error("Invalid image URL hostname");
            }
          } catch {
            functions.logger.warn(
              `Rejected invalid Unsplash URL: ${unsplashImageUrl}`,
            );
            res.status(400).json({ error: "Invalid image URL" });
            return;
          }
        }

        functions.logger.info(
          `Fetching verse with translation: ${requestTranslation}, background: ${backgroundMode}`,
        );

        // fetch verses with the specified translation
        const verseResponse = await axios.get(
          `https://bible-api.com/data/${requestTranslation}/random`,
        );

        const { verse, chapter, book, text } = verseResponse.data.random_verse;
        const translation = verseResponse.data.translation.name;

        let randomIconSvgBuffer: Buffer | undefined = undefined;
        const randomIconDefinition = getRandomItem(availableIcons);

        if (randomIconDefinition) {
          const abstractIcon = icon(randomIconDefinition);
          if (abstractIcon.icon) {
            const iconOpacity = backgroundMode === "image" ? "0.65" : "0.88";
            const iconSvgString = `<svg viewBox="0 0 ${abstractIcon.icon[0]} ${abstractIcon.icon[1]}" width="80" height="80" fill="rgba(255, 255, 255, ${iconOpacity})"> <path d="${abstractIcon.icon[4]}"></path> </svg>`;
            randomIconSvgBuffer = Buffer.from(iconSvgString);
            functions.logger.info(
              `Selected icon: ${randomIconDefinition.iconName}`,
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
          translation,
          backgroundMode,
        );

        // Generate background based on mode
        let imagePipeline: sharp.Sharp;

        if (backgroundMode === "image" && unsplashImageUrl) {
          // Fetch Unsplash image as background
          functions.logger.info("Fetching Unsplash image for background...");

          let imageBuffer: Buffer;
          // Use cached image if same URL
          if (
            cachedUnsplashImage &&
            cachedUnsplashImage.url === unsplashImageUrl
          ) {
            imageBuffer = cachedUnsplashImage.buffer;
            functions.logger.info("Using cached Unsplash image");
          } else {
            try {
              const imgResponse = await axios.get(unsplashImageUrl, {
                responseType: "arraybuffer",
                timeout: 10000,
              });
              imageBuffer = Buffer.from(imgResponse.data);
              cachedUnsplashImage = {
                url: unsplashImageUrl,
                buffer: imageBuffer,
              };
            } catch (imgError) {
              functions.logger.warn(
                "Failed to fetch Unsplash image, falling back to gradient",
                imgError,
              );
              // Fall through to gradient
              imageBuffer = null as unknown as Buffer;
            }
          }

          if (imageBuffer) {
            // Frosted glass: blur entire image, then cut a "window" showing
            // the sharp original around the edges
            const resizedBuffer = await sharp(imageBuffer)
              .resize(800, 500, { fit: "cover" })
              .toBuffer();

            // Light blur for overall frosted panel
            const lightBlurred = await sharp(resizedBuffer).blur(5).toBuffer();

            // Edge mask: keeps sharp photo edges, transparent panel hole
            const edgeMask = Buffer.from(
              `<svg width="800" height="500">
                <defs>
                  <mask id="m">
                    <rect width="800" height="500" fill="white" />
                    <rect x="50" y="20" width="700" height="460" rx="20" ry="20" fill="black" />
                  </mask>
                </defs>
                <rect width="800" height="500" fill="white" mask="url(#m)" />
              </svg>`,
            );

            const sharpEdges = await sharp(resizedBuffer)
              .composite([{ input: edgeMask, blend: "dest-in" }])
              .png()
              .toBuffer();

            // Light panel tint + darker bands behind text areas for readability
            const overlays = Buffer.from(
              `<svg width="800" height="500">
                <!-- Light tint over entire panel -->
                <rect x="50" y="20" width="700" height="460" rx="20" ry="20"
                      fill="rgba(0, 0, 0, 0.20)" />
                <!-- Darker band behind title + verse text -->
                <rect x="70" y="80" width="660" height="280" rx="14" ry="14"
                      fill="rgba(0, 0, 0, 0.30)" />
                <!-- Darker band behind translation + URL -->
                <rect x="100" y="385" width="600" height="80" rx="14" ry="14"
                      fill="rgba(0, 0, 0, 0.30)" />
              </svg>`,
            );

            // Composite: light blur → sharp edges → overlay bands
            imagePipeline = sharp(lightBlurred).composite([
              { input: sharpEdges, gravity: "center" },
              { input: overlays, gravity: "center" },
            ]);
          } else {
            // Fallback to gradient if image fetch failed
            imagePipeline = createGradientPipeline();
          }
        } else {
          imagePipeline = createGradientPipeline();
        }
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
            { merge: true },
          );
        } catch (error) {
          functions.logger.error("Failed to update count", error);
        }

        // return image as a Base64 data URL
        const imageUrl = `data:image/png;base64,${finalImageBuffer.toString("base64")}`;

        functions.logger.info("Successfully generated image");
        res.status(200).json({ imageUrl });
      } catch (error: any) {
        // --- Unified Error Handling ---
        functions.logger.error("Function failed:", error.message);
        if (error.message.startsWith("Rate limit exceeded")) {
          res.status(429).json({ error: "Too Many Requests" });
        } else {
          res.status(500).json({ error: "Failed to generate verse image" });
        }
      }
    });
  },
);

/**
 * HTTP function to get verse count
 */
export const getVerseCount = onRequest(
  { maxInstances: 50 },
  async (req, res) => {
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
      } catch (error: any) {
        // --- Unified Error Handling ---
        functions.logger.error("Function failed:", error.message);
        if (error.message.startsWith("Rate limit exceeded")) {
          res.status(429).json({ error: "Too Many Requests" });
        } else {
          res.status(500).json({ error: "Failed to get verse count" });
        }
      }
    });
  },
);
