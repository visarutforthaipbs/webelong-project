import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Box, Heading, Text } from "@chakra-ui/react";

interface PopulationPieChartProps {
  thaiPopulation: number;
  migrantPopulation: number;
  statelessPopulation: number;
  refugeePopulation: number;
  studentPopulation: number;
  provinceName: string;
}

const COLORS = {
  thai: "#4A90E2", // belongingBlue
  migrant: "#50E3C2", // hopeGreen
  stateless: "#FF7F7F", // Light red for stateless
  refugee: "#9B59B6", // Purple for refugees
  student: "#E67E22", // Dark orange for students
};

export default function PopulationPieChart({
  thaiPopulation,
  migrantPopulation,
  statelessPopulation,
  refugeePopulation,
  studentPopulation,
  provinceName,
}: PopulationPieChartProps) {
  const total =
    thaiPopulation +
    migrantPopulation +
    statelessPopulation +
    refugeePopulation +
    studentPopulation;

  if (total === 0) {
    return (
      <Box textAlign="center" p={4}>
        <Text color="gray.500">ไม่มีข้อมูลประชากร</Text>
      </Box>
    );
  }

  const calculatePercentage = (value: number, total: number): string => {
    if (total === 0 || !isFinite(value) || !isFinite(total)) {
      return "0.0";
    }
    const percentage = (value / total) * 100;
    return isFinite(percentage) ? percentage.toFixed(1) : "0.0";
  };

  const data = [
    {
      name: "ประชากรไทย",
      value: thaiPopulation,
      percentage: calculatePercentage(thaiPopulation, total),
    },
    {
      name: "แรงงานข้ามชาติ",
      value: migrantPopulation,
      percentage: calculatePercentage(migrantPopulation, total),
    },
    {
      name: "คนไร้รัฐไร้สัญชาติ",
      value: statelessPopulation,
      percentage: calculatePercentage(statelessPopulation, total),
    },
    {
      name: "ผู้ลี้ภัย",
      value: refugeePopulation,
      percentage: calculatePercentage(refugeePopulation, total),
    },
    {
      name: "ผู้เรียนที่ไม่มีหลักฐานทางทะเบียนราษฎร",
      value: studentPopulation,
      percentage: calculatePercentage(studentPopulation, total),
    },
  ].filter((item) => item.value > 0);

  const formatNumber = (num: number) => {
    return num.toLocaleString("th-TH");
  };

  const renderCustomTooltip = (props: {
    active?: boolean;
    payload?: Array<{
      payload: { name: string; value: number; percentage: string };
    }>;
  }) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0].payload;
      return (
        <Box
          bg="white"
          p={3}
          borderRadius="md"
          boxShadow="md"
          border="1px"
          borderColor="gray.200"
        >
          <Text fontWeight="bold" color="deepNavy">
            {data.name}
          </Text>
          <Text fontSize="sm">จำนวน: {formatNumber(data.value)} คน</Text>
          <Text fontSize="sm">เปอร์เซ็นต์: {data.percentage}%</Text>
        </Box>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: any) => {
    return `${entry.percentage}%`;
  };

  return (
    <Box width="100%">
      <Heading
        size={{ base: "sm", md: "md" }}
        color="deepNavy"
        mb={{ base: 2, md: 4 }}
        textAlign="center"
      >
        สัดส่วนประชากร - {provinceName}
      </Heading>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            stroke="#fff"
            strokeWidth={2}
          >
            {data.map((entry, index) => {
              let color = COLORS.thai;
              if (entry.name === "แรงงานข้ามชาติ") color = COLORS.migrant;
              if (entry.name === "คนไร้รัฐไร้สัญชาติ") color = COLORS.stateless;
              if (entry.name === "ผู้ลี้ภัย") color = COLORS.refugee;
              if (entry.name === "ผู้เรียนที่ไม่มีหลักฐานทางทะเบียนราษฎร")
                color = COLORS.student;
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>
          <Tooltip content={renderCustomTooltip} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color, fontWeight: "bold" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
