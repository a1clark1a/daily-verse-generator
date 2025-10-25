import Image from "next/image";
import {
  Link as ChakraLink,
  Text,
  Icon,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { HiHeart } from "react-icons/hi";

import { QuoteGenerator } from "@/components/quoteGenerator/QuoteGenerator";

import {
  FooterContainer,
  GradientBackgroundCon,
} from "@/components/quoteGenerator/QuoteGeneratorElements";

// images
import cloud1 from "@/assets/cloud-and-thunder.png";
import cloud2 from "@/assets/cloudy-weather.png";

async function getInitialQuoteCount() {
  try {
    const url = process.env.GET_QUOTE_COUNT_URL;
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
  const initialCount = await getInitialQuoteCount();

  return (
    <GradientBackgroundCon>
      <AbsoluteCenter>
        <QuoteGenerator />
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
          Quotes Generated: {initialCount}
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
