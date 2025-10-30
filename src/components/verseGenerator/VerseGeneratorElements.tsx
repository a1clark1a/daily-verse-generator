"use client";

import {
  AbsoluteCenter,
  Box,
  Button,
  ButtonProps,
  Center,
  Container,
  ContainerProps,
  Text,
  TextProps,
  type BoxProps,
} from "@chakra-ui/react";

export const GradientBackgroundCon = (props: BoxProps) => {
  return (
    <Box
      minH="100vh"
      {...props}
      bgGradient={{
        _light: "linear(135deg, tranquilCream.50 0%, tranquilSky.100 100%)",
        _dark: "linear(135deg, tranquilNavy.700 0%, tranquilTeal.800 100%)",
      }}
      bgSize="200% 200%"
      animation="gradient 15s ease infinite"
    />
  );
};

export const FooterContainer = (props: ContainerProps) => {
  return (
    <Center>
      <Container
        width={"100vw"}
        minH={100}
        maxW={"100%"}
        py={6}
        textAlign={"center"}
        fontSize={15}
        position={"absolute"}
        bottom={0}
        color={"white"}
        zIndex={9999999}
        bg="rgba(0, 0, 0, 0.2)"
        backdropFilter="blur(10px)"
        style={{
          fontFamily: "Source Code Pro, monospace",
        }}
        {...props}
      />
    </Center>
  );
};

export const VerseGeneratorCon = (props: ContainerProps) => {
  return (
    <Container
      minH={350}
      minW={350}
      height={"70vh"}
      width={"70vw"}
      zIndex={2}
      style={{
        background: "rgba( 0, 0, 70, 0.3 )",
        boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
        backdropFilter: "blur( 20px )",
        borderRadius: "10px",
        border: " 1px solid rgba( 255, 255, 255, 0.18 )",
      }}
      {...props}
    />
  );
};

export const VerseGeneratorInnerCon = (props: ContainerProps) => {
  return (
    <Container
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        position: "absolute",
        width: "100%",
      }}
      {...props}
    />
  );
};

export const VerseGeneratorTitle = (props: BoxProps) => {
  return (
    <Box
      fontFamily={"Permanent Marker, cursive"}
      fontSize={50}
      textAlign={"center"}
      color={"white"}
      padding={"0px 20px 0px 20px"}
      position={"relative"}
      mdDown={{ fontSize: 30 }}
      {...props}
    />
  );
};

export const VerseGeneratorSubtitle = (props: BoxProps) => {
  return (
    <Center>
      <Box
        color={"white"}
        fontFamily={"Caveat, cursive"}
        fontSize={35}
        position={"relative"}
        width={"100%"}
        textAlign={"center"}
        padding={"0px 20px 0px 20px"}
        mdDown={{ fontSize: 25 }}
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
      bg={{
        _light: "linear-gradient(135deg, purity.400 0%, calm.400 100%)",
        _dark:
          "linear-gradient(135deg, {colors.tranquilNavy.400} 0%, {colors.tranquilTeal.800} 100%)",
      }}
      boxShadow={" 0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"}
      backdropFilter={"blur( 20px )"}
      borderRadius={10}
      border={{
        _light: "2px solid",
        _dark: "1px solid rgba( 255, 255, 255, 0.18 )",
      }}
      borderColor={{
        _light: "purity.500",
        _dark: "transparent",
      }}
      _hover={{
        transform: "scale(1.1)",
        boxShadow: {
          _light: "0 12px 40px 0 rgba(44, 122, 123, 0.6)",
          _dark: "0 12px 40px 0 rgba(79, 209, 197, 0.5)",
        },
        bg: {
          _light: "linear-gradient(135deg, purity.500 0%, calm.500 100%)",
          _dark: "linear(135deg, tranquilTeal.600 0%, tranquilTeal.800 100%)",
        },
      }}
      style={{}}
      {...props}
    />
  );
};

export const GenerateVerseButtonText = (props: TextProps) => {
  return (
    <Text
      color={{
        _light: "white",
        _dark: "white",
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
