import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Divider,
  SimpleGrid,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Button,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PopulationPieChart from "./PopulationPieChart";
import { calculateStudentPopulation } from "../utils/studentPopulation";

interface StatelessData {
  จังหวัด: string;
  จำนวนประชากรชายที่มิใช่สัญชาติไทย: number;
  จำนวนประชากรหญิงที่มิใช่สัญชาติไทย: number;
  ผลรวมประชากรที่มิใช่สัญชาติไทย: number;
}

interface RefugeeData {
  จังหวัด: string;
  หญิง: string;
  ชาย: string;
  ยอดรวม: string;
}

interface PopulationData {
  migrant: Record<string, string>;
  thai: Record<string, string>;
  stateless?: StatelessData;
  refugee?: RefugeeData;
}

interface EconomicRecord {
  สถานพยาบาล: string;
  ประเภท: string;
  สัญชาติ: string;
  จำนวนคน: number;
}

interface EconomicData {
  ภูมิภาค: string;
  records: EconomicRecord[];
}

interface MinimumWageRecord {
  "ค่าจ้างขั้นต่ำ (บาท)": number;
  รายละอียด: string | null;
}

interface MinimumWageData {
  ภูมิภาค: string;
  records: MinimumWageRecord[];
}

interface OccupationalDiseaseData {
  ภูมิภาค: string;
  สารกำจัดแมลง_คน: number | string;
  สารกำจัดแมลง_ครั้ง: number | string;
  สารกำจัดวัชพืช_คน: number | string;
  สารกำจัดวัชพืช_ครั้ง: number | string;
  "พิษจากสารกำจัดศัตรูพืช(อื่นๆ)_คน": number | string;
  "พิษจากสารกำจัดศัตรูพืช(อื่นๆ)_ครั้ง": number | string;
  โรคกระดูกและกล้ามเนื้อจากการทำงาน_คน: number | string;
  โรคกระดูกและกล้ามเนื้อจากการทำงาน_ครั้ง: number | string;
  โรคระบบทางเดินหายใจที่เกิดจากแอสเบสตอส_คน: number | string;
  โรคระบบทางเดินหายใจที่เกิดจากแอสเบสตอส_ครั้ง: number | string;
  โรคมะเร็งเยื่อหุ้มปอดมีโซทิลิโอมา_คน: number | string;
  โรคมะเร็งเยื่อหุ้มปอดมีโซทิลิโอมา_ครั้ง: number | string;
  โรคปอดฝุ่นหิน_คน: number | string;
  โรคปอดฝุ่นหิน_ครั้ง: number | string;
  โรคการได้ยินเสื่อมจากเสียง_คน: number | string;
  โรคการได้ยินเสื่อมจากเสียง_ครั้ง: number | string;
  พิษสารตัวทำละลายอินทรีย์จากการทำงาน_คน: number | string;
  พิษสารตัวทำละลายอินทรีย์จากการทำงาน_ครั้ง: number | string;
  บาดเจ็บจากการทำงาน_คน: number | string;
  บาดเจ็บจากการทำงาน_ครั้ง: number | string;
  พิษโลหะหนักจากการทำงาน_คน: number | string;
  พิษโลหะหนักจากการทำงาน_ครั้ง: number | string;
  พิษสารตะกั่วจากการทำงาน_คน: number | string;
  พิษสารตะกั่วจากการทำงาน_ครั้ง: number | string;
  พิษปรอทจากการทำงาน_คน: number | string;
  พิษปรอทจากการทำงาน_ครั้ง: number | string;
  โรคที่เกิดจากความร้อนจากการทำงาน_คน: number | string;
  โรคที่เกิดจากความร้อนจากการทำงาน_ครั้ง: number | string;
  โรคผิวหนังจากการทำงาน_คน: number | string;
  โรคผิวหนังจากการทำงาน_ครั้ง: number | string;
  โรคหอบหืดจากการทำงาน_คน: number | string;
  โรคหอบหืดจากการทำงาน_ครั้ง: number | string;
}

interface PopulationSidebarProps {
  selectedProvince: string | null;
}

interface StudentData {
  "รหัสจังหวัด": number;
  "จังหวัด": string;
  "จำนวน (ชาย)": string;
  "จำนวน (หญิง)": string;
  "ยอดรวม": string;
}

interface ProvinceData {
  pro_code: string;
  pro_th: string;
  pro_en: string;
  reg_nesdb: string;
  reg_royin: string;
  perimeter: number;
  area_sqkm: number;
}

