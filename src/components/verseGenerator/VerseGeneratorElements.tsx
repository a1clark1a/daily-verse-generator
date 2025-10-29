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
      bgSize={"cover"}
      animation="gradient 15s ease infinite"
    />
  );
};

export const FooterContainer = (props: ContainerProps) => {
  return (
    <Center>
      <Container
        width={"100vw"}
        height={50}
        textAlign={"center"}
        fontSize={15}
        position={"absolute"}
        bottom={0}
        color={"white"}
        zIndex={9999999}
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
    <AbsoluteCenter>
      <Button
        height={100}
        width={300}
        marginTop={20}
        position={"relative"}
        transition={"0.2s all ease-in-out"}
        top={20}
        transformOrigin={"center"}
        background={"rgba( 0, 0, 70, 0.3 )"}
        boxShadow={" 0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"}
        backdropFilter={"blur( 20px )"}
        borderRadius={10}
        border={"1px solid rgba( 255, 255, 255, 0.18 )"}
        _hover={{
          filter: "brightness(3)",
          transition: "0.1s all ease-in-out",
          transform: "scale(1.1)",
          transformOrigin: "center",
        }}
        style={{}}
        {...props}
      />
    </AbsoluteCenter>
  );
};

export const GenerateVerseButtonText = (props: TextProps) => {
  return (
    <AbsoluteCenter>
      <Text
        color={"white"}
        fontFamily={"Caveat, cursive"}
        fontSize={35}
        width={"100%"}
        textAlign={"center"}
        {...props}
      />
    </AbsoluteCenter>
  );
};
