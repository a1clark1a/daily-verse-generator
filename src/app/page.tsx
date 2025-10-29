import Image from "next/image";
import {
  Link as ChakraLink,
  Text,
  Icon,
  AbsoluteCenter,
  Box,
} from "@chakra-ui/react";
import { HiHeart } from "react-icons/hi";

import { VerseGenerator } from "@/components/verseGenerator/VerseGenerator";

import {
  FooterContainer,
  GradientBackgroundCon,
} from "@/components/verseGenerator/VerseGeneratorElements";

// images
import cloud1 from "@/assets/cloud-and-thunder.png";
import cloud2 from "@/assets/cloudy-weather.png";
import bannerImage from "@/assets/tranquil.png";

async function getInitialVerseCount() {
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

export default async function Home() {
  const initialCount = await getInitialVerseCount();

  return (
    <GradientBackgroundCon position="relative" overflow="hidden">
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height={{ base: "200px", md: "300px" }} // Adjust height as needed
        zIndex="0" // Behind the main content
        opacity="0.4" // Make it slightly transparent
      ></Box>
      <AbsoluteCenter>
        <VerseGenerator />
      </AbsoluteCenter>

      <FooterContainer>
        <>
          Verse Generated: {initialCount}
          <br />
          <Text>
            Developed with{" "}
            <Icon size="lg" color="red.700">
              <HiHeart />
            </Icon>
            :{" "}
            <ChakraLink
              variant="underline"
              href="https://acperfecto.vercel.app/"
              target="_blank"
              rel="noreferrer"
            >
              Clark Perfecto
            </ChakraLink>{" "}
            @{new Date().getFullYear()}
          </Text>
        </>
      </FooterContainer>
    </GradientBackgroundCon>
  );
}
