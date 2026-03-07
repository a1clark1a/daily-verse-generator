"use client";

import { Box, Button, Container, Text, VStack } from "@chakra-ui/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container maxW="7xl" pt="100px">
      <VStack gap={6} align="center">
        <Box textAlign="center">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={{
              _light: "tranquilNavy.700",
              _dark: "tranquilCream.100",
            }}
          >
            Something went wrong
          </Text>
          <Text
            mt={2}
            color={{
              _light: "tranquilNavy.500",
              _dark: "tranquilCream.300",
            }}
          >
            {error.message || "An unexpected error occurred."}
          </Text>
        </Box>
        <Button
          onClick={reset}
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
        >
          Try again
        </Button>
      </VStack>
    </Container>
  );
}
