"use server";

import { revalidatePath } from "next/cache";

export async function generateVerseAction(
  appCheckToken: string,
  translation: string = "kjv"
): Promise<{
  imageUrl?: string;
  error?: string;
}> {
  // Check if the token was provided
  if (!appCheckToken) {
    console.error("Server Action Error: No App Check token provided.");
    return { error: "Client validation failed." };
  }
  try {
    const url = process.env.GENERATE_VERSE_URL;
    if (!url) {
      throw new Error("Missing environment variable: GENERATE_VERSE_URL");
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-firebase-appcheck": appCheckToken,
      },
      body: JSON.stringify({ translation }),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to generate Verse from API");
    }
    const data = await res.json();

    // This tells Next.js to refetch the data for the page
    // which will update the Verse count automatically.
    revalidatePath("/");
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

    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) return 0;
    const data = await res.json();
    return data.count || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}
