import { GradientBackgroundCon } from "@/components/quoteGenerator/QuoteGeneratorElements";
import { Flex, Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <GradientBackgroundCon>
      <Flex
        as="main"
        direction="column"
        align="center"
        justify="center"
        h="100%"
      >
        <Heading color="white">Inspirational Quote</Heading>
      </Flex>
    </GradientBackgroundCon>
  );
}
