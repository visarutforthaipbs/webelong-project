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
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Stack,
  FormHelperText,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch";
import { apiUrl } from "../config/api";

// Survey Form Interfaces
interface WageSurveyForm {
  provinceCode: string;
  dailyWage: number;
  jobType: string;
}

interface ClinicVerificationForm {
  clinicId: string;
  clinicName: string;
  gpsLatitude: number;
  gpsLongitude: number;
  hasMultilingualService: string;
}

interface BarrierSurveyForm {
  provinceCode: string;
  barrierScore: number;
}

interface IncidentReportForm {
  provinceCode: string;
  incidentDate: string;
  incidentType: string;
  isVerified: string;
  description: string;
}

interface NgoRegistryForm {
  organizationName: string;
  provinceCode: string;
  serviceType: string;
  contactInfo: string;
}

interface FieldAuditForm {
  provinceCode: string;
  officeType: string;
  hasMultilingualSigns: string;
  notes: string;
}

interface MediaRegistryForm {
  mediaName: string;
  provinceCode: string;
  mediaType: string;
  websiteUrl: string;
}

interface EventLogForm {
  provinceCode: string;
  eventType: string;
  eventStatus: string;
  eventDate: string;
  description: string;
}

interface GroupRegistryForm {
  groupName: string;
  provinceCode: string;
  isActiveLastSixMonths: string;
  contactPerson: string;
  contactInfo: string;
}

