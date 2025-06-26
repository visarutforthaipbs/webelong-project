import { Box, Container, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
// PDF viewer placeholder (react-pdf)

export default function CommunicatorGuidePage() {
  const { t } = useTranslation();
  return (
    <Box bg="#F5E3C3" p={6} borderRadius="md" mb={4} maxW="3xl" mx="auto">
      <Container maxW="2xl">
        <Heading size="lg" mb={4} textAlign="center">
          {t("resources.guideTitle", "ประชากรข้ามชาติ 101 - คู่มือสื่อสาร")}
        </Heading>
        <Text mb={4} color="gray.700" textAlign="center">
          {t(
            "resources.guideDesc",
            "คู่มือสำหรับผู้สื่อสารและอาสาสมัครในพื้นที่ชายแดน"
          )}
        </Text>
        {/* TODO: Embed PDF viewer for /assets/guide.pdf using react-pdf */}
        <Box bg="gray.100" borderRadius="md" p={4} textAlign="center">
          [ตัวอย่าง PDF viewer จะแสดงที่นี่]
        </Box>
      </Container>
    </Box>
  );
}
