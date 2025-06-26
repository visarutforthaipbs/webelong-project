import { useState } from "react";
import {
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  Box,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function Feedback() {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    });
    setSubmitting(false);
    setSuccess(true);
    setFeedback("");
  };

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit}
      spacing={6}
      maxW="md"
      mx="auto"
      py={8}
    >
      <Heading size="md">{t("feedback.title")}</Heading>
      <FormControl isRequired>
        <FormLabel>{t("feedback.title")}</FormLabel>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          minH={24}
        />
      </FormControl>
      <Button type="submit" colorScheme="blue" isLoading={submitting} w="full">
        {t("feedback.submit")}
      </Button>
      {success && <Box color="green.500">Feedback submitted. Thank you!</Box>}
    </VStack>
  );
}
