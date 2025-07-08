import { useState } from "react";
import { Flex, Box, useBreakpointValue, VStack } from "@chakra-ui/react";
import ChoroplethMap from "../components/ChoroplethMap";
import PopulationSidebar from "../components/PopulationSidebar";
import NotionContentSidebar from "../components/NotionContentSidebar";

export default function Home() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [showNotionSidebar, setShowNotionSidebar] = useState<string | null>(
    null
  );

  // Responsive layout configuration
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });
  const sidebarWidth = useBreakpointValue({
    base: "100%",
    md: "350px",
    lg: "400px",
    xl: "450px",
  });

  const handleProvinceClick = (provinceName: string) => {
    setSelectedProvince(provinceName);
    // Show Notion content when a province is clicked
    setShowNotionSidebar(provinceName);
  };

  const handleNotionSidebarClose = () => {
    setShowNotionSidebar(null);
  };

  if (isMobile) {
    // Mobile Layout: Stack vertically with better proportions
    return (
      <VStack height="calc(100vh - 60px)" spacing={0} overflow="hidden">
        {/* Map Section - Optimized for mobile interaction */}
        <Box height="55%" width="100%" position="relative" overflow="hidden">
          <ChoroplethMap
            onProvinceClick={handleProvinceClick}
            selectedProvince={selectedProvince || undefined}
          />
        </Box>

        {/* Sidebar Section - Scrollable bottom section with shadow */}
        <Box 
          height="45%" 
          width="100%" 
          overflow="hidden"
          borderTop="2px solid"
          borderColor="belongingBlue"
          bg="white"
          boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
          position="relative"
          zIndex={5}
        >
          {/* Mobile drag indicator */}
          <Box
            width="40px"
            height="4px"
            bg="gray.300"
            borderRadius="full"
            mx="auto"
            mt={2}
            mb={2}
          />
          <PopulationSidebar selectedProvince={selectedProvince} />
        </Box>

        {/* Notion Content Sidebar - Full screen overlay on mobile */}
        <NotionContentSidebar
          selectedProvince={showNotionSidebar}
          onClose={handleNotionSidebarClose}
        />
      </VStack>
    );
  }

  if (isTablet) {
    // Tablet Layout: Optimized for iPad
    return (
      <Flex height="calc(100vh - 60px)" overflow="hidden">
        {/* Sidebar Section - Responsive width for tablet */}
        <Flex width={sidebarWidth} flexShrink={0} borderRight="1px solid" borderColor="gray.200">
          <PopulationSidebar selectedProvince={selectedProvince} />
        </Flex>

        {/* Map Section - Takes up remaining space */}
        <Flex flex="1" position="relative">
          <ChoroplethMap
            onProvinceClick={handleProvinceClick}
            selectedProvince={selectedProvince || undefined}
          />
        </Flex>

        {/* Notion Content Sidebar - Overlays on the right */}
        <NotionContentSidebar
          selectedProvince={showNotionSidebar}
          onClose={handleNotionSidebarClose}
        />
      </Flex>
    );
  }

  // Desktop Layout: Side by side with optimized spacing
  return (
    <Flex height="calc(100vh - 60px)" overflow="hidden">
      {/* Sidebar Section - Responsive width */}
      <Flex width={sidebarWidth} flexShrink={0} borderRight="1px solid" borderColor="gray.200">
        <PopulationSidebar selectedProvince={selectedProvince} />
      </Flex>

      {/* Map Section - Takes up remaining space */}
      <Flex flex="1" position="relative">
        <ChoroplethMap
          onProvinceClick={handleProvinceClick}
          selectedProvince={selectedProvince || undefined}
        />
      </Flex>

      {/* Notion Content Sidebar - Overlays on the right */}
      <NotionContentSidebar
        selectedProvince={showNotionSidebar}
        onClose={handleNotionSidebarClose}
      />
    </Flex>
  );
}
