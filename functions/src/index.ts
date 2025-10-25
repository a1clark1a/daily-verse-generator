import { onRequest } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-require-imports
import sharp = require("sharp");

// eslint-disable-next-line @typescript-eslint/no-require-imports
import cors = require("cors");

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Initialize CORS middleware
const corsHandler = cors({ origin: true });

// Helper function to creathe quote text as an SVG buffer

const createTextSVG = (text: string, author: string): Buffer => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine + word + " ";
    if (testLine.length > 35 && currentLine.length > 0) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());

  const tspanElements = lines
    .map(
      (line, index) =>
        `<tspan x="50%" dy="${index === 0 ? 0 : "1.2em"}">${line}</tspan>`
    )
    .join("");

  const svg = `
    <svg width="700" height="400">
      <style>
        .title { fill: #FFFFFF; font-size: 30px; font-weight: bold; font-family: sans-serif; }
        .author { fill: #CCCCCC; font-size: 20px; font-style: italic; font-family: sans-serif; margin-top: 20px; }
      </style>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" class="title">
        ${tspanElements}
      </text>
      <text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" class="author">
        - ${author}
      </text>
    </svg>
  `;
  return Buffer.from(svg);
};

/**
 * HTTP function to generate a quote image
 * We use .runWith() to increase memory for image processing.
 */
export const generateQuoteImage = onRequest(
  {
    memory: "1GiB",
    timeoutSeconds: 60,
  },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        // fetch quotes
        functions.logger.info("Fetching quote...");
        const quoteResponse = await axios.get(
          "https://zenquotes.io/api/random"
        );
        const quote = quoteResponse.data[0];
        const { q: text, a: author } = quote;

        // create the text SVG
        const textSvgBuffer = createTextSVG(text, author);

        // create a darkgrey background
        functions.logger.info("Generating image...");
        const backgroundBuffer = await sharp({
          create: {
            width: 800,
            height: 500,
            channels: 4,
            background: { r: 45, g: 52, b: 64, alpha: 1 }, //Dark grey
          },
        })
          .png()
          .toBuffer();

        // put the text and background
        const finalImageBuffer = await sharp(backgroundBuffer)
          .composite([{ input: textSvgBuffer, gravity: "center" }])
          .png()
          .toBuffer();

        // Increment the quote count in Firestore
        try {
          const statsRef = db.collection("stats").doc("quotes");
          await statsRef.update({
            count: admin.firestore.FieldValue.increment(1),
          });
        } catch (error) {
          functions.logger.error("Failed to update count", error);
        }

        // return image as a Base64 data URL
        const imageUrl = `data:image/png;base64, ${finalImageBuffer.toString("base64")}`;

        functions.logger.info("Successfully generated image");
        res.status(200).json({ imageUrl: imageUrl });
      } catch (error) {
        functions.logger.error("Error generating image", error);
        res.status(500).json({
          error: "Failed to generate quote image",
        });
      }
    });
  }
);

/**
 * HTTP function to get quote count
 */
export const getQuoteCount = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      // Get quote count from stats document
      const statsRef = db.collection("stats").doc("quotes");
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
      functions.logger.error("Error getting quote count:", error);
      res.status(500).json({
        error: "Failed to get quote count",
        count: 0,
      });
    }
  });
});
