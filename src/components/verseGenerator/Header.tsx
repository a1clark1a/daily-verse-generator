"use client";

import {
  Box,
  Container,
  Flex,
  IconButton,
  Text,
  HStack,
  createListCollection,
} from "@chakra-ui/react";
import { HiBookOpen } from "react-icons/hi";
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
            <IconButton
              aria-label="Bible"
              variant="ghost"
              size="lg"
              color={{
                _light: "tranquilTeal.600",
                _dark: "tranquilTeal.200",
              }}
            >
              <HiBookOpen size={24} />
            </IconButton>
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
