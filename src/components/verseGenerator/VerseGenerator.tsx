"use client";

import { useState, useTransition } from "react";
import {
  Link as ChakraLink,
  Text,
  Box,
  Image,
  Spinner,
  Button as ChakraButton,
  Dialog,
  Portal,
  VStack,
  Center,
} from "@chakra-ui/react";

import { HiX } from "react-icons/hi";

import {
  VerseGeneratorCon,
  VerseGeneratorInnerCon,
  VerseGeneratorSubtitle,
  VerseGeneratorTitle,
  GenerateVerseButton,
  GenerateVerseButtonText,
} from "@/components/verseGenerator/VerseGeneratorElements";

import { generateVerseAction } from "@/app/actions";

export function VerseGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleGenerateClick = () => {
    setError(null);
    setImageUrl(null);
    setIsOpen(true);

    startTransition(async () => {
      const result = await generateVerseAction();
      if (result.error) {
        setError(result.error);
      } else if (result.imageUrl) {
        setImageUrl(result.imageUrl);
      }
    });
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `Verse-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenChange = (details: { open: boolean }) => {
    setIsOpen(details.open);
    if (!details.open) {
      // Reset state when closing
      setImageUrl(null);
      setError(null);
    }
  };

  return (
    <>
      <VerseGeneratorCon>
        <VerseGeneratorInnerCon>
          <VerseGeneratorTitle>Your Daily Bible Verse</VerseGeneratorTitle>
          <br />
          <VerseGeneratorSubtitle>
            Looking for a splash of inspiration? Generate a quote card with a
            random inspiration quote provided by{" "}
            <ChakraLink
              href="https://zenquotes.uo/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ZenQuotes API
            </ChakraLink>
            .
            <Box>
              <br />
            </Box>
            <GenerateVerseButton
              onClick={handleGenerateClick}
              loading={isPending}
              disabled={isPending}
            >
              <GenerateVerseButtonText>Generate Verse</GenerateVerseButtonText>
            </GenerateVerseButton>
          </VerseGeneratorSubtitle>
        </VerseGeneratorInnerCon>
      </VerseGeneratorCon>

      <Dialog.Root // Main wrapper, controls state
        lazyMount // Only mount content when open
        open={isOpen}
        onOpenChange={handleOpenChange} // Handles closing and state reset
      >
        <Portal>
          {/* Renders dialog outside normal DOM flow */}
          <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(10px)" />
          {/* The overlay */}
          <Dialog.Positioner>
            {/* Centers the content */}
            <Dialog.Content // The dialog box itself
              bg="rgba(40, 40, 80, 0.8)"
              backdropFilter="blur(15px)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              borderRadius="lg"
              color="white"
              maxW="xl"
            >
              <Dialog.Header textAlign="center">
                <Dialog.Title>
                  {isPending
                    ? "Generating Verse..."
                    : error
                      ? "Error"
                      : "Your Verse"}
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.CloseTrigger asChild></Dialog.CloseTrigger>

              <Dialog.Body>
                {/* Body section */}
                <Center minH="300px">
                  {isPending && (
                    <VStack>
                      <Spinner size="xl" color="purple.300" />
                      <Text mt={4}>Fetching your inspiration...</Text>
                    </VStack>
                  )}
                  {error && (
                    <Text color="red.300" textAlign="center">
                      Failed to generate Verse: {error}
                    </Text>
                  )}
                  {imageUrl && !isPending && !error && (
                    <Box
                      w="50%"
                      h="auto"
                      position="relative"
                      transition="transform 0.3s ease-in-out"
                      _hover={{
                        transform: "scale(2.50)",
                        zIndex: 10,
                      }}
                    >
                      <Image
                        src={imageUrl}
                        alt="Generated Verse"
                        boxShadow="lg"
                        borderRadius="md"
                        objectFit="contain"
                        maxW="100%"
                        maxH="400px"
                      />
                    </Box>
                  )}
                </Center>
              </Dialog.Body>

              <Dialog.Footer justifyContent="center">
                {imageUrl && !isPending && !error && (
                  <ChakraButton
                    colorScheme="purple"
                    mr={3}
                    onClick={handleDownload}
                  >
                    Download
                  </ChakraButton>
                )}

                <Dialog.CloseTrigger asChild>
                  <ChakraButton
                    variant="ghost"
                    color="gray.300"
                    _hover={{ bg: "whiteAlpha.200" }}
                  >
                    Close
                  </ChakraButton>
                </Dialog.CloseTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
