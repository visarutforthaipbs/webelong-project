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
  provinceName: string;
}

const COLORS = {
  thai: "#4A90E2", // belongingBlue
  migrant: "#50E3C2", // hopeGreen
  stateless: "#FF7F7F", // Light red for stateless
  refugee: "#9B59B6", // Purple for refugees
};

export default function PopulationPieChart({
  thaiPopulation,
  migrantPopulation,
  statelessPopulation,
  refugeePopulation,
  provinceName,
}: PopulationPieChartProps) {
  const total =
    thaiPopulation +
    migrantPopulation +
    statelessPopulation +
    refugeePopulation;

  if (total === 0) {
    return (
      <Box textAlign="center" p={4}>
        <Text color="gray.500">ไม่มีข้อมูลประชากร</Text>
      </Box>
    );
  }

  const data = [
    {
      name: "ประชากรไทย",
      value: thaiPopulation,
      percentage: ((thaiPopulation / total) * 100).toFixed(1),
    },
    {
      name: "แรงงานข้ามชาติ",
      value: migrantPopulation,
      percentage: ((migrantPopulation / total) * 100).toFixed(1),
    },
    {
      name: "คนไร้รัฐไร้สัญชาติ",
      value: statelessPopulation,
      percentage: ((statelessPopulation / total) * 100).toFixed(1),
    },
    {
      name: "ผู้ลี้ภัย",
      value: refugeePopulation,
      percentage: ((refugeePopulation / total) * 100).toFixed(1),
    },
  ].filter((item) => item.value > 0);

  const formatNumber = (num: number) => {
    return num.toLocaleString("th-TH");
  };

  const renderCustomTooltip = (props: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; percentage: string } }> }) => {
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

      {/* Summary Stats */}
      <Box mt={4} p={3} bg="gray.50" borderRadius="md">
        <Text fontSize="sm" color="gray.700" textAlign="center" mb={2}>
          <strong>ประชากรรวม:</strong> {formatNumber(total)} คน
        </Text>
        <Box display="flex" flexDirection="column" gap={1} fontSize="xs">
          {data.map((item) => {
            let color = "belongingBlue";
            if (item.name === "แรงงานข้ามชาติ") color = "hopeGreen";
            if (item.name === "คนไร้รัฐไร้สัญชาติ") color = "#FF7F7F";
            if (item.name === "ผู้ลี้ภัย") color = "#9B59B6";
            return (
              <Text key={item.name} color={color} textAlign="center">
                {item.name}: {formatNumber(item.value)} ({item.percentage}%)
              </Text>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
