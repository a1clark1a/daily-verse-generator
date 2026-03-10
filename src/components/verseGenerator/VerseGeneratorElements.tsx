"use client";

import {
  Button,
  ButtonProps,
  Center,
  Container,
  ContainerProps,
  Text,
  TextProps,
} from "@chakra-ui/react";

export const FooterContainer = (props: ContainerProps) => {
  return (
    <Center>
      <Container
        as="footer"
        width={"100vw"}
        minH={100}
        maxW={"100%"}
        py={6}
        textAlign={"center"}
        fontSize={15}
        color={"white"}
        bg={{
          _light: "tranquilNavy.500",
          _dark: "tranquilTeal.900",
        }}
        backdropFilter="blur(10px)"
        fontFamily="var(--font-source-code-pro), monospace"
        {...props}
      />
    </Center>
  );
};

export const GenerateVerseButton = (props: ButtonProps) => {
  return (
    <Button
      height={100}
      width={300}
      position={"relative"}
      transition={"0.2s all ease-in-out"}
      transformOrigin={"center"}
      backgroundImage={{
        _light:
          "linear-gradient(135deg, {colors.tranquilNavy.400} 0%, {colors.tranquilNavy.600} 100%)",
        _dark:
          "linear-gradient(135deg, {colors.tranquilTeal.600} 0%, {colors.tranquilTeal.800} 100%)",
      }}
      boxShadow={{
        _light: "0 8px 32px 0 rgba(44, 82, 130, 0.3)",
        _dark: "0 8px 32px 0 rgba(79, 209, 197, 0.25)",
      }}
      backdropFilter={"blur( 20px )"}
      borderRadius={10}
      border={{
        _light: "1px solid rgba(255, 255, 255, 0.18)",
        _dark: "1px solid rgba( 255, 255, 255, 0.18 )",
      }}
      borderColor={{
        _light: "transparent",
        _dark: "transparent",
      }}
      _hover={{
        transform: "scale(1.1)",
        boxShadow: {
          _light: "0 12px 40px 0 rgba(44, 82, 130, 0.45)",
          _dark: "0 12px 40px 0 rgba(79, 209, 197, 0.4)",
        },
        backgroundImage: {
          _light:
            "linear-gradient(135deg, {colors.tranquilNavy.500} 0%, {colors.tranquilNavy.700} 100%)",
          _dark:
            "linear-gradient(135deg, {colors.tranquilTeal.500} 0%, {colors.tranquilTeal.700} 100%)",
        },
      }}
      {...props}
    />
  );
};

export const GenerateVerseButtonText = (props: TextProps) => {
  return (
    <Text
      color={{
        _light: "tranquilSky.100",
        _dark: "tranquilSky.100",
      }}
      fontFamily={"Caveat, cursive"}
      fontSize={35}
      fontWeight="bold"
      width={"100%"}
      textAlign={"center"}
      {...props}
    />
  );
};
