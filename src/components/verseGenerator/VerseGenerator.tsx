"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Text,
  Box,
  Image,
  Spinner,
  Button as ChakraButton,
  Dialog,
  Portal,
  VStack,
  Center,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaShare,
  FaCopy,
  FaCheck,
} from "react-icons/fa";

import {
  GenerateVerseButton,
  GenerateVerseButtonText,
  BackgroundModeToggle,
} from "@/components/verseGenerator/VerseGeneratorElements";

import { generateVerseAction } from "@/app/actions";
import { useTranslation } from "@/contexts/TranslationContext";

interface VerseGeneratorProps {
  dailyImageUrl?: string | null;
}

export function VerseGenerator({ dailyImageUrl = null }: VerseGeneratorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [supportsShare, setSupportsShare] = useState(false);
  const [supportsClipboard, setSupportsClipboard] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [backgroundMode, setBackgroundMode] = useState<"gradient" | "image">(
    "gradient",
  );
  const { translation } = useTranslation();

  useEffect(() => {
    setSupportsShare(typeof navigator !== "undefined" && "share" in navigator);
    setSupportsClipboard(
      typeof navigator !== "undefined" &&
        "clipboard" in navigator &&
        typeof ClipboardItem !== "undefined",
    );
  }, []);

  const handleGenerateClick = async () => {
    setError(null);
    setImageUrl(null);
    setIsOpen(true);

    startTransition(async () => {
      const result = await generateVerseAction(
        translation,
        backgroundMode,
        backgroundMode === "image" ? dailyImageUrl : null,
      );
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
      setImageUrl(null);
      setError(null);
      setCopyStatus("idle");
    }
  };

  const handleShare = async (
    platform: "facebook" | "twitter" | "instagram" | "native",
  ) => {
    if (!imageUrl) return;

    try {
      // Try native Web Share API first (works best for mobile and Instagram)
      if (
        (platform === "native" || platform === "instagram") &&
        navigator.share
      ) {
        // Fetch the image as a blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "verse.png", { type: "image/png" });

        // Check if files can be shared
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Daily Verse",
            text: "Check out this inspirational verse!",
            files: [file],
          });
          return;
        }
      }

      // For Instagram on desktop or if native share fails, download the image
      if (platform === "instagram") {
        // Instagram doesn't have a web share API, so we download and prompt user
        handleDownload();
        alert(
          "Image downloaded! Please upload it to Instagram from your device.",
        );
        return;
      }

      // Platform-specific sharing for Facebook and Twitter
      const shareUrl = encodeURIComponent(window.location.origin);
      const text = encodeURIComponent("Check out this inspirational verse!");

      switch (platform) {
        case "facebook":
          // Facebook doesn't support direct image sharing via URL, so we open sharer
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
            "_blank",
            "width=600,height=400",
          );
          break;
        case "twitter":
          // Twitter intent URL
          window.open(
            `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
            "_blank",
            "width=600,height=400",
          );
          break;
      }
    } catch (error) {
      console.error("Error sharing:", error);
      handleDownload();
    }
  };

  const handleCopyImage = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const pngBlob = new Blob([blob], { type: "image/png" });
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob }),
      ]);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to copy image:", error);
    }
  };

  return (
    <>
      <VStack gap={4} align="center">
        {dailyImageUrl && (
          <BackgroundModeToggle
            value={backgroundMode}
            onChange={setBackgroundMode}
          />
        )}
        <GenerateVerseButton
          onClick={handleGenerateClick}
          loading={isPending}
          disabled={isPending}
        >
          <GenerateVerseButtonText>Generate Verse</GenerateVerseButtonText>
        </GenerateVerseButton>
      </VStack>

      <Dialog.Root // Main wrapper, controls state
        lazyMount // Only mount content when open
        open={isOpen}
        onOpenChange={handleOpenChange} // Handles closing and state reset
        placement={"center"}
      >
        <Portal>
          {/* Renders dialog outside normal DOM flow */}
          <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(10px)" />
          {/* The overlay */}
          <Dialog.Positioner>
            {/* Centers the content */}
            <Dialog.Content // The dialog box itself
              bg={{
                _light: "rgba(255, 255, 255, 0.95)",
                _dark: "rgba(10, 77, 78, 0.85)",
              }}
              backdropFilter="blur(15px)"
              border="1px solid"
              borderColor={{
                _light: "tranquilTeal.200",
                _dark: "tranquilTeal.600",
              }}
              borderRadius="lg"
              color={{
                _light: "tranquilNavy.700",
                _dark: "tranquilSky.50",
              }}
              maxW="1000px"
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

              <Dialog.CloseTrigger />

              <Dialog.Body>
                {/* Body section */}
                <Center minH="300px">
                  {isPending && (
                    <VStack>
                      <Spinner size="xl" color="tranquilTeal.400" />
                      <Text mt={4}>Fetching your inspiration...</Text>
                    </VStack>
                  )}
                  {error && (
                    <Text color="red.500" textAlign="center">
                      Failed to generate Verse: {error}
                    </Text>
                  )}
                  {imageUrl && !isPending && !error && (
                    <Box
                      w="90%"
                      h="auto"
                      position="relative"
                      transition="transform 0.3s ease-in-out"
                      cursor="pointer"
                      _hover={{
                        transform: {
                          base: "none",
                          md: "scale(1.4)",
                        },
                        zIndex: 10,
                      }}
                      _active={{
                        transform: {
                          base: "scale(1.3)",
                          md: "scale(1.4)",
                        },
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
                        maxH={{ base: "300px", md: "400px" }}
                        placeSelf={"center"}
                      />
                    </Box>
                  )}
                </Center>
              </Dialog.Body>

              <Dialog.Footer
                justifyContent="center"
                flexDirection="column"
                gap={3}
              >
                {imageUrl && !isPending && !error && (
                  <>
                    {/* Share Buttons */}
                    <VStack gap={2} w="100%">
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color={{
                          _light: "tranquilNavy.600",
                          _dark: "tranquilSky.200",
                        }}
                      >
                        Share your verse:
                      </Text>
                      <HStack gap={3}>
                        {/* Native Share (Mobile) - Only show if Web Share API is available */}
                        {supportsShare && (
                          <IconButton
                            aria-label="Share"
                            onClick={() => handleShare("native")}
                            size="lg"
                            variant="outline"
                            colorScheme="teal"
                            borderColor={{
                              _light: "tranquilTeal.400",
                              _dark: "tranquilTeal.300",
                            }}
                            color={{
                              _light: "tranquilTeal.600",
                              _dark: "tranquilTeal.200",
                            }}
                            _hover={{
                              bg: {
                                _light: "tranquilTeal.50",
                                _dark: "tranquilTeal.900",
                              },
                              transform: "scale(1.1)",
                            }}
                            transition="all 0.2s"
                          >
                            <FaShare size={20} />
                          </IconButton>
                        )}

                        {/* Facebook */}
                        <IconButton
                          aria-label="Share on Facebook"
                          onClick={() => handleShare("facebook")}
                          size="lg"
                          variant="outline"
                          colorScheme="blue"
                          borderColor={{
                            _light: "tranquilSky.400",
                            _dark: "tranquilSky.300",
                          }}
                          color={{
                            _light: "tranquilSky.600",
                            _dark: "tranquilSky.200",
                          }}
                          _hover={{
                            bg: {
                              _light: "tranquilSky.50",
                              _dark: "tranquilSky.900",
                            },
                            transform: "scale(1.1)",
                          }}
                          transition="all 0.2s"
                        >
                          <FaFacebook size={20} />
                        </IconButton>

                        {/* Twitter */}
                        <IconButton
                          aria-label="Share on Twitter"
                          onClick={() => handleShare("twitter")}
                          size="lg"
                          variant="outline"
                          colorScheme="blue"
                          borderColor={{
                            _light: "tranquilSky.500",
                            _dark: "tranquilSky.400",
                          }}
                          color={{
                            _light: "tranquilSky.700",
                            _dark: "tranquilSky.300",
                          }}
                          _hover={{
                            bg: {
                              _light: "tranquilSky.50",
                              _dark: "tranquilSky.900",
                            },
                            transform: "scale(1.1)",
                          }}
                          transition="all 0.2s"
                        >
                          <FaTwitter size={20} />
                        </IconButton>

                        {/* Instagram */}
                        <IconButton
                          aria-label="Share on Instagram"
                          onClick={() => handleShare("instagram")}
                          size="lg"
                          variant="outline"
                          borderColor={{
                            _light: "tranquilGold.400",
                            _dark: "tranquilGold.300",
                          }}
                          color={{
                            _light: "tranquilGold.600",
                            _dark: "tranquilGold.200",
                          }}
                          _hover={{
                            bg: {
                              _light: "tranquilGold.50",
                              _dark: "tranquilGold.900",
                            },
                            transform: "scale(1.1)",
                          }}
                          transition="all 0.2s"
                        >
                          <FaInstagram size={20} />
                        </IconButton>
                      </HStack>
                    </VStack>

                    {/* Action Buttons */}
                    <HStack gap={3} mt={2}>
                      <ChakraButton
                        bg={{
                          _light: "tranquilTeal.500",
                          _dark: "tranquilTeal.600",
                        }}
                        color="white"
                        _hover={{
                          bg: {
                            _light: "tranquilTeal.600",
                            _dark: "tranquilTeal.500",
                          },
                        }}
                        onClick={handleDownload}
                      >
                        Download
                      </ChakraButton>

                      {supportsClipboard && (
                        <ChakraButton
                          bg={{
                            _light: "tranquilSky.500",
                            _dark: "tranquilSky.600",
                          }}
                          color="white"
                          _hover={{
                            bg: {
                              _light: "tranquilSky.600",
                              _dark: "tranquilSky.500",
                            },
                          }}
                          onClick={handleCopyImage}
                        >
                          {copyStatus === "copied" ? (
                            <>
                              <FaCheck /> Copied!
                            </>
                          ) : (
                            <>
                              <FaCopy /> Copy Image
                            </>
                          )}
                        </ChakraButton>
                      )}

                      <Dialog.CloseTrigger asChild>
                        <ChakraButton
                          variant="ghost"
                          color={{
                            _light: "tranquilNavy.600",
                            _dark: "tranquilSky.200",
                          }}
                          _hover={{
                            bg: {
                              _light: "tranquilTeal.50",
                              _dark: "whiteAlpha.200",
                            },
                          }}
                        >
                          Close
                        </ChakraButton>
                      </Dialog.CloseTrigger>
                    </HStack>
                  </>
                )}

                {!imageUrl && (
                  <Dialog.CloseTrigger asChild>
                    <ChakraButton
                      variant="ghost"
                      color={{
                        _light: "tranquilNavy.600",
                        _dark: "tranquilSky.200",
                      }}
                      _hover={{
                        bg: {
                          _light: "tranquilTeal.50",
                          _dark: "whiteAlpha.200",
                        },
                      }}
                    >
                      Close
                    </ChakraButton>
                  </Dialog.CloseTrigger>
                )}
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