export default function PopulationSidebar({
  selectedProvince,
}: PopulationSidebarProps) {
  const { t } = useTranslation();
  const [populationData, setPopulationData] = useState<PopulationData | null>(
    null
  );
  const [economicData, setEconomicData] = useState<EconomicData | null>(null);
  const [minimumWageData, setMinimumWageData] =
    useState<MinimumWageData | null>(null);
  const [safetyData, setSafetyData] = useState<OccupationalDiseaseData | null>(
    null
  );
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [provincesData, setProvincesData] = useState<ProvinceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedProvince) {
      setPopulationData(null);
      setEconomicData(null);
      setMinimumWageData(null);
      setSafetyData(null);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([
      fetch("/data/migrant_pop_province.json").then((r) => r.json()),
      fetch("/data/thai_pop_province.json").then((r) => r.json()),
      fetch("/data/nonthai_registration_by_province.json").then((r) =>
        r.json()
      ),
      fetch("/data/minimum_wage_by_province.json").then((r) => r.json()),
      fetch("/data/occupational_disease_by_province.json.json").then((r) =>
        r.json()
      ),
      fetch("/data/stateless_pop_province.json").then((r) => r.json()),
      fetch("/data/refugee_pop_province.json").then((r) => r.json()),
      fetch("/data/student-pop-67.json").then((r) => r.json()),
      fetch("/data/provinces.geojson").then((r) => r.json()),
    ])
      .then(
        ([
          migrantData,
          thaiData,
          economicData,
          minimumWageData,
          safetyData,
          statelessData,
          refugeeData,
          studentData,
          provincesGeoJson,
        ]) => {
          setStudentData(studentData);
          setProvincesData(provincesGeoJson.features.map((f: any) => f.properties));
          const migrant = migrantData[selectedProvince];
          const thai = thaiData[selectedProvince];
          const economic = economicData[selectedProvince];
          const minimumWage = minimumWageData[selectedProvince];
          const safety = safetyData[selectedProvince];
          const stateless = statelessData.find(
            (item: StatelessData) => item.จังหวัด === selectedProvince
          );
          const refugee = refugeeData.find(
            (item: RefugeeData) => item.จังหวัด === selectedProvince
          );

          if (
            !migrant &&
            !thai &&
            !economic &&
            !minimumWage &&
            !safety &&
            !stateless &&
            !refugee
          ) {
            setError(`ไม่พบข้อมูลสำหรับจังหวัด ${selectedProvince}`);
            setPopulationData(null);
            setEconomicData(null);
            setMinimumWageData(null);
            setSafetyData(null);
            setStudentData([]);
            setProvincesData([]);
          } else {
            setPopulationData({ migrant, thai, stateless, refugee });
            setEconomicData(economic);
            setMinimumWageData(minimumWage);
            setSafetyData(safety);
          }
        }
      )
      .catch((err) => {
        console.error("Error loading data:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        setPopulationData(null);
        setEconomicData(null);
        setMinimumWageData(null);
        setSafetyData(null);
        setStudentData([]);
        setProvincesData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedProvince]);

  const formatNumber = (num: string | number) => {
    if (!num || num === "0") return "0";
    const numStr =
      typeof num === "string" ? num.replace(/,/g, "") : num.toString();
    return parseInt(numStr).toLocaleString("th-TH");
  };

  const getRegionColor = (region: string) => {
    const colors: { [key: string]: string } = {
      กรุงเทพมหานคร: "purple",
      ภาคกลาง: "blue",
      ภาคเหนือ: "green",
      ภาคตะวันออกเฉียงเหนือ: "orange",
      ภาคตะวันออก: "teal",
      ภาคใต้: "red",
    };
    return colors[region] || "gray";
  };

  // Process economic data for display
  const processEconomicData = (data: EconomicData) => {
    const byNationality: { [key: string]: number } = {};
    const byType: { [key: string]: number } = {};
    const byHospital: { [key: string]: number } = {};
    let totalRegistrations = 0;

    data.records.forEach((record) => {
      const nationality = record.สัญชาติ;
      const type = record.ประเภท;
      const hospital = record.สถานพยาบาล;
      const count = record.จำนวนคน;

      byNationality[nationality] = (byNationality[nationality] || 0) + count;
      byType[type] = (byType[type] || 0) + count;
      byHospital[hospital] = (byHospital[hospital] || 0) + count;
      totalRegistrations += count;
    });

    return {
      byNationality,
      byType,
      byHospital,
      totalRegistrations,
    };
  };

  const EmptyState = () => (
    <Box
      height="100%"
      width="100%"
      p={{ base: 4, md: 6 }}
      bg="warmSand"
      borderRadius="lg"
      position="relative"
      overflow="hidden"
    >
      {/* Background pattern */}
      <Box
        position="absolute"
        top="0"
        right="0"
        width="120px"
        height="120px"
        opacity="0.1"
        bg="linear-gradient(135deg, #4A90E2, #50E3C2)"
        borderRadius="full"
        transform="translate(50%, -50%)"
      />

      <VStack
        spacing={5}
        align="start"
        width="100%"
        position="relative"
        zIndex={1}
      >
        <Box>
          {/* Logo */}
          <Box mb={3} display="flex" justifyContent="flex-start">
            <img
              src="/image/favicon.svg"
              alt="WeBelong Logo"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "contain",
              }}
            />
          </Box>

          <Heading
            size={{ base: "sm", md: "md" }}
            color="deepNavy"
            mb={2}
            fontFamily="heading"
          >
            {t("home.title")}
          </Heading>
          <Box
            width="40px"
            height="3px"
            bg="belongingBlue"
            borderRadius="full"
          />
        </Box>

        <VStack spacing={4} align="start" width="100%">
          <HStack align="start" spacing={3}>
            <Box
              width="8px"
              height="8px"
              bg="belongingBlue"
              borderRadius="full"
              mt={1}
              flexShrink={0}
            />
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="deepNavy"
              lineHeight={{ base: "1.5", md: "1.7" }}
              fontWeight="medium"
            >
              {t("home.migrantStats")}{" "}
              <Text as="span" fontWeight="bold" color="belongingBlue">
                3.1 {t("home.millionPeople")}
              </Text>{" "}
              (4.7% {t("home.percentOfThai")})
            </Text>
          </HStack>

          <HStack align="start" spacing={3}>
            <Box
              width="8px"
              height="8px"
              bg="hopeGreen"
              borderRadius="full"
              mt={1}
              flexShrink={0}
            />
            <Text
              fontSize="sm"
              color="deepNavy"
              lineHeight="1.7"
              fontWeight="medium"
            >
              {t("home.statelessStats")}{" "}
              <Text as="span" fontWeight="bold" color="#FF7F7F">
                0.86 {t("home.millionPeople")}
              </Text>{" "}
              (1.3%) {t("home.refugeeStats")}{" "}
              <Text as="span" fontWeight="bold" color="#9B59B6">
                0.11 {t("home.millionPeople")}
              </Text>{" "}
              (0.2%)
            </Text>
          </HStack>

          <HStack align="start" spacing={3}>
            <Box
              width="8px"
              height="8px"
              bg="belongingBlue"
              borderRadius="full"
              mt={1}
              flexShrink={0}
            />
            <Text
              fontSize="sm"
              color="deepNavy"
              lineHeight="1.7"
              fontWeight="medium"
            >
              {t("home.topProvinces")}{" "}
              <Text as="span" fontWeight="bold" color="belongingBlue">
                สมุทรสาคร ภูเก็ต สมุทรปราการ
              </Text>
            </Text>
          </HStack>

          <HStack align="start" spacing={3}>
            <Box
              width="8px"
              height="8px"
              bg="hopeGreen"
              borderRadius="full"
              mt={1}
              flexShrink={0}
            />
            <Text
              fontSize="sm"
              color="deepNavy"
              lineHeight="1.7"
              fontWeight="medium"
            >
              {t("home.borderProvinces")}{" "}
              <Text as="span" fontWeight="bold" color="#FF7F7F">
                ตาก แม่ฮ่องสอน
              </Text>
            </Text>
          </HStack>
        </VStack>

        <Box
          p={4}
          bg="white"
          borderRadius="md"
          border="1px solid"
          borderColor="belongingBlue"
          width="100%"
          mt={4}
        >
          <HStack spacing={2}>
            <Text fontSize="sm" color="deepNavy" fontWeight="semibold">
              {t("home.clickMap")}
            </Text>
            <Text fontSize="lg">👉</Text>
          </HStack>
        </Box>

        {/* Partner Logos */}
        <Box mt={{ base: 4, md: 6 }} width="100%">
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.500"
            mb={{ base: 2, md: 3 }}
            textAlign="center"
            fontWeight="medium"
          >
            {t("home.partners")}
          </Text>
          <SimpleGrid columns={2} spacing={{ base: 2, md: 4 }} justifyItems="center">
            <Box>
              <img
                src="/image/logo/1-partner-logo.svg"
                alt="Partner 1"
                style={{
                  height: "35px",
                  objectFit: "contain",
                  filter: "opacity(0.9)",
                }}
              />
            </Box>
            <Box>
              <img
                src="/image/logo/2-blue-partner-logo.svg"
                alt="Partner 2"
                style={{
                  height: "35px",
                  objectFit: "contain",
                  filter: "opacity(0.9)",
                }}
              />
            </Box>
            <Box>
              <img
                src="/image/logo/3-blue-partner-logo.svg"
                alt="Partner 3"
                style={{
                  height: "35px",
                  objectFit: "contain",
                  filter: "opacity(0.9)",
                }}
              />
            </Box>
            <Box>
              <img
                src="/image/logo/4-partner-logo.svg"
                alt="Partner 4"
                style={{
                  height: "35px",
                  objectFit: "contain",
                  filter: "opacity(0.9)",
                }}
              />
            </Box>
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );

  const LoadingState = () => (
    <VStack
      spacing={4}
      align="center"
      justify="center"
      height="100%"
      width="100%"
    >
      <Spinner size="lg" color="belongingBlue" />
      <Text color="gray.500">{t("home.loading")}</Text>
    </VStack>
  );

  const ErrorState = () => (
    <Alert status="error" width="100%">
      <AlertIcon />
      {error}
    </Alert>
  );

  const PopulationTab = () => (
    <VStack spacing={6} align="stretch" width="100%">
      {/* Population Pie Chart */}
      {populationData?.thai && populationData?.migrant && selectedProvince && (() => {
        // Get province code for student data lookup
        const provinceInfo = provincesData.find(p => p.pro_th === selectedProvince);
        const provinceCode = provinceInfo ? parseInt(provinceInfo.pro_code) : 0;
        const studentPopulation = calculateStudentPopulation(studentData, provinceCode);
        
        return (
          <PopulationPieChart
            thaiPopulation={parseInt(
              populationData.thai.ประชากรรวม?.replace(/,/g, "") || "0"
            )}
            migrantPopulation={parseInt(
              populationData.migrant["รวมทั้งสิ้น (คน)"]?.replace(/,/g, "") || "0"
            )}
            statelessPopulation={
              populationData.stateless?.ผลรวมประชากรที่มิใช่สัญชาติไทย || 0
            }
            refugeePopulation={parseInt(
              populationData.refugee?.ยอดรวม?.replace(/,/g, "") || "0"
            )}
            studentPopulation={studentPopulation}
            provinceName={selectedProvince}
          />
        );
      })()}

      {/* Quick Stats Cards */}
      <SimpleGrid columns={1} spacing={4} width="100%">
        {/* Thai Population Card */}
        <Box
          p={4}
          bg="blue.50"
          borderRadius="lg"
          borderLeft="4px"
          borderColor="belongingBlue"
          width="100%"
        >
          <VStack spacing={3} align="start" width="100%">
            <Text fontWeight="bold" color="belongingBlue" fontSize="sm">
              {t("population.thaiPopulation")}
            </Text>
            {populationData?.thai ? (
              <>
                <HStack justify="space-between" width="100%">
                  <Text fontSize="2xl" fontWeight="bold" color="deepNavy">
                    {formatNumber(populationData.thai.ประชากรรวม || "0")}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {t("population.people")}
                  </Text>
                </HStack>
                <HStack spacing={4} width="100%">
                  <VStack spacing={0} align="start">
                    <Text fontSize="xs" color="gray.600">
                      {t("population.male")}
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {formatNumber(populationData.thai.ประชากรชาย || "0")}
                    </Text>
                  </VStack>
                  <VStack spacing={0} align="start">
                    <Text fontSize="xs" color="gray.600">
                      {t("population.female")}
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {formatNumber(populationData.thai.ประชากรหญิง || "0")}
                    </Text>
                  </VStack>
                </HStack>
              </>
            ) : (
              <Text color="gray.500">{t("population.noData")}</Text>
            )}
          </VStack>
        </Box>

        {/* Migrant Population Card */}
        <Box
          p={4}
          bg="green.50"
          borderRadius="lg"
          borderLeft="4px"
          borderColor="belongingGreen"
          width="100%"
        >
          <VStack spacing={3} align="start" width="100%">
            <Text fontWeight="bold" color="belongingGreen" fontSize="sm">
              {t("population.migrantPopulation")}
            </Text>
            {populationData?.migrant ? (
              <>
                <HStack justify="space-between" width="100%">
                  <Text fontSize="2xl" fontWeight="bold" color="deepNavy">
                    {formatNumber(
                      populationData.migrant["รวมทั้งสิ้น (คน)"] || "0"
                    )}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    คน
                  </Text>
                </HStack>
                <HStack spacing={4} width="100%">
                  <VStack spacing={0} align="start">
                    <Text fontSize="xs" color="gray.600">
                      ชาย
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {formatNumber(
                        populationData.migrant["รวมทั้งสิ้น ชาย"] || "0"
                      )}
                    </Text>
                  </VStack>
                  <VStack spacing={0} align="start">
                    <Text fontSize="xs" color="gray.600">
                      หญิง
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {formatNumber(
                        populationData.migrant["รวมทั้งสิ้น หญิง"] || "0"
                      )}
                    </Text>
                  </VStack>
                </HStack>
              </>
            ) : (
              <Text color="gray.500">ไม่มีข้อมูล</Text>
            )}
          </VStack>
        </Box>

        {/* Stateless Population Card */}
        {populationData?.stateless &&
          populationData.stateless.ผลรวมประชากรที่มิใช่สัญชาติไทย > 0 && (
            <Box
              p={4}
              bg="red.50"
              borderRadius="lg"
              borderLeft="4px"
              borderColor="#FF7F7F"
              width="100%"
            >
              <VStack spacing={3} align="start" width="100%">
                <Text fontWeight="bold" color="#FF7F7F" fontSize="sm">
                  คนไร้รัฐไร้สัญชาติ
                </Text>
                <HStack justify="space-between" width="100%">
                  <Text fontSize="2xl" fontWeight="bold" color="deepNavy">
                    {formatNumber(
                      populationData.stateless.ผลรวมประชากรที่มิใช่สัญชาติไทย
                    )}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    คน
                  </Text>
                </HStack>
                <HStack spacing={4} width="100%">
                  <VStack spacing={0} align="start">
                    <Text fontSize="xs" color="gray.600">
                      ชาย
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {formatNumber(
                        populationData.stateless
                          .จำนวนประชากรชายที่มิใช่สัญชาติไทย
                      )}
                    </Text>
                  </VStack>
                  <VStack spacing={0} align="start">
                    <Text fontSize="xs" color="gray.600">
                      หญิง
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {formatNumber(
                        populationData.stateless
                          .จำนวนประชากรหญิงที่มิใช่สัญชาติไทย
                      )}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          )}

        {/* Refugee Population Card */}
        {populationData?.refugee &&
          parseInt(populationData.refugee.ยอดรวม?.replace(/,/g, "") || "0") >
            0 && (
            <Box
              p={4}
              bg="purple.50"
              borderRadius="lg"
              borderLeft="4px"
              borderColor="#9B59B6"
              width="100%"
            >
              <VStack spacing={3} align="start" width="100%">
                <Text fontWeight="bold" color="#9B59B6" fontSize="sm">
                  ผู้ลี้ภัย
                </Text>
                <HStack justify="space-between" width="100%">
                  <Text fontSize="2xl" fontWeight="bold" color="deepNavy">
                    {formatNumber(populationData.refugee.ยอดรวม || "0")}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    คน
                  </Text>
                </HStack>
                <HStack spacing={4} width="100%">
                  <VStack spacing={0} align="start">
                    <Text fontSize="xs" color="gray.600">
                      ชาย
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {formatNumber(populationData.refugee.ชาย || "0")}
                    </Text>
                  </VStack>
                  <VStack spacing={0} align="start">
                    <Text fontSize="xs" color="gray.600">
                      หญิง
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {formatNumber(populationData.refugee.หญิง || "0")}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          )}
      </SimpleGrid>
    </VStack>
  );

  const EconomicTab = () => {
    return (
      <VStack spacing={6} align="stretch" width="100%">
        {/* Minimum Wage Section */}
        {minimumWageData && (
          <Box
            p={4}
            bg="purple.50"
            borderRadius="lg"
            borderLeft="4px"
            borderColor="purple.400"
            width="100%"
          >
            <VStack spacing={3} align="start" width="100%">
              <Text fontWeight="bold" color="purple.600" fontSize="sm">
                ค่าแรงขั้นต่ำ
              </Text>
              <HStack justify="space-between" width="100%">
                <Text fontSize="2xl" fontWeight="bold" color="deepNavy">
                  {formatNumber(
                    minimumWageData.records[0]["ค่าจ้างขั้นต่ำ (บาท)"]
                  )}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  บาท/วัน
                </Text>
              </HStack>
              {minimumWageData.records[0].รายละอียด &&
                minimumWageData.records[0].รายละอียด !== null && (
                  <Text fontSize="sm" color="gray.600">
                    {minimumWageData.records[0].รายละอียด}
                  </Text>
                )}
            </VStack>
          </Box>
        )}

        {/* Wage Calculator Button */}
        {minimumWageData && (
          <Button
            as={RouterLink}
            to="/calculator"
            colorScheme="purple"
            variant="outline"
            size="md"
            width="100%"
            fontWeight="bold"
            borderRadius="lg"
            _hover={{
              bg: "purple.50",
              borderColor: "purple.500",
              transform: "translateY(-1px)",
            }}
            _active={{
              transform: "translateY(0px)",
            }}
            leftIcon={<Box fontSize="lg">🧮</Box>}
          >
            คำนวณค่าแรงที่ควรได้รับ
          </Button>
        )}

        {/* Social Security Registration Section */}
        {economicData && (
          <>
            <Box width="100%">
              <Text fontWeight="bold" color="deepNavy" mb={4} fontSize="md">
                การขึ้นทะเบียนประกันสังคมของประชากรข้ามชาติ
              </Text>
            </Box>

            {(() => {
              const processedData = processEconomicData(economicData);
              return (
                <>
                  {/* Total Registration Summary */}
                  <Box
                    p={4}
                    bg="orange.50"
                    borderRadius="lg"
                    borderLeft="4px"
                    borderColor="orange.400"
                    width="100%"
                  >
                    <VStack spacing={3} align="start" width="100%">
                      <Text fontWeight="bold" color="orange.600" fontSize="sm">
                        การลงทะเบียนรวม
                      </Text>
                      <HStack justify="space-between" width="100%">
                        <Text fontSize="2xl" fontWeight="bold" color="deepNavy">
                          {formatNumber(processedData.totalRegistrations)}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          ครั้ง
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* By Nationality */}
                  <Box width="100%">
                    <Text
                      fontWeight="bold"
                      color="deepNavy"
                      mb={3}
                      fontSize="sm"
                    >
                      จำแนกตามสัญชาติ
                    </Text>
                    <VStack spacing={2} width="100%">
                      {Object.entries(processedData.byNationality)
                        .sort(([, a], [, b]) => b - a)
                        .map(([nationality, count]) => (
                          <HStack
                            key={nationality}
                            justify="space-between"
                            p={3}
                            bg="gray.50"
                            borderRadius="md"
                            width="100%"
                          >
                            <Text fontSize="sm" color="gray.700" flex={1}>
                              {nationality}
                            </Text>
                            <Text
                              fontSize="sm"
                              fontWeight="semibold"
                              color="deepNavy"
                            >
                              {formatNumber(count)}
                            </Text>
                          </HStack>
                        ))}
                    </VStack>
                  </Box>

                  {/* By Type */}
                  <Box width="100%">
                    <Text
                      fontWeight="bold"
                      color="deepNavy"
                      mb={3}
                      fontSize="sm"
                    >
                      จำแนกตามประเภท
                    </Text>
                    <VStack spacing={2} width="100%">
                      {Object.entries(processedData.byType)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([type, count]) => (
                          <HStack
                            key={type}
                            justify="space-between"
                            p={3}
                            bg="gray.50"
                            borderRadius="md"
                            width="100%"
                          >
                            <Text fontSize="sm" color="gray.700" flex={1}>
                              {type}
                            </Text>
                            <Text
                              fontSize="sm"
                              fontWeight="semibold"
                              color="deepNavy"
                            >
                              {formatNumber(count)}
                            </Text>
                          </HStack>
                        ))}
                    </VStack>
                  </Box>

                  {/* Top Hospitals */}
                  <Box width="100%">
                    <Text
                      fontWeight="bold"
                      color="deepNavy"
                      mb={3}
                      fontSize="sm"
                    >
                      สถานพยาบาลที่มีการลงทะเบียนสูงสุด
                    </Text>
                    <VStack spacing={2} width="100%">
                      {Object.entries(processedData.byHospital)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([hospital, count]) => (
                          <HStack
                            key={hospital}
                            justify="space-between"
                            p={3}
                            bg="gray.50"
                            borderRadius="md"
                            width="100%"
                          >
                            <Text fontSize="sm" color="gray.700" flex={1}>
                              {hospital}
                            </Text>
                            <Text
                              fontSize="sm"
                              fontWeight="semibold"
                              color="deepNavy"
                            >
                              {formatNumber(count)}
                            </Text>
                          </HStack>
                        ))}
                    </VStack>
                  </Box>
                </>
              );
            })()}
          </>
        )}

        {/* No Data State */}
        {!minimumWageData && !economicData && (
          <VStack spacing={4} align="center" justify="center" height="200px">
            <Text color="gray.500">ไม่มีข้อมูลเศรษฐกิจ</Text>
          </VStack>
        )}
      </VStack>
    );
  };

  const SafetyTab = () => {
    if (!safetyData) {
      return (
        <VStack spacing={4} align="center" justify="center" height="200px">
          <Text fontSize="lg" color="gray.500" textAlign="center">
            ข้อมูลความปลอดภัย
          </Text>
          <Text fontSize="sm" color="gray.400" textAlign="center">
            ไม่มีข้อมูลโรคจากการทำงาน
          </Text>
        </VStack>
      );
    }

    // Process safety data to get top diseases
    const diseaseEntries = Object.entries(safetyData)
      .filter(([key]) => key !== "ภูมิภาค" && key.includes("_คน"))
      .map(([key, value]) => ({
        name: key.replace("_คน", ""),
        people: parseInt(value?.toString() || "0"),
        incidents: parseInt(
          safetyData[
            key.replace("_คน", "_ครั้ง") as keyof OccupationalDiseaseData
          ]?.toString() || "0"
        ),
      }))
      .filter((item) => item.people > 0)
      .sort((a, b) => b.people - a.people);

    const totalPeople = diseaseEntries.reduce(
      (sum, item) => sum + item.people,
      0
    );
    const totalIncidents = diseaseEntries.reduce(
      (sum, item) => sum + item.incidents,
      0
    );

    return (
      <VStack spacing={6} align="stretch" width="100%">
        {/* Total Summary */}
        <Box
          p={4}
          bg="red.50"
          borderRadius="lg"
          borderLeft="4px"
          borderColor="red.400"
          width="100%"
        >
          <VStack spacing={3} align="start" width="100%">
            <Text fontWeight="bold" color="red.600" fontSize="sm">
              สรุปโรคจากการทำงาน
            </Text>
            <SimpleGrid columns={2} spacing={4} width="100%">
              <VStack spacing={1} align="start">
                <Text fontSize="2xl" fontWeight="bold" color="deepNavy">
                  {formatNumber(totalPeople)}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  คนป่วย
                </Text>
              </VStack>
              <VStack spacing={1} align="start">
                <Text fontSize="2xl" fontWeight="bold" color="deepNavy">
                  {formatNumber(totalIncidents)}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  ครั้ง
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Top Diseases */}
        {diseaseEntries.length > 0 ? (
          <Box width="100%">
            <Text fontWeight="bold" color="deepNavy" mb={3} fontSize="sm">
              โรคจากการทำงานที่พบ (อันดับสูงสุด)
            </Text>
            <VStack spacing={2} width="100%">
              {diseaseEntries.slice(0, 8).map((disease) => (
                <HStack
                  key={disease.name}
                  justify="space-between"
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  width="100%"
                >
                  <VStack spacing={1} align="start" flex={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      {disease.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {formatNumber(disease.incidents)} ครั้ง
                    </Text>
                  </VStack>
                  <VStack spacing={0} align="end">
                    <Text fontSize="sm" fontWeight="bold" color="red.600">
                      {formatNumber(disease.people)}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      คน
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </Box>
        ) : (
          <Box
            p={4}
            bg="green.50"
            borderRadius="lg"
            borderLeft="4px"
            borderColor="green.400"
            width="100%"
          >
            <Text fontWeight="bold" color="green.600" fontSize="sm">
              ✅ ไม่พบรายงานโรคจากการทำงาน
            </Text>
            <Text fontSize="sm" color="gray.600" mt={2}>
              จังหวัดนี้ไม่มีการรายงานโรคจากการทำงานในระบบ
            </Text>
          </Box>
        )}

        {/* Safety Note */}
        <Box p={3} bg="blue.50" borderRadius="md" width="100%">
          <Text fontSize="xs" color="blue.700" fontStyle="italic">
            📊 ข้อมูลจากระบบเฝ้าระวังโรคจากการทำงาน กรมควบคุมโรค
          </Text>
        </Box>
      </VStack>
    );
  };

  const CultureTab = () => (
    <VStack spacing={6} align="center" justify="center" height="300px">
      <Box textAlign="center">
        <Text fontSize="4xl" mb={2}>
          🎭
        </Text>
        <Text fontSize="lg" fontWeight="bold" color="gray.500" mb={2}>
          ข้อมูลวัฒนธรรม
        </Text>
        <Text fontSize="sm" color="gray.400" textAlign="center" mb={4}>
          กำลังจัดเตรียมข้อมูลด้านวัฒนธรรม
          <br />
          ของประชากรข้ามชาติในพื้นที่
        </Text>
        <Box
          px={4}
          py={2}
          bg="gray.100"
          borderRadius="full"
          display="inline-block"
        >
          <Text fontSize="xs" color="gray.600" fontWeight="medium">
            เร็วๆ นี้
          </Text>
        </Box>
      </Box>
    </VStack>
  );

  const CommunityTab = () => (
    <VStack spacing={6} align="center" justify="center" height="300px">
      <Box textAlign="center">
        <Text fontSize="4xl" mb={2}>
          🏘️
        </Text>
        <Text fontSize="lg" fontWeight="bold" color="gray.500" mb={2}>
          โครงสร้างชุมชน
        </Text>
        <Text fontSize="sm" color="gray.400" textAlign="center" mb={4}>
          กำลังจัดเตรียมข้อมูลโครงสร้าง
          <br />
          และองค์กรชุมชนของประชากรข้ามชาติ
        </Text>
        <Box
          px={4}
          py={2}
          bg="gray.100"
          borderRadius="full"
          display="inline-block"
        >
          <Text fontSize="xs" color="gray.600" fontWeight="medium">
            เร็วๆ นี้
          </Text>
        </Box>
      </Box>
    </VStack>
  );

  if (!selectedProvince) {
    return (
      <Box
        px={{ base: 2, md: 3 }}
        py={{ base: 4, md: 6 }}
        bg="white"
        height="100%"
        borderRight={{ base: "none", lg: "1px" }}
        borderColor="gray.200"
        width="100%"
      >
        <EmptyState />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        px={{ base: 2, md: 3 }}
        py={{ base: 4, md: 6 }}
        bg="white"
        height="100%"
        borderRight={{ base: "none", lg: "1px" }}
        borderColor="gray.200"
        width="100%"
      >
        <LoadingState />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        px={{ base: 2, md: 3 }}
        py={{ base: 4, md: 6 }}
        bg="white"
        height="100%"
        borderRight={{ base: "none", lg: "1px" }}
        borderColor="gray.200"
        width="100%"
      >
        <ErrorState />
      </Box>
    );
  }

  return (
    <Box
      px={{ base: 3, md: 4 }}
      py={{ base: 4, md: 6 }}
      bg="white"
      height="100%"
      borderRight={{ base: "none", lg: "1px" }}
      borderColor="gray.200"
      overflowY="auto"
      width="100%"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '2px',
        },
      }}
    >
      <VStack spacing={6} align="stretch" width="100%">
        {/* Province Header */}
        <VStack spacing={{ base: 1, md: 2 }} align="center">
          <Heading size={{ base: "md", md: "lg" }} color="deepNavy" textAlign="center" lineHeight="shorter">
            {selectedProvince}
          </Heading>
          {(populationData?.migrant?.ภูมิภาค || economicData?.ภูมิภาค) && (
            <Badge
              colorScheme={getRegionColor(
                populationData?.migrant?.ภูมิภาค || economicData?.ภูมิภาค || ""
              )}
              variant="solid"
              px={{ base: 2, md: 3 }}
              py={1}
              fontSize={{ base: "xs", md: "sm" }}
            >
              {populationData?.migrant?.ภูมิภาค || economicData?.ภูมิภาค}
            </Badge>
          )}
        </VStack>

        <Divider display={{ base: "none", md: "block" }} />

        {/* Tabs */}
        <Tabs variant="soft-rounded" colorScheme="blue" width="100%">
          <TabList
            mb={{ base: 3, md: 4 }}
            justifyContent="center"
            width="100%"
            flexWrap="wrap"
            gap={{ base: 1, md: 1 }}
            overflowX="auto"
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <Tab
              fontSize={{ base: "xs", md: "sm" }}
              minW={{ base: "70px", md: "80px" }}
              px={{ base: 2, md: 3 }}
              py={{ base: 2, md: 1 }}
              _selected={{ 
                bg: "blue.500", 
                color: "white",
                transform: "scale(1.02)"
              }}
            >
              สังคม
            </Tab>
            <Tab
              fontSize={{ base: "xs", md: "sm" }}
              minW={{ base: "70px", md: "80px" }}
              px={{ base: 2, md: 3 }}
              py={{ base: 2, md: 1 }}
              _selected={{ 
                bg: "blue.500", 
                color: "white",
                transform: "scale(1.02)"
              }}
            >
              เศรษฐกิจ
            </Tab>
            <Tab
              fontSize={{ base: "xs", md: "sm" }}
              minW={{ base: "70px", md: "90px" }}
              px={{ base: 2, md: 3 }}
              py={{ base: 2, md: 1 }}
              _selected={{ 
                bg: "blue.500", 
                color: "white",
                transform: "scale(1.02)"
              }}
            >
              ความปลอดภัย
            </Tab>
            <Tab
              fontSize={{ base: "xs", md: "sm" }}
              minW={{ base: "70px", md: "80px" }}
              px={{ base: 2, md: 3 }}
              py={{ base: 2, md: 1 }}
              isDisabled={true}
              opacity={0.4}
              cursor="not-allowed"
              _hover={{ opacity: 0.4 }}
              _focus={{ opacity: 0.4 }}
              _active={{ opacity: 0.4 }}
            >
              วัฒนธรรม
            </Tab>
            <Tab
              fontSize={{ base: "xs", md: "sm" }}
              minW={{ base: "70px", md: "100px" }}
              px={{ base: 1, md: 2 }}
              py={{ base: 2, md: 1 }}
              isDisabled={true}
              opacity={0.4}
              cursor="not-allowed"
              _hover={{ opacity: 0.4 }}
              _focus={{ opacity: 0.4 }}
              _active={{ opacity: 0.4 }}
            >
              โครงสร้างชุมชน
            </Tab>
          </TabList>

          <TabPanels width="100%">
            <TabPanel p={0} width="100%">
              <PopulationTab />
            </TabPanel>
            <TabPanel p={0} width="100%">
              <EconomicTab />
            </TabPanel>
            <TabPanel p={0} width="100%">
              <SafetyTab />
            </TabPanel>
            <TabPanel p={0} width="100%">
              <CultureTab />
            </TabPanel>
            <TabPanel p={0} width="100%">
              <CommunityTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
}
