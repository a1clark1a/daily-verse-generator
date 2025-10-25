"use server";

import { revalidatePath } from "next/cache";

export async function generateQuoteAction(): Promise<{
  imageUrl?: string;
  error?: string;
}> {
  try {
    const url = process.env.GENERATE_QUOTE_URL;
    if (!url) {
      throw new Error("Missing environment variable: GENERATE_QUOTE_URL");
    }

    const res = await fetch(url, {
      method: "POST",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to generate quote from API");
    }
    const data = await res.json();

    // This tells Next.js to refetch the data for the page
    // which will update the quote count automatically.
    revalidatePath("/");
    return { imageUrl: data.imageUrl };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
