import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Badge,
  Flex,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaHospital,
  FaShieldAlt,
  FaGlobeAsia,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaSpinner,
} from "react-icons/fa";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box bg="white" py={{ base: 8, md: 12 }}>
        <Container maxW="6xl">
          <VStack spacing={8}>
            {/* Hero Image */}
            <Image
              src="/assets/picture/hero-1.png"
              alt="Migrant Friendly Index Hero"
              w="100%"
              objectFit="contain"
            />

            {/* Hero Content */}
            <VStack spacing={8} textAlign="center">
              <Heading
                size="3xl"
                color="belongingBlue"
                fontWeight="bold"
                lineHeight="1.1"
              >
                จังหวัดของคุณเป็นมิตร
                <>
                  <br />
                </>
                กับประชากรข้ามชาติแค่ไหน?
              </Heading>

              <Text
                fontSize="xl"
                color="gray.700"
                maxW="4xl"
                lineHeight="1.8"
                fontWeight="medium"
              >
                "ดัชนีความเป็นมิตรต่อประชากรข้ามชาติ" กำลังจะเปิดตัวเร็วๆ นี้!
                ร่วมเป็นส่วนหนึ่งในการสร้างแผนที่สาธารณะที่จัดอันดับจังหวัดในประเทศไทย
                จากข้อมูลทางการและข้อมูลเชิงลึกจากภาคประชาสังคม
              </Text>

              <Badge
                bg="orange.100"
                color="orange.600"
                fontSize="lg"
                p={4}
                borderRadius="md"
                fontWeight="bold"
                boxShadow="md"
              >
                ขณะนี้โครงการอยู่ในระยะรวบรวมและประมวลผลข้อมูล (DATA COLLECTION
                & SCORING)
              </Badge>

              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  bg="hopeGreen"
                  color="white"
                  size="lg"
                  fontSize="lg"
                  py={7}
                  px={8}
                  _hover={{ bg: "green.600" }}
                  onClick={() => navigate("/methodology")}
                >
                  สำรวจระเบียบวิธีวิจัยของเรา
                </Button>
                <Button
                  bg="belongingBlue"
                  color="white"
                  size="lg"
                  fontSize="lg"
                  py={7}
                  px={8}
                  _hover={{ bg: "blue.600" }}
                  onClick={() => navigate("/survey")}
                >
                  ร่วมรายงานข้อมูล
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* The Problem Section */}
      <Box py={20} bg="white">
        <Container maxW="5xl">
          <VStack spacing={8} align="stretch">
            <Heading size="2xl" color="belongingBlue" textAlign="center">
              ทำให้สิ่งที่มองไม่เห็น...เป็นที่ประจักษ์
            </Heading>

            <Text fontSize="xl" lineHeight="1.6" color="gray.700">
              แรงงานข้ามชาติเป็นส่วนสำคัญต่อเศรษฐกิจและชุมชนของประเทศไทย
              แต่การเข้าถึงค่าจ้างที่เป็นธรรม สภาพการทำงานที่ปลอดภัย
              และบริการทางสังคมนั้นแตกต่างกันอย่างมากในแต่ละจังหวัด
            </Text>

            <Text fontSize="xl" lineHeight="1.6" color="gray.700">
              ข้อมูลเหล่านี้มักจะถูกซ่อนอยู่ในรายงานของรัฐบาล
              กระจัดกระจายอยู่ตามกระทรวงต่างๆ
              หรือเป็นที่รับรู้เฉพาะในชุมชนท้องถิ่นเท่านั้น
              หากไม่มีข้อมูลที่ชัดเจนและเปรียบเทียบได้
              ก็เป็นไปไม่ได้ที่จะระบุช่องว่าง สนับสนุนนโยบายที่ดีขึ้น
              หรือยกย่องจังหวัดที่เป็นผู้นำในการสร้างความเป็นมิตร
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* The Solution Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="5xl">
          <VStack spacing={8} align="stretch">
            <Heading size="2xl" color="belongingBlue" textAlign="center">
              เครื่องมือใหม่เพื่อความโปร่งใส
            </Heading>

            <Text fontSize="xl" lineHeight="1.6" color="gray.700">
              "ดัชนีความเป็นมิตรต่อแรงงานข้ามชาติ"
              เป็นเครื่องมือสาธารณะที่เรากำลังพัฒนาเพื่อวัดและจัดอันดับความ
              'เป็นมิตร' ของแต่ละจังหวัดในประเทศไทยต่อแรงงานข้ามชาติ
            </Text>

            <Text fontSize="xl" lineHeight="1.6" color="gray.700">
              เมื่อเปิดตัวแล้ว ผู้กำหนดนโยบาย องค์กรพัฒนาเอกชน นักวิจัย
              และสาธารณชน
              จะสามารถเห็นภาพที่ชัดเจนและขับเคลื่อนด้วยข้อมูลเกี่ยวกับความเป็นอยู่ที่ดีของแรงงานข้ามชาติทั่วประเทศ
              ดัชนีของเราผสมผสานสถิติทางการของรัฐบาลเข้ากับข้อมูลเชิงลึกที่รวบรวมจากนักข่าวพลเมือง
              (Citizen Journalists - CJs)
              เพื่อให้ได้ภาพที่สมบูรณ์และแม่นยำยิ่งขึ้น
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={20} bg="white">
        <Container maxW="6xl">
          <VStack spacing={12} align="stretch">
            <Box textAlign="center">
              <Heading size="2xl" color="belongingBlue" mb={4}>
                ขับเคลื่อนด้วยข้อมูล รับรองโดยชุมชน
              </Heading>
              <Text fontSize="xl" color="gray.700" lineHeight="1.6">
                การจัดอันดับของเราสร้างขึ้นบนระเบียบวิธีวิจัยที่โปร่งใส
                เราวัดผลจากสิ่งสำคัญด้วยการติดตาม 15
                ตัวชี้วัดหลักที่จัดกลุ่มเป็น 5 มิติสำคัญ:
              </Text>
              <Badge
                colorScheme="blue"
                fontSize="lg"
                p={4}
                borderRadius="md"
                mt={4}
              >
                ขณะนี้เรากำลังอยู่ในกระบวนการรวบรวมและตรวจสอบความถูกต้องของข้อมูลเหล่านี้จากแหล่งต่างๆ
                ทั้งข้อมูลทางการและข้อมูลภาคสนาม
              </Badge>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {/* Dimension 1 */}
              <Box
                bg="white"
                p={8}
                borderRadius="lg"
                border="2px solid"
                borderColor="gray.200"
                boxShadow="md"
                _hover={{
                  borderColor: "hopeGreen",
                  transform: "translateY(-4px)",
                  transition: "all 0.3s",
                }}
              >
                <Icon
                  as={FaMoneyBillWave}
                  fontSize="4xl"
                  color="hopeGreen"
                  mb={4}
                />
                <Heading size="lg" color="belongingBlue" mb={4}>
                  โอกาสทางเศรษฐกิจ
                </Heading>
                <VStack align="stretch" spacing={3}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                    สิ่งที่เราติดตาม:
                  </Text>
                  <Text fontSize="lg" color="gray.700">
                    ค่าจ้างเฉลี่ย, การปฏิบัติตามค่าแรงขั้นต่ำ,
                    อัตราแรงงานที่เข้าสู่ระบบประกันสังคม
                  </Text>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color="gray.800"
                    mt={2}
                  >
                    แหล่งข้อมูล:
                  </Text>
                  <Text fontSize="lg" color="gray.600">
                    กระทรวงแรงงาน (MOL), สำนักงานสถิติแห่งชาติ (NSO),
                    สำนักงานประกันสังคม (SSO)
                  </Text>
                </VStack>
              </Box>

              {/* Dimension 2 */}
              <Box
                bg="white"
                p={8}
                borderRadius="lg"
                border="2px solid"
                borderColor="gray.200"
                boxShadow="md"
                _hover={{
                  borderColor: "hopeGreen",
                  transform: "translateY(-4px)",
                  transition: "all 0.3s",
                }}
              >
                <Icon as={FaHospital} fontSize="4xl" color="hopeGreen" mb={4} />
                <Heading size="lg" color="belongingBlue" mb={4}>
                  การเข้าถึงบริการทางสังคม
                </Heading>
                <VStack align="stretch" spacing={3}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                    สิ่งที่เราติดตาม:
                  </Text>
                  <Text fontSize="lg" color="gray.700">
                    การเข้าถึงคลินิกที่เป็นมิตรต่อแรงงานข้ามชาติ,
                    อัตราการเข้าเรียนของเด็กแรงงานข้ามชาติ,
                    และข้อจำกัดในการเข้าถึงบริการที่รายงานโดยชุมชน
                  </Text>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color="gray.800"
                    mt={2}
                  >
                    แหล่งข้อมูล:
                  </Text>
                  <Text fontSize="lg" color="gray.600">
                    กระทรวงสาธารณสุข (MOPH), สพฐ. (OBEC)
                    และแบบสำรวจย่อยจากนักข่าวพลเมือง (CJ)
                  </Text>
                </VStack>
              </Box>

              {/* Dimension 3 */}
              <Box
                bg="white"
                p={8}
                borderRadius="lg"
                border="2px solid"
                borderColor="gray.200"
                boxShadow="md"
                _hover={{
                  borderColor: "hopeGreen",
                  transform: "translateY(-4px)",
                  transition: "all 0.3s",
                }}
              >
                <Icon
                  as={FaShieldAlt}
                  fontSize="4xl"
                  color="hopeGreen"
                  mb={4}
                />
                <Heading size="lg" color="belongingBlue" mb={4}>
                  ความปลอดภัยและการคุ้มครองทางกฎหมาย
                </Heading>
                <VStack align="stretch" spacing={3}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                    สิ่งที่เราติดตาม:
                  </Text>
                  <Text fontSize="lg" color="gray.700">
                    อัตราการเกิดอุบัติเหตุจากการทำงาน,
                    การเข้าถึงความช่วยเหลือทางกฎหมาย,
                    และรายงานที่ได้รับการยืนยันเกี่ยวกับการยึดหนังสือเดินทาง
                  </Text>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color="gray.800"
                    mt={2}
                  >
                    แหล่งข้อมูล:
                  </Text>
                  <Text fontSize="lg" color="gray.600">
                    SSO, บันทึกกรณีจากองค์กรพันธมิตร
                    และรายงานเหตุการณ์จากนักข่าวพลเมือง (CJ)
                  </Text>
                </VStack>
              </Box>

              {/* Dimension 4 */}
              <Box
                bg="white"
                p={8}
                borderRadius="lg"
                border="2px solid"
                borderColor="gray.200"
                boxShadow="md"
                _hover={{
                  borderColor: "hopeGreen",
                  transform: "translateY(-4px)",
                  transition: "all 0.3s",
                }}
              >
                <Icon
                  as={FaGlobeAsia}
                  fontSize="4xl"
                  color="hopeGreen"
                  mb={4}
                />
                <Heading size="lg" color="belongingBlue" mb={4}>
                  การรวมทางวัฒนธรรมและภาษา
                </Heading>
                <VStack align="stretch" spacing={3}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                    สิ่งที่เราติดตาม:
                  </Text>
                  <Text fontSize="lg" color="gray.700">
                    การมีป้ายหลายภาษาในสำนักงานบริการสาธารณะ,
                    สื่อภาษาแรงงานข้ามชาติในท้องถิ่น,
                    และกิจกรรมทางวัฒนธรรมของแรงงานข้ามชาติ
                  </Text>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color="gray.800"
                    mt={2}
                  >
                    แหล่งข้อมูล:
                  </Text>
                  <Text fontSize="lg" color="gray.600">
                    การตรวจสอบภาคสนามโดยนักข่าวพลเมือง (CJ), กระทรวงวัฒนธรรม
                    (MoC) และฐานข้อมูลสื่อของเรา
                  </Text>
                </VStack>
              </Box>

              {/* Dimension 5 */}
              <Box
                bg="white"
                p={8}
                borderRadius="lg"
                border="2px solid"
                borderColor="gray.200"
                boxShadow="md"
                _hover={{
                  borderColor: "hopeGreen",
                  transform: "translateY(-4px)",
                  transition: "all 0.3s",
                }}
              >
                <Icon as={FaUsers} fontSize="4xl" color="hopeGreen" mb={4} />
                <Heading size="lg" color="belongingBlue" mb={4}>
                  โครงสร้างพื้นฐานชุมชน
                </Heading>
                <VStack align="stretch" spacing={3}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                    สิ่งที่เราติดตาม:
                  </Text>
                  <Text fontSize="lg" color="gray.700">
                    จำนวนศูนย์ทรัพยากรสำหรับแรงงานข้ามชาติที่เปิดดำเนินการ,
                    กลุ่มรากหญ้าที่เคลื่อนไหว,
                    และที่ตั้งขององค์กรพัฒนาเอกชนที่ให้บริการ
                  </Text>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color="gray.800"
                    mt={2}
                  >
                    แหล่งข้อมูล:
                  </Text>
                  <Text fontSize="lg" color="gray.600">
                    พม. (MSDHS), ทะเบียนศูนย์ WeBelong
                    และไดเรกทอรีพันธมิตรองค์กรพัฒนาเอกชน
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Project Progress Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="5xl">
          <VStack spacing={12} align="stretch">
            <Box textAlign="center">
              <Heading size="2xl" color="belongingBlue" mb={4}>
                สถานะโครงการ: เรากำลังดำเนินการ
              </Heading>
              <Text fontSize="xl" color="gray.700" lineHeight="1.6">
                "ดัชนีความเป็นมิตรต่อแรงงานข้ามชาติ" ฉบับปี 2025
                กำลังอยู่ในระหว่างการพัฒนาอย่างเข้มข้น นี่คือความคืบหน้าของเรา:
              </Text>
            </Box>

            <VStack spacing={8} align="stretch">
              {/* Phase 1 */}
              <Flex
                bg="white"
                p={8}
                borderRadius="lg"
                border="2px solid"
                borderColor="hopeGreen"
                boxShadow="md"
                direction={{ base: "column", md: "row" }}
                gap={6}
              >
                <Flex align="center" justify="center" minW="80px">
                  <Icon as={FaCheckCircle} fontSize="5xl" color="hopeGreen" />
                </Flex>
                <VStack align="stretch" flex={1} spacing={3}>
                  <HStack>
                    <Heading size="lg" color="belongingBlue">
                      ระยะที่ 1: การวางแผนและออกแบบ
                    </Heading>
                    <Badge colorScheme="green" fontSize="lg" px={3} py={1}>
                      เสร็จสมบูรณ์
                    </Badge>
                  </HStack>
                  <Text fontSize="xl" color="gray.700" lineHeight="1.6">
                    เราได้สรุปกรอบการทำงาน ระเบียบวิธีวิจัย และตัวชี้วัดหลักทั้ง
                    15 ตัวเป็นที่เรียบร้อยแล้ว
                    รวมถึงออกแบบหน้าตาของแผนที่และระบบการจัดอันดับ
                  </Text>
                </VStack>
              </Flex>

              {/* Phase 2 */}
              <Flex
                bg="white"
                p={8}
                borderRadius="lg"
                border="2px solid"
                borderColor="belongingBlue"
                boxShadow="md"
                direction={{ base: "column", md: "row" }}
                gap={6}
              >
                <Flex align="center" justify="center" minW="80px">
                  <Box
                    as="span"
                    display="inline-block"
                    animation="spin 2s linear infinite"
                    sx={{
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  >
                    <Icon as={FaSpinner} fontSize="5xl" color="belongingBlue" />
                  </Box>
                </Flex>
                <VStack align="stretch" flex={1} spacing={3}>
                  <HStack>
                    <Heading size="lg" color="belongingBlue">
                      ระยะที่ 2: การรวบรวมข้อมูลและการให้คะแนน
                    </Heading>
                    <Badge colorScheme="blue" fontSize="lg" px={3} py={1}>
                      กำลังดำเนินการ
                    </Badge>
                  </HStack>
                  <Text fontSize="xl" color="gray.700" lineHeight="1.6">
                    นี่คือขั้นตอนที่เรากำลังทำอยู่!
                    ทีมงานของเรากำลังรวบรวมชุดข้อมูลที่ซับซ้อนจากแหล่งข้อมูลภาครัฐ
                    (NSO, MOL, SSO) และในขณะเดียวกัน เครือข่ายนักข่าวพลเมือง
                    (CJ) ของเรากำลังรวบรวมรายงานสำคัญภาคสนาม
                    นี่คือขั้นตอนที่ใช้เวลาและความละเอียดอ่อนมากที่สุด
                  </Text>
                </VStack>
              </Flex>

              {/* Phase 3 */}
              <Flex
                bg="white"
                p={8}
                borderRadius="lg"
                border="2px solid"
                borderColor="gray.300"
                boxShadow="md"
                direction={{ base: "column", md: "row" }}
                gap={6}
                opacity={0.7}
              >
                <Flex align="center" justify="center" minW="80px">
                  <Icon as={FaClock} fontSize="5xl" color="gray.400" />
                </Flex>
                <VStack align="stretch" flex={1} spacing={3}>
                  <HStack>
                    <Heading size="lg" color="gray.600">
                      ระยะที่ 3: แผนที่สาธารณะและการเปิดตัว
                    </Heading>
                    <Badge colorScheme="gray" fontSize="lg" px={3} py={1}>
                      ยังไม่เริ่ม
                    </Badge>
                  </HStack>
                  <Text fontSize="xl" color="gray.600" lineHeight="1.6">
                    หลังจากข้อมูลทั้งหมดถูกรวบรวมและประมวลผลเป็นคะแนนแล้ว
                    เราจะนำข้อมูลขึ้นสู่แผนที่สาธารณะ แปลเนื้อหาเป็นภาษาต่างๆ
                    (ไทย พม่า เขมร ลาว) และเปิดตัวให้ทุกคนได้ใช้งาน โปรดติดตาม!
                  </Text>
                </VStack>
              </Flex>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box py={20} bg="white">
        <Container maxW="5xl">
          <VStack spacing={12} align="stretch">
            <Box textAlign="center">
              <Heading size="2xl" color="belongingBlue" mb={4}>
                เราต้องการข้อมูลเชิงลึกจากคุณ!
              </Heading>
              <Text
                fontSize="xl"
                color="gray.700"
                lineHeight="1.6"
                maxW="3xl"
                mx="auto"
              >
                ดัชนีนี้จะสมบูรณ์ไม่ได้หากขาดข้อมูลจากภาคสนาม
                เราต้องการให้ดัชนีนี้สะท้อนความเป็นจริงมากที่สุด
                และคุณสามารถช่วยเราได้
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {/* CTA Box 1 */}
              <Box
                bg="linear-gradient(135deg, rgba(80, 227, 196, 0.1) 0%, rgba(80, 227, 196, 0.05) 100%)"
                p={10}
                borderRadius="lg"
                border="2px solid"
                borderColor="hopeGreen"
                boxShadow="lg"
              >
                <Heading size="xl" color="hopeGreen" mb={6}>
                  ร่วมเป็นนักข่าวพลเมือง (CJ)
                </Heading>
                <Text fontSize="xl" color="gray.700" lineHeight="1.6" mb={6}>
                  คุณอยู่ในพื้นที่หรือไม่?
                  คุณพบเห็นปัญหาหรือตัวอย่างที่ดีเกี่ยวกับการจ้างงาน
                  การเข้าถึงบริการ หรือการใช้ชีวิตของแรงงานข้ามชาติหรือไม่?
                  ร่วมเป็นเครือข่ายนักข่าวพลเมืองกับเราเพื่อส่งข้อมูลภาคสนาม
                </Text>
                <Button
                  bg="hopeGreen"
                  color="white"
                  size="lg"
                  fontSize="lg"
                  py={7}
                  w="full"
                  _hover={{ bg: "green.600" }}
                  onClick={() => navigate("/survey")}
                >
                  เริ่มรายงานข้อมูล
                </Button>
              </Box>

              {/* CTA Box 2 */}
              <Box
                bg="linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(74, 144, 226, 0.05) 100%)"
                p={10}
                borderRadius="lg"
                border="2px solid"
                borderColor="belongingBlue"
                boxShadow="lg"
              >
                <Heading size="xl" color="belongingBlue" mb={6}>
                  ร่วมเป็นพันธมิตรกับเรา
                </Heading>
                <Text fontSize="xl" color="gray.700" lineHeight="1.6" mb={6}>
                  คุณเป็นองค์กรพัฒนาเอกชน นักวิจัย ผู้นำชุมชน
                  หรือนักข่าวที่ทำงานเกี่ยวกับประเด็นแรงงานข้ามชาติหรือไม่?
                  เราต้องการร่วมมือกับคุณเพื่อแบ่งปันข้อมูลและทำให้ดัชนีนี้มีประสิทธิภาพสูงสุด
                </Text>
                <Button
                  bg="belongingBlue"
                  color="white"
                  size="lg"
                  fontSize="lg"
                  py={7}
                  w="full"
                  _hover={{ bg: "blue.600" }}
                  as="a"
                  href="https://www.facebook.com/profile.php?id=100092195477858"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ติดต่อทีมงานของเรา
                </Button>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
