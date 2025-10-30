"use client";

import { IconButton as ChakraIconButton, IconButtonProps } from "@chakra-ui/react";
import * as React from "react";
import { HiX } from "react-icons/hi";

export type CloseButtonProps = IconButtonProps;

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function CloseButton(props, ref) {
  return (
    <ChakraIconButton variant="ghost" aria-label="Close" ref={ref} {...props}>
      {props.children ?? <HiX />}
    </ChakraIconButton>
  );
});
