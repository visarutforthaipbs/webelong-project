import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Text,
  Icon,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaFilePdf, FaVideo, FaBook } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { apiUrl } from "../../config/api";

interface MediaItem {
  id: number;
  title: string;
  type: string;
  url: string;
  source?: string;
}

export default function MediaLibraryPage() {
  const { t } = useTranslation();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/info/media-library"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMedia(data);
        } else {
          setMedia([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setMedia([]);
        setLoading(false);
      });
  }, []);

  // Filtering logic for each tab
  const filterTabs = [
    {
      label: t("resources.all", "ทั้งหมด"),
      filter: () => true,
    },
    {
      label: t("resources.pdfs", "PDFs"),
      filter: (item: MediaItem) => item.type === "pdf",
    },
    {
      label: t("resources.videos", "วิดีโอ"),
      filter: (item: MediaItem) => item.type === "video",
    },
    {
      label: t("resources.guides", "คู่มือ"),
      filter: (item: MediaItem) => item.type === "guide",
    },
  ];

  // Responsive columns for SimpleGrid
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  // Icon selection
  const getIcon = (type: string) => {
    if (type === "pdf")
      return <Icon as={FaFilePdf} boxSize={8} color="red.500" mb={2} />;
    if (type === "video")
      return <Icon as={FaVideo} boxSize={8} color="blue.500" mb={2} />;
    if (type === "guide")
      return <Icon as={FaBook} boxSize={8} color="green.600" mb={2} />;
    return null;
  };

  return (
    <Box bg="#F5E3C3" p={6} borderRadius="md" mb={4}>
      <Heading size="lg" mb={4} textAlign="center">
        {t("resources.mediaLibraryTitle", "คลังสื่อและดาวน์โหลด")}
      </Heading>
      {loading ? (
        <Spinner display="block" mx="auto" />
      ) : (
        <Tabs variant="soft-rounded" colorScheme="blue" isFitted>
          <TabList mb={4}>
            {filterTabs.map((tab, idx) => (
              <Tab key={idx}>{tab.label}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {filterTabs.map((tab, idx) => (
              <TabPanel key={idx} px={0}>
                <SimpleGrid columns={columns} spacing={4}>
                  {media.filter(tab.filter).map((item) => (
                    <Box
                      key={item.id}
                      bg="white"
                      p={4}
                      borderRadius="md"
                      boxShadow="sm"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      {getIcon(item.type)}
                      <Heading size="md" mb={2} textAlign="center">
                        {t(item.title)}
                      </Heading>
                      {item.source && (
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          mb={4}
                          textAlign="center"
                        >
                          {t("resources.source", "ที่มา")}: {t(item.source)}
                        </Text>
                      )}
                      <Button
                        as="a"
                        href={item.url}
                        colorScheme="blue"
                        w="full"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.type === "pdf"
                          ? t("resources.viewOrDownload", "ดู/ดาวน์โหลด")
                          : t("resources.view", "ดู")}
                      </Button>
                    </Box>
                  ))}
                  {media.filter(tab.filter).length === 0 && (
                    <Text color="gray.500" textAlign="center" w="full" py={8}>
                      {t("resources.noMedia", "ไม่พบสื่อในหมวดนี้")}
                    </Text>
                  )}
                </SimpleGrid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
}
