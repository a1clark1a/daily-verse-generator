"use client";

import { useState, useTransition } from "react";
import {
  Link as ChakraLink,
  Text,
  Box,
  Image,
  Spinner,
  Button as ChakraButton, // Renamed to avoid conflict
  // --- CORRECT Dialog compound components ---
  Dialog,
  Portal, // Needed to render dialog outside main DOM tree
  CloseButton, // For the manual close button
  // --- Other necessary imports ---
  VStack,
  Center,
} from "@chakra-ui/react";

import { HiX } from "react-icons/hi";

import {
  QuoteGeneratorCon,
  QuoteGeneratorInnerCon,
  QuoteGeneratorSubtitle,
  QuoteGeneratorTitle,
  GenerateQuoteButton,
  GenerateQuoteButtonText,
} from "@/components/quoteGenerator/QuoteGeneratorElements";

import { generateQuoteAction } from "@/app/actions";

export function QuoteGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleGenerateClick = () => {
    setError(null);
    setImageUrl(null);
    setIsOpen(true);

    startTransition(async () => {
      const result = await generateQuoteAction();
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
    link.download = `quote-${Date.now()}.png`;
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
      <QuoteGeneratorCon>
        <QuoteGeneratorInnerCon>
          <QuoteGeneratorTitle>Daily Inspiration Generator</QuoteGeneratorTitle>
          <br />
          <QuoteGeneratorSubtitle>
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
            <GenerateQuoteButton
              onClick={handleGenerateClick}
              loading={isPending}
              disabled={isPending}
            >
              <GenerateQuoteButtonText>Generate Quote</GenerateQuoteButtonText>
            </GenerateQuoteButton>
          </QuoteGeneratorSubtitle>
        </QuoteGeneratorInnerCon>
      </QuoteGeneratorCon>

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
                    ? "Generating Quote..."
                    : error
                      ? "Error"
                      : "Your Quote"}
                </Dialog.Title>
              </Dialog.Header>

              {/* Use Dialog.CloseTrigger for the 'X' button */}
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
                      Failed to generate quote: {error}
                    </Text>
                  )}
                  {imageUrl && !isPending && !error && (
                    <Box
                      w="100%"
                      h="auto"
                      position="relative"
                      transition="transform 0.3s ease-in-out"
                      _hover={{
                        transform: "scale(1.15)",
                        zIndex: 10,
                      }}
                    >
                      <Image
                        src={imageUrl}
                        alt="Generated Quote"
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
                {/* Footer section */}
                {imageUrl && !isPending && !error && (
                  <ChakraButton
                    colorScheme="purple"
                    mr={3}
                    onClick={handleDownload}
                  >
                    Download
                  </ChakraButton>
                )}
                {/* Use Dialog.CloseTrigger for the "Close" button */}
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
