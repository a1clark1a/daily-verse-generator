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

import {
  FooterContainer,
  GradientBackgroundCon,
} from "@/components/verseGenerator/VerseGeneratorElements";

import { getInitialVerseCount } from "@/app/actions";

// images
import bannerImage from "@/assets/tranquil.png";

export default async function Home() {
  const initialCount = await getInitialVerseCount();

  return (
    <TranslationProvider>
      <GradientBackgroundCon position="relative" overflow="hidden" minH="100vh">
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
                src={bannerImage}
                alt="Tranquil Banner"
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                priority
              />
            </Box>

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
            <Text fontSize="md" fontWeight="semibold" color="white">
              Verses Generated: {initialCount}
            </Text>
            <Text fontSize="sm" color="whiteAlpha.900">
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
                color="white"
                _hover={{ color: "tranquilTeal.200" }}
              >
                Clark Perfecto
              </ChakraLink>{" "}
              @{new Date().getFullYear()}
            </Text>
          </VStack>
        </FooterContainer>
      </GradientBackgroundCon>
    </TranslationProvider>
  );
}
