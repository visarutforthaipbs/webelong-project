import { Box, Image } from "@chakra-ui/react";

export default function Logo(props: React.ComponentProps<typeof Box>) {
  return (
    <Box {...props} display="inline-block">
      <Image
        src="/image/logo/logo-text.svg"
        alt="WeBelong Logo"
        boxSize={props.boxSize || 60}
        objectFit="contain"
      />
    </Box>
  );
}