export default function Survey() {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: provinces } = useFetch<
    { province: string; province_th?: string; note?: string }[]
  >("/api/info/minimumWages");

  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Form states for each survey type
  const [wageSurvey, setWageSurvey] = useState<WageSurveyForm>({
    provinceCode: "",
    dailyWage: 0,
    jobType: "",
  });

  const [clinicVerification, setClinicVerification] =
    useState<ClinicVerificationForm>({
      clinicId: "",
      clinicName: "",
      gpsLatitude: 0,
      gpsLongitude: 0,
      hasMultilingualService: "",
    });

  const [barrierSurvey, setBarrierSurvey] = useState<BarrierSurveyForm>({
    provinceCode: "",
    barrierScore: 3,
  });

  const [incidentReport, setIncidentReport] = useState<IncidentReportForm>({
    provinceCode: "",
    incidentDate: "",
    incidentType: "",
    isVerified: "",
    description: "",
  });

  const [ngoRegistry, setNgoRegistry] = useState<NgoRegistryForm>({
    organizationName: "",
    provinceCode: "",
    serviceType: "",
    contactInfo: "",
  });

  const [fieldAudit, setFieldAudit] = useState<FieldAuditForm>({
    provinceCode: "",
    officeType: "",
    hasMultilingualSigns: "",
    notes: "",
  });

  const [mediaRegistry, setMediaRegistry] = useState<MediaRegistryForm>({
    mediaName: "",
    provinceCode: "",
    mediaType: "",
    websiteUrl: "",
  });

  const [eventLog, setEventLog] = useState<EventLogForm>({
    provinceCode: "",
    eventType: "",
    eventStatus: "",
    eventDate: "",
    description: "",
  });

  const [groupRegistry, setGroupRegistry] = useState<GroupRegistryForm>({
    groupName: "",
    provinceCode: "",
    isActiveLastSixMonths: "",
    contactPerson: "",
    contactInfo: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (surveyType: string, formData: any) => {
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/survey"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyType, data: formData }),
      });

      if (res.ok) {
        toast({
          title: "ส่งข้อมูลสำเร็จ",
          description: "ขอบคุณสำหรับข้อมูลที่ให้มา",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Reset form based on type
        resetForm(surveyType);
      } else {
        throw new Error("Failed to submit");
      }
    } catch {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = (surveyType: string) => {
    switch (surveyType) {
      case "wageSurvey":
        setWageSurvey({ provinceCode: "", dailyWage: 0, jobType: "" });
        break;
      case "clinicVerification":
        setClinicVerification({
          clinicId: "",
          clinicName: "",
          gpsLatitude: 0,
          gpsLongitude: 0,
          hasMultilingualService: "",
        });
        break;
      case "barrierSurvey":
        setBarrierSurvey({ provinceCode: "", barrierScore: 3 });
        break;
      case "incidentReport":
        setIncidentReport({
          provinceCode: "",
          incidentDate: "",
          incidentType: "",
          isVerified: "",
          description: "",
        });
        break;
      case "ngoRegistry":
        setNgoRegistry({
          organizationName: "",
          provinceCode: "",
          serviceType: "",
          contactInfo: "",
        });
        break;
      case "fieldAudit":
        setFieldAudit({
          provinceCode: "",
          officeType: "",
          hasMultilingualSigns: "",
          notes: "",
        });
        break;
      case "mediaRegistry":
        setMediaRegistry({
          mediaName: "",
          provinceCode: "",
          mediaType: "",
          websiteUrl: "",
        });
        break;
      case "eventLog":
        setEventLog({
          provinceCode: "",
          eventType: "",
          eventStatus: "",
          eventDate: "",
          description: "",
        });
        break;
      case "groupRegistry":
        setGroupRegistry({
          groupName: "",
          provinceCode: "",
          isActiveLastSixMonths: "",
          contactPerson: "",
          contactInfo: "",
        });
        break;
    }
  };

  return (
    <Box
      bg="white"
      p={{ base: 6, md: 10 }}
      borderRadius="xl"
      boxShadow="xl"
      maxW={{ base: "100%", md: "5xl" }}
      mx="auto"
      mt={{ base: 0, md: 6 }}
      border="2px solid"
      borderColor="gray.100"
    >
      <VStack spacing={8} align="stretch">
        <Heading
          size={{ base: "xl", md: "2xl" }}
          textAlign="center"
          color="belongingBlue"
          fontWeight="bold"
        >
          {t("survey.title")}
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          {t("survey.description")}
        </Text>

        <Tabs
          index={activeTab}
          onChange={setActiveTab}
          variant="enclosed"
          colorScheme="blue"
        >
          <TabList overflowX="auto" overflowY="hidden" borderColor="gray.200">
            <Tab
              fontSize={{ base: "sm", md: "md" }}
              _selected={{
                color: "white",
                bg: "belongingBlue",
                borderColor: "belongingBlue",
              }}
              _hover={{ bg: "gray.100" }}
              fontWeight="medium"
              py={3}
            >
              {t("survey.tabs.wage")}
            </Tab>
            <Tab
              fontSize={{ base: "sm", md: "md" }}
              _selected={{
                color: "white",
                bg: "belongingBlue",
                borderColor: "belongingBlue",
              }}
              _hover={{ bg: "gray.100" }}
              fontWeight="medium"
              py={3}
            >
              {t("survey.tabs.clinic")}
            </Tab>
            <Tab
              fontSize={{ base: "sm", md: "md" }}
              _selected={{
                color: "white",
                bg: "belongingBlue",
                borderColor: "belongingBlue",
              }}
              _hover={{ bg: "gray.100" }}
              fontWeight="medium"
              py={3}
            >
              {t("survey.tabs.barrier")}
            </Tab>
            <Tab
              fontSize={{ base: "sm", md: "md" }}
              _selected={{
                color: "white",
                bg: "belongingBlue",
                borderColor: "belongingBlue",
              }}
              _hover={{ bg: "gray.100" }}
              fontWeight="medium"
              py={3}
            >
              {t("survey.tabs.incident")}
            </Tab>
            <Tab
              fontSize={{ base: "sm", md: "md" }}
              _selected={{
                color: "white",
                bg: "belongingBlue",
                borderColor: "belongingBlue",
              }}
              _hover={{ bg: "gray.100" }}
              fontWeight="medium"
              py={3}
            >
              {t("survey.tabs.ngo")}
            </Tab>
            <Tab
              fontSize={{ base: "sm", md: "md" }}
              _selected={{
                color: "white",
                bg: "belongingBlue",
                borderColor: "belongingBlue",
              }}
              _hover={{ bg: "gray.100" }}
              fontWeight="medium"
              py={3}
            >
              {t("survey.tabs.audit")}
            </Tab>
            <Tab
              fontSize={{ base: "sm", md: "md" }}
              _selected={{
                color: "white",
                bg: "belongingBlue",
                borderColor: "belongingBlue",
              }}
              _hover={{ bg: "gray.100" }}
              fontWeight="medium"
              py={3}
            >
              {t("survey.tabs.media")}
            </Tab>
            <Tab
              fontSize={{ base: "sm", md: "md" }}
              _selected={{
                color: "white",
                bg: "belongingBlue",
                borderColor: "belongingBlue",
              }}
              _hover={{ bg: "gray.100" }}
              fontWeight="medium"
              py={3}
            >
              {t("survey.tabs.event")}
            </Tab>
            <Tab
              fontSize={{ base: "sm", md: "md" }}
              _selected={{
                color: "white",
                bg: "belongingBlue",
                borderColor: "belongingBlue",
              }}
              _hover={{ bg: "gray.100" }}
              fontWeight="medium"
              py={3}
            >
              {t("survey.tabs.group")}
            </Tab>
          </TabList>

          <TabPanels>
            {/* 1. Wage Survey */}
            <TabPanel>
              <VStack
                as="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("wageSurvey", wageSurvey);
                }}
                spacing={6}
                align="stretch"
              >
                <Heading size="xl" color="belongingBlue">
                  {t("survey.wage.title")}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {t("survey.wage.description")}
                </Text>
                <Divider borderColor="gray.200" />

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.wage.province")}
                  </FormLabel>
                  <Select
                    value={wageSurvey.provinceCode}
                    onChange={(e) =>
                      setWageSurvey({
                        ...wageSurvey,
                        provinceCode: e.target.value,
                      })
                    }
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "belongingBlue" }}
                    _focus={{
                      borderColor: "belongingBlue",
                      boxShadow: "0 0 0 1px #4A90E2",
                    }}
                  >
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces?.map((p) => (
                      <option key={p.province} value={p.province}>
                        {p.province_th || p.province}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.wage.dailyWage")}
                  </FormLabel>
                  <NumberInput
                    min={0}
                    value={wageSurvey.dailyWage}
                    onChange={(_, value) =>
                      setWageSurvey({ ...wageSurvey, dailyWage: value })
                    }
                    size="lg"
                  >
                    <NumberInputField
                      placeholder="ระบุค่าจ้างรายวัน (บาท)"
                      fontSize="md"
                      border="2px solid"
                      borderColor="gray.200"
                      _hover={{ borderColor: "belongingBlue" }}
                      _focus={{
                        borderColor: "belongingBlue",
                        boxShadow: "0 0 0 1px #4A90E2",
                      }}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText fontSize="md">
                    {t("survey.wage.wageHelper")}
                  </FormHelperText>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.wage.jobType")}
                  </FormLabel>
                  <Select
                    value={wageSurvey.jobType}
                    onChange={(e) =>
                      setWageSurvey({ ...wageSurvey, jobType: e.target.value })
                    }
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "belongingBlue" }}
                    _focus={{
                      borderColor: "belongingBlue",
                      boxShadow: "0 0 0 1px #4A90E2",
                    }}
                  >
                    <option value="">-- เลือกประเภทงาน --</option>
                    <option value="factory">โรงงาน</option>
                    <option value="construction">ก่อสร้าง</option>
                    <option value="agriculture">เกษตรกรรม</option>
                    <option value="service">บริการ</option>
                    <option value="fishing">ประมง</option>
                    <option value="other">อื่นๆ</option>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  bg="hopeGreen"
                  color="white"
                  isLoading={submitting}
                  _hover={{ bg: "hopeGreen", filter: "brightness(1.1)" }}
                  size="lg"
                  fontSize="lg"
                  py={7}
                  boxShadow="lg"
                >
                  {t("survey.submit")}
                </Button>
              </VStack>
            </TabPanel>

            {/* 2. Clinic Verification */}
            <TabPanel>
              <Stack
                as="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("clinicVerification", clinicVerification);
                }}
                spacing={6}
                align="stretch"
              >
                <Heading size="xl" color="belongingBlue">
                  {t("survey.clinic.title")}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {t("survey.clinic.description")}
                </Text>
                <Divider />

                <FormControl>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.clinic.clinicId")}
                  </FormLabel>
                  <Input
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={clinicVerification.clinicId}
                    onChange={(e) =>
                      setClinicVerification({
                        ...clinicVerification,
                        clinicId: e.target.value,
                      })
                    }
                    placeholder="รหัสคลินิก/โรงพยาบาล (ถ้ามี)"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.clinic.clinicName")}
                  </FormLabel>
                  <Input
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={clinicVerification.clinicName}
                    onChange={(e) =>
                      setClinicVerification({
                        ...clinicVerification,
                        clinicName: e.target.value,
                      })
                    }
                    placeholder="ชื่อคลินิก/โรงพยาบาล"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.clinic.gps")}
                  </FormLabel>
                  <Stack direction={{ base: "column", md: "row" }} spacing={3}>
                    <NumberInput
                      flex={1}
                      size="lg"
                      value={clinicVerification.gpsLatitude}
                      onChange={(_, value) =>
                        setClinicVerification({
                          ...clinicVerification,
                          gpsLatitude: value,
                        })
                      }
                    >
                      <NumberInputField
                        placeholder="ละติจูด"
                        fontSize="md"
                        border="2px solid"
                        borderColor="gray.200"
                      />
                    </NumberInput>
                    <NumberInput
                      flex={1}
                      size="lg"
                      value={clinicVerification.gpsLongitude}
                      onChange={(_, value) =>
                        setClinicVerification({
                          ...clinicVerification,
                          gpsLongitude: value,
                        })
                      }
                    >
                      <NumberInputField
                        placeholder="ลองจิจูด"
                        fontSize="md"
                        border="2px solid"
                        borderColor="gray.200"
                      />
                    </NumberInput>
                  </Stack>
                  <FormHelperText fontSize="md">
                    {t("survey.clinic.gpsHelper")}
                  </FormHelperText>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.clinic.multilingualService")}
                  </FormLabel>
                  <RadioGroup
                    value={clinicVerification.hasMultilingualService}
                    onChange={(value) =>
                      setClinicVerification({
                        ...clinicVerification,
                        hasMultilingualService: value,
                      })
                    }
                  >
                    <Stack direction="row" spacing={5}>
                      <Radio value="yes" size="lg">
                        มี
                      </Radio>
                      <Radio value="no" size="lg">
                        ไม่มี
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <Button
                  type="submit"
                  bg="hopeGreen"
                  color="white"
                  fontSize="lg"
                  py={7}
                  isLoading={submitting}
                  _hover={{ bg: "green.600" }}
                >
                  {t("survey.submit")}
                </Button>
              </Stack>
            </TabPanel>

            {/* 3. Barrier Survey */}
            <TabPanel>
              <Stack
                as="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("barrierSurvey", barrierSurvey);
                }}
                spacing={6}
                align="stretch"
              >
                <Heading size="xl" color="belongingBlue">
                  {t("survey.barrier.title")}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {t("survey.barrier.description")}
                </Text>
                <Divider />

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.barrier.province")}
                  </FormLabel>
                  <Select
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={barrierSurvey.provinceCode}
                    onChange={(e) =>
                      setBarrierSurvey({
                        ...barrierSurvey,
                        provinceCode: e.target.value,
                      })
                    }
                  >
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces?.map((p) => (
                      <option key={p.province} value={p.province}>
                        {p.province_th || p.province}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.barrier.score")}
                  </FormLabel>
                  <NumberInput
                    size="lg"
                    min={1}
                    max={5}
                    value={barrierSurvey.barrierScore}
                    onChange={(_, value) =>
                      setBarrierSurvey({
                        ...barrierSurvey,
                        barrierScore: value,
                      })
                    }
                  >
                    <NumberInputField
                      fontSize="md"
                      border="2px solid"
                      borderColor="gray.200"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText fontSize="md">
                    {t("survey.barrier.scoreHelper")}
                  </FormHelperText>
                </FormControl>

                <Button
                  type="submit"
                  bg="hopeGreen"
                  color="white"
                  fontSize="lg"
                  py={7}
                  isLoading={submitting}
                  _hover={{ bg: "green.600" }}
                >
                  {t("survey.submit")}
                </Button>
              </Stack>
            </TabPanel>

            {/* 4. Incident Report */}
            <TabPanel>
              <Stack
                as="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("incidentReport", incidentReport);
                }}
                spacing={6}
                align="stretch"
              >
                <Heading size="xl" color="belongingBlue">
                  {t("survey.incident.title")}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {t("survey.incident.description")}
                </Text>
                <Divider />

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.incident.province")}
                  </FormLabel>
                  <Select
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={incidentReport.provinceCode}
                    onChange={(e) =>
                      setIncidentReport({
                        ...incidentReport,
                        provinceCode: e.target.value,
                      })
                    }
                  >
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces?.map((p) => (
                      <option key={p.province} value={p.province}>
                        {p.province_th || p.province}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.incident.date")}
                  </FormLabel>
                  <Input
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    type="date"
                    value={incidentReport.incidentDate}
                    onChange={(e) =>
                      setIncidentReport({
                        ...incidentReport,
                        incidentDate: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.incident.type")}
                  </FormLabel>
                  <Select
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={incidentReport.incidentType}
                    onChange={(e) =>
                      setIncidentReport({
                        ...incidentReport,
                        incidentType: e.target.value,
                      })
                    }
                  >
                    <option value="">-- เลือกประเภทเหตุการณ์ --</option>
                    <option value="passport_seizure">ยึดหนังสือเดินทาง</option>
                    <option value="wage_theft">การไม่จ่ายค่าจ้าง</option>
                    <option value="unsafe_work">สภาพการทำงานไม่ปลอดภัย</option>
                    <option value="forced_labor">แรงงานบังคับ</option>
                    <option value="discrimination">การเลือกปฏิบัติ</option>
                    <option value="other">อื่นๆ</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.incident.verified")}
                  </FormLabel>
                  <RadioGroup
                    value={incidentReport.isVerified}
                    onChange={(value) =>
                      setIncidentReport({
                        ...incidentReport,
                        isVerified: value,
                      })
                    }
                  >
                    <Stack direction="row" spacing={5}>
                      <Radio value="verified" size="lg">
                        ยืนยันแล้ว
                      </Radio>
                      <Radio value="not_verified" size="lg">
                        ยังไม่ยืนยัน
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.incident.details")}
                  </FormLabel>
                  <Textarea
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={incidentReport.description}
                    onChange={(e) =>
                      setIncidentReport({
                        ...incidentReport,
                        description: e.target.value,
                      })
                    }
                    placeholder="อธิบายรายละเอียดเหตุการณ์"
                    minH="150px"
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="hopeGreen"
                  color="white"
                  fontSize="lg"
                  py={7}
                  isLoading={submitting}
                  _hover={{ bg: "green.600" }}
                >
                  {t("survey.submit")}
                </Button>
              </Stack>
            </TabPanel>

            {/* 5. NGO Registry */}
            <TabPanel>
              <Stack
                as="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("ngoRegistry", ngoRegistry);
                }}
                spacing={6}
                align="stretch"
              >
                <Heading size="xl" color="belongingBlue">
                  {t("survey.ngo.title")}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {t("survey.ngo.description")}
                </Text>
                <Divider />

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.ngo.name")}
                  </FormLabel>
                  <Input
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={ngoRegistry.organizationName}
                    onChange={(e) =>
                      setNgoRegistry({
                        ...ngoRegistry,
                        organizationName: e.target.value,
                      })
                    }
                    placeholder="ชื่อองค์กร"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.ngo.province")}
                  </FormLabel>
                  <Select
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={ngoRegistry.provinceCode}
                    onChange={(e) =>
                      setNgoRegistry({
                        ...ngoRegistry,
                        provinceCode: e.target.value,
                      })
                    }
                  >
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces?.map((p) => (
                      <option key={p.province} value={p.province}>
                        {p.province_th || p.province}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.ngo.serviceType")}
                  </FormLabel>
                  <Select
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={ngoRegistry.serviceType}
                    onChange={(e) =>
                      setNgoRegistry({
                        ...ngoRegistry,
                        serviceType: e.target.value,
                      })
                    }
                  >
                    <option value="">-- เลือกประเภทบริการ --</option>
                    <option value="legal">กฎหมาย</option>
                    <option value="shelter">ที่พักฉุกเฉิน</option>
                    <option value="health">สุขภาพ</option>
                    <option value="education">การศึกษา</option>
                    <option value="other">อื่นๆ</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.ngo.contact")}
                  </FormLabel>
                  <Input
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={ngoRegistry.contactInfo}
                    onChange={(e) =>
                      setNgoRegistry({
                        ...ngoRegistry,
                        contactInfo: e.target.value,
                      })
                    }
                    placeholder="เบอร์โทร, อีเมล หรือเว็บไซต์"
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="hopeGreen"
                  color="white"
                  fontSize="lg"
                  py={7}
                  isLoading={submitting}
                  _hover={{ bg: "green.600" }}
                >
                  {t("survey.submit")}
                </Button>
              </Stack>
            </TabPanel>

            {/* 6. Field Audit */}
            <TabPanel>
              <Stack
                as="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("fieldAudit", fieldAudit);
                }}
                spacing={6}
                align="stretch"
              >
                <Heading size="xl" color="belongingBlue">
                  {t("survey.audit.title")}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {t("survey.audit.description")}
                </Text>
                <Divider />

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.audit.province")}
                  </FormLabel>
                  <Select
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={fieldAudit.provinceCode}
                    onChange={(e) =>
                      setFieldAudit({
                        ...fieldAudit,
                        provinceCode: e.target.value,
                      })
                    }
                  >
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces?.map((p) => (
                      <option key={p.province} value={p.province}>
                        {p.province_th || p.province}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.audit.officeType")}
                  </FormLabel>
                  <Select
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={fieldAudit.officeType}
                    onChange={(e) =>
                      setFieldAudit({
                        ...fieldAudit,
                        officeType: e.target.value,
                      })
                    }
                  >
                    <option value="">-- เลือกประเภทสำนักงาน --</option>
                    <option value="district_office">ที่ว่าการอำเภอ</option>
                    <option value="hospital">โรงพยาบาล</option>
                    <option value="labor_office">สำนักงานแรงงาน</option>
                    <option value="immigration">สำนักงานตรวจคนเข้าเมือง</option>
                    <option value="other">อื่นๆ</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.audit.multilingualSigns")}
                  </FormLabel>
                  <RadioGroup
                    value={fieldAudit.hasMultilingualSigns}
                    onChange={(value) =>
                      setFieldAudit({
                        ...fieldAudit,
                        hasMultilingualSigns: value,
                      })
                    }
                  >
                    <Stack direction="row" spacing={5}>
                      <Radio value="yes" size="lg">
                        มี
                      </Radio>
                      <Radio value="no" size="lg">
                        ไม่มี
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <FormHelperText fontSize="md">
                    {t("survey.audit.signsHelper")}
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.audit.notes")}
                  </FormLabel>
                  <Textarea
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={fieldAudit.notes}
                    onChange={(e) =>
                      setFieldAudit({ ...fieldAudit, notes: e.target.value })
                    }
                    placeholder="หมายเหตุเพิ่มเติม"
                    minH="120px"
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="hopeGreen"
                  color="white"
                  fontSize="lg"
                  py={7}
                  isLoading={submitting}
                  _hover={{ bg: "green.600" }}
                >
                  {t("survey.submit")}
                </Button>
              </Stack>
            </TabPanel>

            {/* 7. Media Registry */}
            <TabPanel>
              <Stack
                as="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("mediaRegistry", mediaRegistry);
                }}
                spacing={6}
                align="stretch"
              >
                <Heading size="xl" color="belongingBlue">
                  {t("survey.media.title")}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {t("survey.media.description")}
                </Text>
                <Divider />

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.media.name")}
                  </FormLabel>
                  <Input
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={mediaRegistry.mediaName}
                    onChange={(e) =>
                      setMediaRegistry({
                        ...mediaRegistry,
                        mediaName: e.target.value,
                      })
                    }
                    placeholder="ชื่อสื่อ/ช่องทาง"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.media.province")}
                  </FormLabel>
                  <Select
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={mediaRegistry.provinceCode}
                    onChange={(e) =>
                      setMediaRegistry({
                        ...mediaRegistry,
                        provinceCode: e.target.value,
                      })
                    }
                  >
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces?.map((p) => (
                      <option key={p.province} value={p.province}>
                        {p.province_th || p.province}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.media.type")}
                  </FormLabel>
                  <Select
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={mediaRegistry.mediaType}
                    onChange={(e) =>
                      setMediaRegistry({
                        ...mediaRegistry,
                        mediaType: e.target.value,
                      })
                    }
                  >
                    <option value="">-- เลือกประเภทสื่อ --</option>
                    <option value="radio">วิทยุ</option>
                    <option value="facebook">เพจ Facebook</option>
                    <option value="newspaper">หนังสือพิมพ์</option>
                    <option value="website">เว็บไซต์</option>
                    <option value="youtube">YouTube</option>
                    <option value="other">อื่นๆ</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.media.url")}
                  </FormLabel>
                  <Input
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={mediaRegistry.websiteUrl}
                    onChange={(e) =>
                      setMediaRegistry({
                        ...mediaRegistry,
                        websiteUrl: e.target.value,
                      })
                    }
                    placeholder="URL หรือ Link"
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="hopeGreen"
                  color="white"
                  fontSize="lg"
                  py={7}
                  isLoading={submitting}
                  _hover={{ bg: "green.600" }}
                >
                  {t("survey.submit")}
                </Button>
              </Stack>
            </TabPanel>

            {/* 8. Event Log */}
            <TabPanel>
              <Stack
                as="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("eventLog", eventLog);
                }}
                spacing={6}
                align="stretch"
              >
                <Heading size="xl" color="belongingBlue">
                  {t("survey.event.title")}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {t("survey.event.description")}
                </Text>
                <Divider />

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.event.province")}
                  </FormLabel>
                  <Select
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={eventLog.provinceCode}
                    onChange={(e) =>
                      setEventLog({ ...eventLog, provinceCode: e.target.value })
                    }
                  >
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces?.map((p) => (
                      <option key={p.province} value={p.province}>
                        {p.province_th || p.province}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.event.type")}
                  </FormLabel>
                  <Select
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={eventLog.eventType}
                    onChange={(e) =>
                      setEventLog({ ...eventLog, eventType: e.target.value })
                    }
                  >
                    <option value="">-- เลือกประเภทกิจกรรม --</option>
                    <option value="new_year">เทศกาลปีใหม่</option>
                    <option value="religious">พิธีกรรมทางศาสนา</option>
                    <option value="cultural">งานวัฒนธรรม</option>
                    <option value="sports">กีฬา</option>
                    <option value="other">อื่นๆ</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.event.status")}
                  </FormLabel>
                  <RadioGroup
                    value={eventLog.eventStatus}
                    onChange={(value) =>
                      setEventLog({ ...eventLog, eventStatus: value })
                    }
                  >
                    <Stack direction="row" spacing={5}>
                      <Radio value="public" size="lg">
                        สาธารณะ
                      </Radio>
                      <Radio value="workplace" size="lg">
                        ภายในสถานที่ทำงาน
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.event.date")}
                  </FormLabel>
                  <Input
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    type="date"
                    value={eventLog.eventDate}
                    onChange={(e) =>
                      setEventLog({ ...eventLog, eventDate: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.event.details")}
                  </FormLabel>
                  <Textarea
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={eventLog.description}
                    onChange={(e) =>
                      setEventLog({ ...eventLog, description: e.target.value })
                    }
                    placeholder="รายละเอียดกิจกรรม"
                    minH="120px"
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="hopeGreen"
                  color="white"
                  fontSize="lg"
                  py={7}
                  isLoading={submitting}
                  _hover={{ bg: "green.600" }}
                >
                  {t("survey.submit")}
                </Button>
              </Stack>
            </TabPanel>

            {/* 9. Group Registry */}
            <TabPanel>
              <Stack
                as="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("groupRegistry", groupRegistry);
                }}
                spacing={6}
                align="stretch"
              >
                <Heading size="xl" color="belongingBlue">
                  {t("survey.group.title")}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {t("survey.group.description")}
                </Text>
                <Divider />

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.group.name")}
                  </FormLabel>
                  <Input
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={groupRegistry.groupName}
                    onChange={(e) =>
                      setGroupRegistry({
                        ...groupRegistry,
                        groupName: e.target.value,
                      })
                    }
                    placeholder="ชื่อกลุ่ม/องค์กร"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.group.province")}
                  </FormLabel>
                  <Select
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={groupRegistry.provinceCode}
                    onChange={(e) =>
                      setGroupRegistry({
                        ...groupRegistry,
                        provinceCode: e.target.value,
                      })
                    }
                  >
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces?.map((p) => (
                      <option key={p.province} value={p.province}>
                        {p.province_th || p.province}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.group.activeStatus")}
                  </FormLabel>
                  <RadioGroup
                    value={groupRegistry.isActiveLastSixMonths}
                    onChange={(value) =>
                      setGroupRegistry({
                        ...groupRegistry,
                        isActiveLastSixMonths: value,
                      })
                    }
                  >
                    <Stack direction="row" spacing={5}>
                      <Radio value="yes" size="lg">
                        ยืนยัน (มีการเคลื่อนไหวใน 6 เดือน)
                      </Radio>
                      <Radio value="no" size="lg">
                        ยังไม่ยืนยัน
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.group.contactPerson")}
                  </FormLabel>
                  <Input
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={groupRegistry.contactPerson}
                    onChange={(e) =>
                      setGroupRegistry({
                        ...groupRegistry,
                        contactPerson: e.target.value,
                      })
                    }
                    placeholder="ชื่อผู้ติดต่อ"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    {t("survey.group.contact")}
                  </FormLabel>
                  <Input
                    size="lg"
                    fontSize="md"
                    border="2px solid"
                    borderColor="gray.200"
                    focusBorderColor="belongingBlue"
                    value={groupRegistry.contactInfo}
                    onChange={(e) =>
                      setGroupRegistry({
                        ...groupRegistry,
                        contactInfo: e.target.value,
                      })
                    }
                    placeholder="เบอร์โทร หรืออีเมล"
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="hopeGreen"
                  color="white"
                  fontSize="lg"
                  py={7}
                  isLoading={submitting}
                  _hover={{ bg: "green.600" }}
                >
                  {t("survey.submit")}
                </Button>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
}
