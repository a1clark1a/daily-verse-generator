import { Box, type BoxProps } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

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
