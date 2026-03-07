import { Box, Container, VStack, Skeleton } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Container maxW="7xl" pt="100px" pb={8}>
      <VStack gap={8} align="center">
        {/* Banner skeleton */}
        <Skeleton
          width={{ base: "90%", md: "80%", lg: "70%" }}
          maxW="800px"
          height={{ base: "200px", md: "300px" }}
          borderRadius="lg"
        />

        {/* Credit skeleton */}
        <Skeleton height="14px" width="200px" />

        {/* Button skeleton */}
        <Box mt={4}>
          <Skeleton height="100px" width="300px" borderRadius="10px" />
        </Box>
      </VStack>
    </Container>
  );
}
