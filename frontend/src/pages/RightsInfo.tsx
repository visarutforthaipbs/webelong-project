import {
  Heading,
  Text,
  Box,
  Flex,
  List,
  ListItem,
  Button,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";
import {
  FaShieldAlt,
  FaFileContract,
  FaUserShield,
  FaBan,
  FaBullhorn,
  FaHandsHelping,
  FaLifeRing,
} from "react-icons/fa";

// Reusable RightsCard component
function RightsCard({
  icon,
  title,
  bullets,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  bullets: string[];
  link: { href: string; label: string };
}) {
  return (
    <Box
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      p={6}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      minH="100%"
    >
      <Flex align="center" mb={2}>
        <Box as="span" fontSize="2xl" mr={2}>
          {icon}
        </Box>
        <Heading size="md">{title}</Heading>
      </Flex>
      <List spacing={1} mb={3} pl={1}>
        {bullets.map((b, i) => (
          <ListItem key={i}>• {b}</ListItem>
        ))}
      </List>
      <Button
        as={Link}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        colorScheme="blue"
        size="sm"
        mt="auto"
      >
        {link.label}
      </Button>
    </Box>
  );
}

export default function RightsInfo() {
  // Rights cards data
  const rightsCards = [
    {
      icon: <FaShieldAlt />,
      title: "สิทธิพื้นฐานของแรงงานข้ามชาติ",
      bullets: [
        "ได้รับค่าจ้างขั้นต่ำ",
        "ชั่วโมงทำงานไม่เกินวันละ 8 ชั่วโมง",
        "วันหยุดประจำสัปดาห์",
        "สถานที่ทำงานปลอดภัย",
      ],
      link: {
        href: "https://idwfed.org/news/new-legal-protections-for-dws-in-thailand-a-milestone-with-more-struggles-ahead",
        label: "รายละเอียดเพิ่มเติม",
      },
    },
    {
      icon: <FaFileContract />,
      title: "สัญญาและเอกสารสำคัญ",
      bullets: [
        "มีสัญญาจ้างงานเป็นลายลักษณ์อักษร",
        "ได้รับสำเนาสัญญา",
        "เก็บบัตรประชาชน/พาสปอร์ตไว้กับตนเอง",
      ],
      link: {
        href: "https://www.mol.go.th/employee/foreign",
        label: "รายละเอียดเพิ่มเติม",
      },
    },
    {
      icon: <FaUserShield />,
      title: "ประกันสังคมและสวัสดิการ",
      bullets: [
        "สิทธิประกันสังคม",
        "สิทธิรักษาพยาบาล",
        "สิทธิเงินทดแทนกรณีเจ็บป่วย/คลอดบุตร",
      ],
      link: {
        href: "https://www.sso.go.th/wpr/main",
        label: "รายละเอียดเพิ่มเติม",
      },
    },
    {
      icon: <FaBan />,
      title: "อาชีพต้องห้าม",
      bullets: [
        "แรงงานข้ามชาติห้ามทำบางอาชีพ",
        "ตรวจสอบอาชีพต้องห้ามก่อนสมัครงาน",
      ],
      link: {
        href: "https://www.doe.go.th/prd/assets/upload/files/alien_th-20190301155337_.pdf",
        label: "รายละเอียดเพิ่มเติม",
      },
    },
    {
      icon: <FaBullhorn />,
      title: "ระบบร้องเรียน",
      bullets: [
        "แจ้งปัญหาผ่านสายด่วน 1506",
        "ร้องเรียนที่สำนักงานแรงงานจังหวัด",
        "ใช้แพลตฟอร์มออนไลน์",
      ],
      link: {
        href: "https://www.labour.go.th/index.php/complaint",
        label: "รายละเอียดเพิ่มเติม",
      },
    },
    {
      icon: <FaHandsHelping />,
      title: "การป้องกันการค้ามนุษย์",
      bullets: [
        "ห้ามนายจ้างยึดเอกสาร",
        "ห้ามบังคับใช้แรงงาน",
        "แจ้งเหตุสงสัยการค้ามนุษย์ทันที",
      ],
      link: {
        href: "https://www.ilo.org/global/topics/forced-labour/lang--en/index.htm",
        label: "รายละเอียดเพิ่มเติม",
      },
    },
    {
      icon: <FaLifeRing />,
      title: "องค์กรช่วยเหลือแรงงานข้ามชาติ",
      bullets: [
        "ติดต่อองค์กร NGO ในพื้นที่",
        "ขอคำปรึกษาจากศูนย์แรงงาน",
        "เข้าร่วมกิจกรรมอบรม/ให้ความรู้",
      ],
      link: {
        href: "https://www.humanrights.asia/countries/thailand/",
        label: "รายละเอียดเพิ่มเติม",
      },
    },
  ];

  return (
    <Box maxW="4xl" mx="auto" px={{ base: 2, md: 6 }} py={8}>
      <Heading size="lg" fontWeight="bold" textAlign="center" mb={2}>
        ข้อมูลสิทธิแรงงาน
      </Heading>
      <Text textAlign="center" mb={8} color="gray.700" fontSize="lg">
        ข้อมูลพื้นฐานเกี่ยวกับสิทธิของแรงงานข้ามชาติในประเทศไทย
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        {rightsCards.map((card, idx) => (
          <RightsCard key={idx} {...card} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
