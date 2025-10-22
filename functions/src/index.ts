import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

/**
 * HTTP function to generate a quote image
 */
export const generateQuoteImage = functions.https.onRequest(
  async (req, res) => {
    // Set CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    try {
      // TODO: Implement quote image generation logic
      const response = {
        message: "Generate Quote Image function works!",
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Error generating quote image:", error);
      res.status(500).json({
        error: "Failed to generate quote image",
      });
    }
  }
);

/**
 * HTTP function to get quote count
 */
export const getQuoteCount = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    // TODO: Get actual count from Firestore
    const db = admin.firestore();
    const quotesRef = db.collection("quotes");
    const snapshot = await quotesRef.count().get();

    res.status(200).json({
      count: snapshot.data().count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting quote count:", error);
    res.status(500).json({
      error: "Failed to get quote count",
      count: 0,
    });
  }
});
