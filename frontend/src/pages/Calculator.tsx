import { useState } from "react";
import {
  VStack,
  Heading,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Button,
  Text,
  Box,
  Spinner,
  FormHelperText,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch";
import { apiUrl } from "../config/api";

interface CalculatorResult {
  legalMonthly: number;
  actualMonthly: number;
  overtimePay: number;
  holidayPay: number;
  totalActual: number;
  difference: number;
  status: string;
}

export default function Calculator() {
  const { t } = useTranslation();
  const { data: provinces, loading } = useFetch<
    { province: string; province_th?: string; note?: string }[]
  >("/api/info/minimumWages");
  const [form, setForm] = useState({
    provinceCode: "",
    userDailyWage: 0,
    daysWorked: 0,
    overtimeHoursPerDay: 0,
    holidayHoursPerMonth: 0,
  });
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (name: string, value: string | number | boolean) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    const res = await fetch(apiUrl("/api/calculate-wage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setResult(await res.json());
    setSubmitting(false);
  };

  return (
    <Box
      bg="white"
      p={{ base: 5, md: 8 }}
      borderRadius="xl"
      boxShadow="lg"
      maxW={{ base: "100%", md: "lg" }}
      mx="auto"
      mt={{ base: 0, md: 6 }}
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack as="form" onSubmit={handleSubmit} spacing={{ base: 5, md: 6 }} align="stretch">
        <Heading
          size={{ base: "lg", md: "xl" }}
          textAlign="center"
          color="belongingBlue"
          fontWeight="bold"
        >
          {t("calculator.title")}
        </Heading>
        {loading ? (
          <Spinner size="lg" color="belongingBlue" />
        ) : (
          <FormControl isRequired>
            <FormLabel fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="deepNavy">
              {t("calculator.province")}
            </FormLabel>
            <Select
              name="provinceCode"
              value={form.provinceCode}
              onChange={(e) => handleChange("provinceCode", e.target.value)}
              bg="white"
              size="lg"
              borderRadius="lg"
              border="2px solid"
              borderColor="gray.200"
              _hover={{ borderColor: "belongingBlue" }}
              _focus={{ borderColor: "belongingBlue", boxShadow: "0 0 0 1px #4A90E2" }}
              _placeholder={{
                color: "gray.500",
              }}
            >
              <option value="">--</option>
              {provinces?.map((p) => (
                <option
                  key={p.province + (p.note || "")}
                  value={
                    p.province +
                    (p.note
                      ? `--${p.note.replace(/\s/g, "").toLowerCase()}`
                      : "")
                  }
                >
                  {(p.province_th || p.province) +
                    (p.note ? ` (${p.note})` : "")}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        <FormControl isRequired>
          <FormLabel fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="deepNavy">
            {t("calculator.dailyWage")}
          </FormLabel>
          <NumberInput
            name="userDailyWage"
            min={0}
            value={form.userDailyWage}
            onChange={(_, value) => handleChange("userDailyWage", value)}
            size="lg"
          >
            <NumberInputField
              bg="white"
              borderRadius="lg"
              border="2px solid"
              borderColor="gray.200"
              _hover={{ borderColor: "belongingBlue" }}
              _focus={{ borderColor: "belongingBlue", boxShadow: "0 0 0 1px #4A90E2" }}
              _placeholder={{
                color: "gray.500",
                fontSize: { base: "md", md: "sm" },
              }}
              placeholder="ใส่ค่าแรงต่อวันเป็นบาท"
              py={{ base: 6, md: 4 }}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl isRequired mb={4}>
          <FormLabel>{t("calculator.daysWorked")}</FormLabel>
          <NumberInput
            name="daysWorked"
            min={1}
            max={7}
            value={form.daysWorked}
            onChange={(_, value) => handleChange("daysWorked", value)}
          >
            <NumberInputField
              bg="white"
              _placeholder={{
                color: "gray.500",
                fontSize: "sm",
              }}
              placeholder="1-7 วัน"
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl isRequired mb={4}>
          <FormLabel>{t("calculator.overtimeHours")}</FormLabel>
          <NumberInput
            name="overtimeHoursPerDay"
            min={0}
            max={16}
            value={form.overtimeHoursPerDay}
            onChange={(_, value) => handleChange("overtimeHoursPerDay", value)}
          >
            <NumberInputField
              bg="white"
              _placeholder={{
                color: "gray.500",
                fontSize: "sm",
              }}
              placeholder="0-16 ชั่วโมง"
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText fontSize="sm" color="gray.600">
            {t("calculator.overtimeHelper")}
          </FormHelperText>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>{t("calculator.holidayHours")}</FormLabel>
          <NumberInput
            name="holidayHoursPerMonth"
            min={0}
            max={100}
            value={form.holidayHoursPerMonth}
            onChange={(_, value) => handleChange("holidayHoursPerMonth", value)}
          >
            <NumberInputField
              bg="white"
              _placeholder={{
                color: "gray.500",
                fontSize: "sm",
              }}
              placeholder="จำนวนชั่วโมงต่อเดือน"
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText fontSize="sm" color="gray.600">
            รวมจำนวนชั่วโมงที่ทำงานในวันหยุดต่อเดือน (ถ้ามี)
          </FormHelperText>
        </FormControl>
        <Button
          type="submit"
          bg="belongingBlue"
          color="white"
          _hover={{ bg: "blue.600", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0px)" }}
          isLoading={submitting}
          w="full"
          size="lg"
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="bold"
          borderRadius="lg"
          py={{ base: 6, md: 6 }}
          boxShadow="md"
          transition="all 0.2s"
        >
          {t("calculator.calculate")}
        </Button>
        {result && (
          <Box
            p={4}
            bg="white"
            borderRadius="md"
            border="1px solid"
            borderColor="belongingBlue"
            w="full"
            mt={4}
          >
            <Text fontWeight="bold" fontSize="md" mb={2}>
              {t("calculator.legalWage")}:{" "}
              {result.legalMonthly !== undefined
                ? result.legalMonthly.toLocaleString()
                : "-"}{" "}
              บาท
            </Text>
            <Text fontWeight="bold" fontSize="md" mb={2}>
              {t("calculator.actualWage")}:{" "}
              {result.totalActual !== undefined
                ? result.totalActual.toLocaleString()
                : "-"}{" "}
              บาท
            </Text>
            <Text
              color={result.status === "underpaid" ? "red.500" : "green.600"}
              fontWeight="bold"
              mt={2}
            >
              {result.status === "underpaid"
                ? t("calculator.underpaid")
                : t("calculator.result")}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
