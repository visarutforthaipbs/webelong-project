import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    // Main brand colors - ONLY these two
    belongingBlue: "#4A90E2",
    hopeGreen: "#50E3C4",

    // Monotone colors for UI elements
    deepNavy: "#2C3E50",

    // Aliases for consistency
    belongingGreen: "#50E3C4",
  },
  fonts: {
    heading: `'DB Helvethaica X', 'Noto Sans Thai', sans-serif`,
    body: `'DB Helvethaica X', 'Noto Sans Thai', sans-serif`,
  },
  fontSizes: {
    xs: "0.875rem", // 14px - Increased from 12px
    sm: "1rem", // 16px - Increased from 14px
    md: "1.125rem", // 18px - Increased from 16px
    lg: "1.25rem", // 20px - Increased from 18px
    xl: "1.5rem", // 24px - Increased from 20px
    "2xl": "1.875rem", // 30px - Increased from 24px
    "3xl": "2.25rem", // 36px - Increased from 30px
    "4xl": "3rem", // 48px - Increased from 36px
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
  radii: {
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "lg",
        fontFamily: "heading",
        fontSize: "md",
      },
      sizes: {
        sm: {
          fontSize: "sm",
          px: 4,
          py: 2,
        },
        md: {
          fontSize: "md",
          px: 6,
          py: 3,
        },
        lg: {
          fontSize: "lg",
          px: 8,
          py: 4,
        },
      },
    },
    Card: {
      baseStyle: {
        borderRadius: "lg",
        bg: "white",
        boxShadow: "md",
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: "heading",
        fontWeight: "bold",
        color: "deepNavy",
      },
      sizes: {
        sm: { fontSize: "xl" },
        md: { fontSize: "2xl" },
        lg: { fontSize: "3xl" },
        xl: { fontSize: "4xl" },
      },
    },
    Text: {
      baseStyle: {
        fontFamily: "body",
        color: "deepNavy",
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: "md",
        fontWeight: "medium",
        color: "deepNavy",
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "deepNavy",
        fontFamily: "body",
        fontSize: "md",
      },
    },
  },
});

export default theme;
