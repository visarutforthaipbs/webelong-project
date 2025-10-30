import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { Box, Flex, Spacer, Link, HStack, Image } from "@chakra-ui/react";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Calculator from "./pages/Calculator";
import Report from "./pages/Report";
import Survey from "./pages/Survey";
import Methodology from "./pages/Methodology";

import Logo from "./components/Logo";

export default function App() {
  return (
    <Router>
      <Box minH="100vh" bg="white">
        <Flex
          as="nav"
          bg="belongingBlue"
          color="white"
          px={{ base: 4, md: 6 }}
          py={{ base: 3, md: 3 }}
          align="center"
          boxShadow="md"
          minH={{ base: "70px", md: "70px" }}
          position="sticky"
          top="0"
          zIndex="sticky"
        >
          <HStack spacing={{ base: 3, md: 6 }}>
            <Link as={RouterLink} to="/" display="flex" alignItems="center">
              <Logo boxSize={{ base: 14, md: 16 }} />
            </Link>
            {/* Hidden navigation items */}
            {/* <Link
              as={RouterLink}
              to="/map"
              color="white"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="medium"
              _hover={{ color: "hopeGreen" }}
              transition="color 0.2s"
            >
              แผนที่
            </Link>
            <Link
              as={RouterLink}
              to="/calculator"
              color="white"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="medium"
              _hover={{ color: "hopeGreen" }}
              transition="color 0.2s"
            >
              {t("nav.calculator")}
            </Link>
            <Link
              as={RouterLink}
              to="/report"
              color="white"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="medium"
              _hover={{ color: "hopeGreen" }}
              transition="color 0.2s"
            >
              {t("nav.report")}
            </Link>
            <Link
              as={RouterLink}
              to="/survey"
              color="white"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="medium"
              _hover={{ color: "hopeGreen" }}
              transition="color 0.2s"
            >
              {t("nav.survey")}
            </Link> */}
          </HStack>
          <Spacer />
          <Image
            src="/image/logo/pi-logos.png"
            alt="Partner Logo"
            h={{ base: "35px", md: "45px" }}
            objectFit="contain"
          />
        </Flex>
        <Box as="main" bg="gray.50" minH="calc(100vh - 70px)">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<Home />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route
              path="/calculator"
              element={
                <Box pt={{ base: 6, md: 4 }} px={{ base: 4, md: 2 }} pb={6}>
                  <Calculator />
                </Box>
              }
            />
            <Route
              path="/report"
              element={
                <Box pt={{ base: 6, md: 4 }} px={{ base: 4, md: 2 }} pb={6}>
                  <Report />
                </Box>
              }
            />
            <Route
              path="/survey"
              element={
                <Box pt={{ base: 6, md: 4 }} px={{ base: 4, md: 2 }} pb={6}>
                  <Survey />
                </Box>
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}
