import Image from "next/image";
import {
  Link as ChakraLink,
  Text,
  Icon,
  Box,
  Container,
  VStack,
} from "@chakra-ui/react";
import { HiHeart } from "react-icons/hi";

import { VerseGenerator } from "@/components/verseGenerator/VerseGenerator";
import { Header } from "@/components/verseGenerator/Header";
import { TranslationProvider } from "@/contexts/TranslationContext";

import { FooterContainer } from "@/components/verseGenerator/VerseGeneratorElements";

import { getInitialVerseCount, getDailyImage } from "@/app/actions";

// images
import bannerImage from "@/assets/tranquil.png";

export default async function Home() {
  const initialCount = await getInitialVerseCount();
  const dailyImage = await getDailyImage();

  return (
    <TranslationProvider>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Container maxW="7xl" pt="100px" pb="200px">
        <VStack gap={8} align="center">
          {/* Banner Image */}
          <Box
            width={{ base: "90%", md: "80%", lg: "70%" }}
            maxW="800px"
            height={{ base: "200px", md: "300px" }}
            borderRadius="lg"
            overflow="hidden"
            border="2px solid"
            borderColor="whiteAlpha.300"
            boxShadow="2xl"
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
            position="relative"
          >
            <Image
              src={dailyImage?.url || bannerImage}
              alt={dailyImage?.alt || "Tranquil Banner"}
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              priority
            />
          </Box>

          {/* Photo Credit */}
          {dailyImage && (
            <Text
              fontSize="xs"
              color={{ _light: "tranquilNavy.600", _dark: "tranquilCream.300" }}
            >
              Photo by{" "}
              <ChakraLink
                href={dailyImage.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                textDecoration="underline"
                _hover={{
                  color: {
                    _light: "tranquilTeal.500",
                    _dark: "tranquilTeal.300",
                  },
                }}
              >
                {dailyImage.photographer}
              </ChakraLink>{" "}
              on Unsplash
            </Text>
          )}

          {/* Generate Button */}
          <Box mt={4}>
            <VerseGenerator />
          </Box>
        </VStack>
      </Container>

      {/* Footer */}
      <FooterContainer>
        <VStack gap={2}>
          {/* Footer Text */}
          <Text
            fontSize="md"
            fontWeight="semibold"
            color={{
              _light: "white",
              _dark: "tranquilCream.100",
            }}
          >
            Verses Generated: {initialCount}
          </Text>
          <Text
            fontSize="sm"
            color={{
              _light: "white",
              _dark: "tranquilCream.100",
            }}
          >
            Developed with{" "}
            <Icon color="red.500">
              <HiHeart />
            </Icon>{" "}
            by{" "}
            <ChakraLink
              href="https://acperfecto.vercel.app/"
              target="_blank"
              rel="noreferrer"
              textDecoration="underline"
              _hover={{
                color: {
                  _light: "tranquilTeal.500",
                  _dark: "tranquilTeal.300",
                },
              }}
            >
              Clark Perfecto
            </ChakraLink>{" "}
            @{new Date().getFullYear()}
          </Text>
          <Text
            fontSize="xs"
            color={{
              _light: "white",
              _dark: "tranquilCream.100",
            }}
          >
            <ChakraLink
              href="https://www.flaticon.com/free-icons/bible"
              title="bible icons"
              target="_blank"
              rel="noreferrer"
              textDecoration="underline"
              _hover={{
                color: {
                  _light: "tranquilTeal.500",
                  _dark: "tranquilTeal.300",
                },
              }}
            >
              Bible icons created by Freepik - Flaticon
            </ChakraLink>
          </Text>
        </VStack>
      </FooterContainer>
    </TranslationProvider>
  );
}
