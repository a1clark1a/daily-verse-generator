import { defineAnimationStyles } from "@chakra-ui/react";

const animationStyles = defineAnimationStyles({
  gradient: {
    value: {
      animationName: "gradient",
      animationDuration: "2s",
      animationTimingFunction: "ease-in-out",
      animationIterationCount: "infinite",
    },
  },
  bounceFadeIn: {
    value: {
      animationName: "bounce fade-in",
      animationDuration: "5s",
      animationTimingFunction: "ease-in-out",
      animationIterationCount: "infinite",
    },
  },
});

export default animationStyles;
