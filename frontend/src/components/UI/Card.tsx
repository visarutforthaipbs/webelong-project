import { Box, useToken } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

const Card = (props: BoxProps) => {
  const [bg] = useToken("colors", ["warmSand"]);
  return <Box bg={bg} borderRadius="lg" boxShadow="md" p={4} {...props} />;
};

export default Card;
