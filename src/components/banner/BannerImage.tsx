"use client";

import { useState, useEffect } from "react";
import Image, { type StaticImageData } from "next/image";
import { Box } from "@chakra-ui/react";

interface BannerImageProps {
  src: string | StaticImageData;
  alt: string;
}

export function BannerImage({ src, alt }: BannerImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <Box
        width={{ base: "90%", md: "80%", lg: "70%" }}
        maxW="800px"
        height={{ base: "200px", md: "300px" }}
        borderRadius="lg"
        overflow="hidden"
        border="2px solid"
        borderColor="whiteAlpha.300"
        boxShadow={{
          _light: "0 25px 50px -12px rgba(44, 82, 130, 0.25)",
          _dark: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
        bg="whiteAlpha.100"
        backdropFilter="blur(10px)"
        position="relative"
        cursor="pointer"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`View full image: ${alt}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        _hover={{ opacity: 0.9 }}
        transition="opacity 0.2s"
      >
        <Image
          src={src}
          alt={alt}
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority
        />
      </Box>

      {/* Lightbox Overlay */}
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          bg="blackAlpha.800"
          zIndex={2000}
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={() => setIsOpen(false)}
          p={{ base: 4, md: 8 }}
        >
          <Box
            position="relative"
            width={{ base: "95vw", md: "85vw", lg: "75vw" }}
            height={{ base: "60vh", md: "75vh", lg: "80vh" }}
            maxW="1200px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Image
              src={src}
              alt={alt}
              fill
              style={{
                objectFit: "contain",
                objectPosition: "center",
              }}
              sizes="90vw"
            />
          </Box>
        </Box>
      )}
    </>
  );
}
