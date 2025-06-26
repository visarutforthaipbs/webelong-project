import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    belongingBlue: "#4A90E2",
    hopeGreen: "#50E3C2",
    warmSand: "#F5E3C3",
    deepNavy: "#22313F",
    white: "#FFFFFF",
    belongingGreen: "#50E3C2", // Alias for hopeGreen
  },
  fonts: {
    heading: `'DB Helvethaica X', 'Noto Sans Thai', sans-serif`,
    body: `'DB Helvethaica X', 'Noto Sans Thai', sans-serif`,
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
  radii: {
    md: "16px",
    lg: "24px",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "lg",
        fontFamily: "heading",
      },
    },
    Card: {
      baseStyle: {
        borderRadius: "lg",
        bg: "warmSand",
        boxShadow: "md",
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: "heading",
        fontWeight: "bold",
      },
    },
    Text: {
      baseStyle: {
        fontFamily: "body",
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "deepNavy",
        fontFamily: "body",
      },
    },
  },
});

export default theme;
