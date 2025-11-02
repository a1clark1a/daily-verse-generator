"use client";

import {
  Box,
  Container,
  Flex,
  Text,
  HStack,
  createListCollection,
} from "@chakra-ui/react";
import Image from "next/image";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useTranslation } from "@/contexts/TranslationContext";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

export function Header() {
  const { translation, setTranslation } = useTranslation();

  const translations = createListCollection({
    items: [
      { value: "kjv", label: "KJV" },
      { value: "web", label: "WEB" },
      { value: "asv", label: "ASV" },
      { value: "bbe", label: "BBE" },
      { value: "darby", label: "Darby" },
      { value: "ylt", label: "YLT" },
      { value: "oeb-us", label: "OEB-US" },
    ],
  });

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg={{
        _light: "rgba(255, 255, 255, 0.85)",
        _dark: "rgba(10, 77, 78, 0.5)",
      }}
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor={{
        _light: "tranquilTeal.200",
        _dark: "tranquilTeal.700",
      }}
      zIndex={1000}
      py={3}
      px={4}
    >
      <Container maxW="100%" position="relative">
        <Flex justify="space-between" align="center">
          {/* Left: Bible Icon + Translation Dropdown */}
          <HStack gap={2} flex={{ base: "0", md: "1" }}>
            <Box
              width="40px"
              height="40px"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src="/favicon-72x72.png"
                alt="Bible"
                width={72}
                height={72}
                style={{ objectFit: "contain" }}
              />
            </Box>
            <SelectRoot
              collection={translations}
              value={[translation]}
              onValueChange={(e) => setTranslation(e.value[0])}
              size="sm"
              width="100px"
            >
              <SelectTrigger>
                <SelectValueText placeholder="Select translation" />
              </SelectTrigger>
              <SelectContent>
                {translations.items.map((t) => (
                  <SelectItem key={t.value} item={t}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </HStack>

          {/* Center: Title */}
          <Text
            position={{ base: "static", md: "absolute" }}
            left={{ md: "50%" }}
            transform={{ md: "translateX(-50%)" }}
            fontSize={{ base: "lg", md: "2xl" }}
            fontWeight="bold"
            color={{
              _light: "tranquilNavy.700",
              _dark: "tranquilCream.100",
            }}
            fontFamily="Permanent Marker, cursive"
            pointerEvents={{ md: "none" }}
          >
            Daily Verse
          </Text>

          {/* Right: Dark Mode Toggle */}
          <Box
            flex={{ base: "0", md: "1" }}
            display="flex"
            justifyContent="flex-end"
          >
            <ColorModeButton
              size="lg"
              color={{
                _light: "tranquilGold.500",
                _dark: "tranquilGold.300",
              }}
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
