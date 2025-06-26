import { Button as ChakraButton } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

const Button = (props: ButtonProps) => (
  <ChakraButton
    colorScheme="blue"
    borderRadius="lg"
    fontWeight="bold"
    {...props}
  />
);

export default Button;
