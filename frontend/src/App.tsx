import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import {
  Box,
  Flex,
  Spacer,
  Link,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import Report from "./pages/Report";
import { useTranslation } from "react-i18next";

import Logo from "./components/Logo";

const LANGUAGES = [
  { code: "th", label: "ไทย" },
  { code: "en", label: "English" },
  { code: "my", label: "မြန်မာ" },
  { code: "km", label: "ខ្មែរ" },
  { code: "lo", label: "ລາວ" },
  { code: "vi", label: "Tiếng Việt" },
];

export default function App() {
  const { t, i18n } = useTranslation();

  // Debug: Log current language
  console.log("Current language:", i18n.language);

  return (
    <Router>
      <Box minH="100vh" bg="white">
        <Flex
          as="nav"
          bg="belongingBlue"
          color="white"
          px={{ base: 2, md: 4 }}
          py={{ base: 1, md: 1.5 }}
          align="center"
          boxShadow="sm"
          minH={{ base: "50px", md: "55px" }}
        >
          <HStack spacing={{ base: 2, md: 4 }}>
            <Link as={RouterLink} to="/" display="flex" alignItems="center">
              <Logo boxSize={{ base: 14, md: 16 }} />
            </Link>
            <Link
              as={RouterLink}
              to="/calculator"
              color="white"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
            >
              {t("nav.calculator")}
            </Link>
            <Link
              as={RouterLink}
              to="/report"
              color="white"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
            >
              {t("nav.report")}
            </Link>
          </HStack>
          <Spacer />
          <HStack spacing={{ base: 2, md: 4 }}>
            <Button
              as="a"
              href="https://legacy.csitereport.com/migrant"
              target="_blank"
              rel="noopener noreferrer"
              bg="hopeGreen"
              color="deepNavy"
              _hover={{ bg: "hopeGreen", filter: "brightness(0.95)" }}
              _active={{ bg: "hopeGreen", filter: "brightness(0.9)" }}
              _focus={{ boxShadow: "0 0 0 2px #50E3C2" }}
              fontWeight="bold"
              fontSize={{ base: "xs", md: "sm" }}
              borderRadius="full"
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 1.5 }}
              shadow="md"
              size={{ base: "sm", md: "md" }}
              display={{ base: "none", md: "flex" }}
            >
              {t("nav.joinProject")}
            </Button>
            <Menu closeOnSelect={true}>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                bg="hopeGreen"
                color="deepNavy"
                _hover={{ bg: "hopeGreen", filter: "brightness(0.95)" }}
                _active={{ bg: "hopeGreen", filter: "brightness(0.9)" }}
                _focus={{ boxShadow: "0 0 0 2px #50E3C2" }}
                fontWeight="bold"
                fontSize={{ base: "sm", md: "md" }}
                borderRadius="full"
                px={{ base: 3, md: 4 }}
                py={{ base: 1, md: 1.5 }}
                shadow="md"
                size={{ base: "sm", md: "md" }}
                onClick={() => console.log("Language menu button clicked")}
              >
                {LANGUAGES.find((l) => l.code === i18n.language)?.label ||
                  "ภาษา"}
              </MenuButton>
              <MenuList
                bg="white"
                color="deepNavy"
                borderRadius="lg"
                boxShadow="xl"
                zIndex={9999}
                border="1px solid"
                borderColor="gray.200"
                minW="150px"
              >
                {LANGUAGES.map((lang) => (
                  <MenuItem
                    key={lang.code}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(`MenuItem clicked: ${lang.code}`);
                      console.log(`Switching to language: ${lang.code}`);
                      i18n
                        .changeLanguage(lang.code)
                        .then(() => {
                          console.log(
                            `Language switched successfully to: ${lang.code}`
                          );
                        })
                        .catch((error) => {
                          console.error("Error switching language:", error);
                        });
                    }}
                    _hover={{ bg: "gray.100" }}
                    _focus={{ bg: "gray.100" }}
                    fontWeight={i18n.language === lang.code ? "bold" : "normal"}
                    cursor="pointer"
                    fontSize="md"
                    py={2}
                  >
                    {lang.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        <Box as="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/calculator"
              element={
                <Box pt={4} px={2}>
                  <Calculator />
                </Box>
              }
            />
            <Route
              path="/report"
              element={
                <Box pt={4} px={2}>
                  <Report />
                </Box>
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}
