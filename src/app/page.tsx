import {
  Link as ChakraLink,
  Text,
  Icon,
  Box,
  Container,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { HiHeart } from "react-icons/hi";

import { VerseGenerator } from "@/components/verseGenerator/VerseGenerator";
import { Header } from "@/components/verseGenerator/Header";
import { TranslationProvider } from "@/contexts/TranslationContext";

import { FooterContainer } from "@/components/verseGenerator/VerseGeneratorElements";
import { BannerImage } from "@/components/banner/BannerImage";

import { getInitialVerseCount, getDailyImage } from "@/app/actions";

// images
import bannerImage from "@/assets/tranquil.png";

export default async function Home() {
  const initialCount = await getInitialVerseCount();
  const dailyImage = await getDailyImage();

  return (
    <Flex direction="column" minH="100vh">
      <TranslationProvider>
        {/* Skip Navigation */}
        <ChakraLink
          href="#main-content"
          position="absolute"
          top="-40px"
          left="0"
          bg="tranquilTeal.700"
          color="white"
          px={4}
          py={2}
          zIndex={1001}
          _focus={{ top: "0" }}
        >
          Skip to main content
        </ChakraLink>

        {/* Header */}
        <Header />

        {/* Main Content */}
        <Container
          as="main"
          id="main-content"
          maxW="7xl"
          pt="100px"
          pb={8}
          flex="1"
        >
          <VStack gap={8} align="center">
            {/* Banner Image */}
            <BannerImage
              src={dailyImage?.url || bannerImage}
              alt={dailyImage?.alt || "Tranquil Banner"}
            />

            {/* Photo Credit */}
            {dailyImage && (
              <Text
                fontSize="xs"
                color={{
                  _light: "tranquilNavy.600",
                  _dark: "tranquilSky.200",
                }}
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
              <VerseGenerator dailyImageUrl={dailyImage?.url ?? null} />
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
                _dark: "tranquilSky.100",
              }}
            >
              Verses Generated: {initialCount}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={{
                _light: "white",
                _dark: "tranquilSky.100",
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
                color={{
                  _light: "white",
                  _dark: "tranquilSky.100",
                }}
                _hover={{
                  color: {
                    _light: "tranquilTeal.300",
                    _dark: "tranquilSky.300",
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
                _dark: "tranquilSky.100",
              }}
            >
              <ChakraLink
                href="https://www.flaticon.com/free-icons/bible"
                title="bible icons"
                target="_blank"
                rel="noreferrer"
                color={{
                  _light: "white",
                  _dark: "tranquilSky.100",
                }}
                _hover={{
                  color: {
                    _light: "tranquilTeal.300",
                    _dark: "tranquilSky.300",
                  },
                }}
              >
                Bible icons created by Freepik - Flaticon
              </ChakraLink>
            </Text>
          </VStack>
        </FooterContainer>
      </TranslationProvider>
    </Flex>
  );
}
