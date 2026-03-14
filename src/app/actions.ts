"use server";

import { revalidateTag } from "next/cache";
import { VALID_TRANSLATIONS, type Translation } from "@/lib/translations";

export async function generateVerseAction(
  translation: string = "kjv",
): Promise<{
  imageUrl?: string;
  error?: string;
}> {
  try {
    if (!VALID_TRANSLATIONS.includes(translation as Translation)) {
      return { error: "Invalid translation" };
    }

    const url = process.env.GENERATE_VERSE_URL;
    if (!url) {
      throw new Error("Missing environment variable: GENERATE_VERSE_URL");
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ translation }),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to generate Verse from API");
    }
    const data = await res.json();

    revalidateTag("verse-count");
    return { imageUrl: data.imageUrl };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getInitialVerseCount() {
  try {
    const url = process.env.GET_VERSE_COUNT_URL;
    if (!url) throw new Error("No count url detected");

    const res = await fetch(url, {
      next: { tags: ["verse-count"], revalidate: 60 },
    });

    if (!res.ok) return 0;
    const data = await res.json();
    return data.count || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

// Function to get daily image from Unsplash
export async function getDailyImage() {
  try {
    // Calculate day of year for deterministic image selection
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000,
    );

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!accessKey) {
      console.warn("Unsplash API key not found, using fallback image");
      return null;
    }

    // Use day of year to rotate through API pages so we get different photos each day
    const page = (dayOfYear % 10) + 1;

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=nature peaceful landscape&orientation=landscape&per_page=30&page=${page}&client_id=${accessKey}`,
      {
        next: { revalidate: 86400, tags: ["daily-image"] },
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch from Unsplash");
      return null;
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.error("No images found from Unsplash");
      return null;
    }

    // Pick a photo from the page based on the day
    const imageIndex = dayOfYear % data.results.length;
    const photo = data.results[imageIndex];

    return {
      url: photo.urls.regular,
      alt: photo.alt_description || "Daily inspirational image",
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    };
  } catch (error) {
    console.error("Error fetching daily image:", error);
    return null;
  }
}
