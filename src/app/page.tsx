"use client"; // pages should be server side fix this later

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  Link as ChakraLink,
  Text,
  Icon,
  AbsoluteCenter,
  Box,
} from "@chakra-ui/react";
import { HiHeart } from "react-icons/hi";

import {
  FooterContainer,
  GenerateQuoteButton,
  GenerateQuoteButtonText,
  GradientBackgroundCon,
  QuoteGeneratorCon,
  QuoteGeneratorInnerCon,
  QuoteGeneratorSubtitle,
  QuoteGeneratorTitle,
} from "@/components/quoteGenerator/QuoteGeneratorElements";

// images
import cloud1 from "@/assets/cloud-and-thunder.png";
import cloud2 from "@/assets/cloudy-weather.png";

export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<number | null>(0);

  return (
    <GradientBackgroundCon>
      <AbsoluteCenter>
        <QuoteGeneratorCon>
          <QuoteGeneratorInnerCon>
            <QuoteGeneratorTitle>
              Daily Inspiration Generator
            </QuoteGeneratorTitle>
            <br />
            <QuoteGeneratorSubtitle>
              Looking for a splash of inspiration? Generate a quote card with a
              random inspirational quote provided by{" "}
              <ChakraLink
                href="https://zenquotes.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ZenQuotes API
              </ChakraLink>
              .
              <Box>
                <br />
              </Box>
              <GenerateQuoteButton>
                <GenerateQuoteButtonText>
                  Generate Quote
                </GenerateQuoteButtonText>
              </GenerateQuoteButton>
            </QuoteGeneratorSubtitle>
          </QuoteGeneratorInnerCon>
        </QuoteGeneratorCon>
      </AbsoluteCenter>
      <Image src={cloud1} alt="cloudImage1" priority height={300} />

      <Image
        src={cloud2}
        alt="cloudImage2"
        priority
        height={300}
        style={{
          position: "fixed",
          zIndex: 1,
          right: "-120px",
          bottom: "10px",
        }}
      />

      <FooterContainer>
        <>
          Quotes Generated: {numberOfQuotes}
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
