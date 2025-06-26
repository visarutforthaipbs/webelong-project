import { useState } from "react";
import { Flex, Box, useBreakpointValue, VStack } from "@chakra-ui/react";
import StaticProvinceMap from "../components/StaticProvinceMap";
import PopulationSidebar from "../components/PopulationSidebar";
import NotionContentSidebar from "../components/NotionContentSidebar";

export default function Home() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [showNotionSidebar, setShowNotionSidebar] = useState<string | null>(
    null
  );

  // Responsive layout configuration
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const sidebarWidth = useBreakpointValue({
    base: "100%",
    md: "400px",
    lg: "450px",
    xl: "500px",
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
    // Mobile Layout: Stack vertically
    return (
      <VStack height="100vh" spacing={0} overflow="hidden">
        {/* Map Section - Top half on mobile */}
        <Box height="50vh" width="100%" position="relative" overflow="hidden">
          <StaticProvinceMap
            onProvinceClick={handleProvinceClick}
            selectedProvince={selectedProvince || undefined}
          />
        </Box>

        {/* Sidebar Section - Bottom half on mobile */}
        <Box height="50vh" width="100%" overflow="hidden">
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

  // Desktop & Tablet Layout: Side by side
  return (
    <Flex height="100vh" overflow="hidden">
      {/* Sidebar Section - Responsive width */}
      <Flex width={sidebarWidth} flexShrink={0}>
        <PopulationSidebar selectedProvince={selectedProvince} />
      </Flex>

      {/* Map Section - Takes up remaining space */}
      <Flex flex="1" position="relative">
        <StaticProvinceMap
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
