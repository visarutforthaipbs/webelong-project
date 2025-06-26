import { useState } from "react";
import {
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Box,
  Spinner,
  FormHelperText,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch";
import { apiUrl } from "../config/api";

export default function Report() {
  const { t } = useTranslation();
  const { data: provinces, loading } = useFetch<
    { province: string; province_th?: string; note?: string; wage?: number }[]
  >("/api/info/minimumWages");
  const [form, setForm] = useState({
    industry: "",
    employerType: "",
    province: "",
    reportText: "",
    contact: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    await fetch(apiUrl("/api/report"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    setSuccess(true);
    setForm({
      industry: "",
      employerType: "",
      province: "",
      reportText: "",
      contact: "",
    });
  };

  if (success) {
    return (
      <Box
        bg="#F5E3C3"
        p={8}
        borderRadius="md"
        boxShadow="md"
        maxW="lg"
        mx="auto"
        mt={10}
        textAlign="center"
      >
        <Heading size="lg" color="green.600" mb={4}>
          ส่งรายงานสำเร็จ
        </Heading>
        <Text fontSize="xl" mb={2} fontWeight="bold">
          ขอบคุณที่แจ้งปัญหา
        </Text>
        <Text fontSize="md">
          องค์กรช่วยเหลือจะตรวจสอบข้อมูลของคุณโดยเร็วที่สุด
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg="#F5E3C3"
      p={{ base: 4, md: 6 }}
      borderRadius="md"
      boxShadow="md"
      maxW={{ base: "95%", md: "lg" }}
      mx="auto"
      mt={{ base: 4, md: 10 }}
    >
      <VStack as="form" onSubmit={handleSubmit} spacing={0} align="stretch">
        <Heading
          size={{ base: "sm", md: "md" }}
          mb={{ base: 4, md: 6 }}
          textAlign="center"
        >
          {t("report.title")}
        </Heading>
        <FormControl isRequired mb={4}>
          <FormLabel>{t("report.industry")}</FormLabel>
          <Input
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder={t("report.industryPlaceholder")}
            bg="white"
            _placeholder={{
              color: "gray.500",
              fontSize: "sm",
            }}
          />
          <FormHelperText fontSize="sm" color="gray.600">
            {t("report.industryHelper")}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired mb={4}>
          <FormLabel>{t("report.employerType")}</FormLabel>
          <Input
            name="employerType"
            value={form.employerType}
            onChange={handleChange}
            placeholder={t("report.employerPlaceholder")}
            bg="white"
            _placeholder={{
              color: "gray.500",
              fontSize: "sm",
            }}
          />
        </FormControl>
        {loading ? (
          <Spinner />
        ) : (
          <FormControl isRequired mb={4}>
            <FormLabel>{t("report.province")}</FormLabel>
            <Select
              name="province"
              value={form.province}
              onChange={handleChange}
              bg="white"
              _placeholder={{
                color: "gray.500",
              }}
            >
              <option value="">--</option>
              {provinces?.map((p) => (
                <option
                  key={p.province + (p.note || "")}
                  value={p.province + (p.note ? ` (${p.note})` : "")}
                >
                  {(p.province_th || p.province) +
                    (p.note ? ` (${p.note})` : "")}
                </option>
              ))}
            </Select>
            <FormHelperText fontSize="sm" color="gray.600">
              เลือกจังหวัดที่คุณทำงานอยู่
            </FormHelperText>
          </FormControl>
        )}
        <FormControl isRequired mb={4}>
          <FormLabel>{t("report.reportText")}</FormLabel>
          <Textarea
            name="reportText"
            value={form.reportText}
            onChange={handleChange}
            placeholder={t("report.reportPlaceholder")}
            bg="white"
            _placeholder={{
              color: "gray.500",
              fontSize: "sm",
            }}
            minHeight="100px"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>{t("report.contact")}</FormLabel>
          <Input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder={t("report.contactPlaceholder")}
            bg="white"
            _placeholder={{
              color: "gray.500",
              fontSize: "sm",
            }}
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={submitting}
          w="full"
          fontSize="lg"
          mb={2}
        >
          {t("report.submit")}
        </Button>
        <Text fontSize="xs" color="gray.600" textAlign="center" mb={2}>
          ข้อมูลของคุณจะถูกส่งอย่างปลอดภัยไปยังองค์กรช่วยเหลือ
        </Text>
      </VStack>
    </Box>
  );
}
