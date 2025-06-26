import { useEffect, useState } from "react";
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface Center {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  contact: string;
}

export default function CommunicationMapPage() {
  const { t } = useTranslation();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/info/centers")
      .then((res) => res.json())
      .then((data) => {
        setCenters(data);
        setLoading(false);
      });
  }, []);

  // Placeholder: Replace with React Leaflet or Google Maps embed
  return (
    <Box bg="#F5E3C3" p={6} borderRadius="md" mb={4} maxW="6xl" mx="auto">
      <Heading size="lg" mb={6} textAlign="center">
        {t("resources.mapTitle", "แผนที่ศูนย์สื่อสาร/ช่วยเหลือ")}
      </Heading>
      {loading ? (
        <Spinner />
      ) : centers.length === 0 ? (
        <Text>{t("resources.noCenters", "ไม่พบศูนย์ช่วยเหลือ")}</Text>
      ) : (
        <Box
          w="100%"
          h="350px"
          borderRadius="md"
          overflow="hidden"
          bg="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="gray.600">[แผนที่จะแสดงที่นี่]</Text>
        </Box>
      )}
      {/* TODO: Add map with markers for each center, popups with name/address/contact */}
    </Box>
  );
}
