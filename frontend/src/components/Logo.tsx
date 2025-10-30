import { Box, Text, VStack } from "@chakra-ui/react";

export default function Logo(props: React.ComponentProps<typeof Box>) {
  return (
    <Box {...props} display="inline-block">
      <VStack spacing={0} align="flex-start">
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="bold"
          color="white"
          whiteSpace="nowrap"
          lineHeight="1.2"
        >
          Migrant Friendly Index
        </Text>
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="medium"
          color="white"
          whiteSpace="nowrap"
          lineHeight="1.2"
        >
          ดัชนีวัดเมืองเป็นมิตรต่อคนอื่น
        </Text>
      </VStack>
    </Box>
  );
}
