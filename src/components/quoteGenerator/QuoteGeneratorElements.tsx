import {
  Box,
  Container,
  ContainerProps,
  type BoxProps,
} from "@chakra-ui/react";

export const GradientBackgroundCon = (props: BoxProps) => {
  return (
    <Box
      minH="100vh"
      bgSize={"cover"}
      bgGradient={"to-r"}
      gradientFrom={"blackAlpha.400"}
      gradientTo={"cyan.400"}
      data-state="open"
      animationDuration="slow"
      animationStyle={{ _open: "gradient" }}
      {...props}
    />
  );
};

export const FooterContainer = (props: ContainerProps) => {
  return (
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
  );
};
