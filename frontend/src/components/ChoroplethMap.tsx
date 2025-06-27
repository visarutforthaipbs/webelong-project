import { useEffect, useState } from "react";
import { Box, Button, Text, VStack, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface Province {
  type: string;
  properties: {
    pro_th: string;
    pro_en: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

interface PopulationData {
  [provinceName: string]: {
    thai: number;
    migrant: number;
    stateless: number;
    refugee: number;
    total: number;
    nonThaiPercentage: number;
    thaiPercentage: number;
  };
}

interface ChoroplethMapProps {
  onProvinceClick: (provinceName: string) => void;
  selectedProvince?: string;
}

export default function ChoroplethMap({
  onProvinceClick,
  selectedProvince,
}: ChoroplethMapProps) {
  const { t } = useTranslation();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [populationData, setPopulationData] = useState<PopulationData>({});
  const [bounds, setBounds] = useState<{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"nonThai" | "thai">("nonThai");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all data files
        const [geoData, thaiData, migrantData, statelessData, refugeeData] =
          await Promise.all([
            fetch("/data/provinces.geojson").then((res) => res.json()),
            fetch("/data/thai_pop_province.json").then((res) => res.json()),
            fetch("/data/migrant_pop_province.json").then((res) => res.json()),
            fetch("/data/stateless_pop_province.json").then((res) =>
              res.json()
            ),
            fetch("/data/refugee_pop_province.json").then((res) => res.json()),
          ]);

        setProvinces(geoData.features);

        // Process population data
        const processedData: PopulationData = {};

        // Create stateless and refugee lookup maps
        const statelessMap = new Map();
        statelessData.forEach(
          (item: {
            จังหวัด: string;
            ผลรวมประชากรที่มิใช่สัญชาติไทย: number;
          }) => {
            statelessMap.set(
              item.จังหวัด,
              item.ผลรวมประชากรที่มิใช่สัญชาติไทย || 0
            );
          }
        );

        const refugeeMap = new Map();
        refugeeData.forEach(
          (item: { จังหวัด: string; ยอดรวม: string | number }) => {
            const total =
              typeof item.ยอดรวม === "string"
                ? parseInt(item.ยอดรวม.replace(/,/g, "")) || 0
                : item.ยอดรวม || 0;
            refugeeMap.set(item.จังหวัด, total);
          }
        );

        // Process each province
        Object.keys(thaiData).forEach((provinceName) => {
          const thai =
            parseInt(thaiData[provinceName].ประชากรรวม.replace(/,/g, "")) || 0;
          const migrant = migrantData[provinceName]
            ? parseInt(
                migrantData[provinceName]["รวมทั้งสิ้น (คน)"].replace(/,/g, "")
              ) || 0
            : 0;
          const stateless = statelessMap.get(provinceName) || 0;
          const refugee = refugeeMap.get(provinceName) || 0;

          const total = thai + migrant + stateless + refugee;
          const nonThaiTotal = migrant + stateless + refugee;

          processedData[provinceName] = {
            thai,
            migrant,
            stateless,
            refugee,
            total,
            nonThaiPercentage: total > 0 ? (nonThaiTotal / total) * 100 : 0,
            thaiPercentage: total > 0 ? (thai / total) * 100 : 0,
          };
        });

        setPopulationData(processedData);

        // Calculate bounds for all provinces
        let minX = Infinity,
          maxX = -Infinity,
          minY = Infinity,
          maxY = -Infinity;

        geoData.features.forEach((feature: Province) => {
          const coords = feature.geometry.coordinates;
          const flatCoords = flattenCoordinates(coords);

          flatCoords.forEach(([x, y]) => {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          });
        });

        setBounds({ minX, maxX, minY, maxY });
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const flattenCoordinates = (
    coords: number[][][] | number[][][][]
  ): number[][] => {
    const result: number[][] = [];

    const processArray = (arr: number[][][] | number[][][][]): void => {
      if (Array.isArray(arr[0]) && Array.isArray(arr[0][0])) {
        if (Array.isArray(arr[0][0][0])) {
          // MultiPolygon
          (arr as number[][][][]).forEach((polygon: number[][][]) => {
            polygon.forEach((ring: number[][]) => {
              ring.forEach((coord: number[]) => {
                result.push(coord);
              });
            });
          });
        } else {
          // Polygon
          (arr as number[][][]).forEach((ring: number[][]) => {
            ring.forEach((coord: number[]) => {
              result.push(coord);
            });
          });
        }
      }
    };

    processArray(coords);
    return result;
  };

  const coordinatesToPath = (coords: number[][][] | number[][][][]): string => {
    if (!bounds) return "";

    const { minX, maxX, minY, maxY } = bounds;
    const width = 1000;
    const height = 800;

    const scaleX = width / (maxX - minX);
    const scaleY = height / (maxY - minY);
    const scale = Math.min(scaleX, scaleY) * 0.85;

    const offsetX = (width - (maxX - minX) * scale) / 2;
    const offsetY = (height - (maxY - minY) * scale) / 2;

    let pathData = "";

    const processPolygon = (polygon: number[][][]) => {
      polygon.forEach((ring) => {
        ring.forEach((coord, coordIndex) => {
          const x = (coord[0] - minX) * scale + offsetX;
          const y = height - ((coord[1] - minY) * scale + offsetY);

          if (coordIndex === 0) {
            pathData += `M ${x} ${y} `;
          } else {
            pathData += `L ${x} ${y} `;
          }
        });
        pathData += "Z ";
      });
    };

    if (Array.isArray(coords[0][0][0])) {
      (coords as number[][][][]).forEach((polygon) => {
        processPolygon(polygon);
      });
    } else {
      processPolygon(coords as number[][][]);
    }

    return pathData;
  };

  const getProvinceColor = (provinceName: string): string => {
    const data = populationData[provinceName];
    if (!data) return "#E2E8F0"; // Default gray

    const percentage =
      viewMode === "nonThai" ? data.nonThaiPercentage : data.thaiPercentage;

    if (viewMode === "nonThai") {
      // Red scale for Non-Thai
      if (percentage >= 50) return "#991B1B"; // Very high
      if (percentage >= 30) return "#DC2626"; // High
      if (percentage >= 20) return "#EF4444"; // Medium-high
      if (percentage >= 10) return "#F87171"; // Medium
      if (percentage >= 5) return "#FCA5A5"; // Low-medium
      if (percentage >= 1) return "#FED7D7"; // Low
      return "#FEF2F2"; // Very low
    } else {
      // Blue scale for Thai
      if (percentage >= 95) return "#1E3A8A"; // Very high
      if (percentage >= 90) return "#1D4ED8"; // High
      if (percentage >= 80) return "#3B82F6"; // Medium-high
      if (percentage >= 70) return "#60A5FA"; // Medium
      if (percentage >= 60) return "#93C5FD"; // Low-medium
      if (percentage >= 50) return "#BFDBFE"; // Low
      return "#DBEAFE"; // Very low
    }
  };

  if (loading || !bounds || provinces.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        bg="gray.50"
      >
        กำลังโหลดแผนที่...
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      height="100%"
      bg="gray.50"
      position="relative"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* Controls */}
      <Box
        position="absolute"
        top={4}
        left={4}
        zIndex={10}
        bg="white"
        p={4}
        borderRadius="md"
        boxShadow="md"
      >
        <VStack align="start" spacing={3}>
          <Text fontSize="lg" fontWeight="bold">
            สัดส่วนประชากร
          </Text>
          <HStack spacing={2}>
            <Button
              size="sm"
              colorScheme={viewMode === "nonThai" ? "red" : "gray"}
              onClick={() => setViewMode("nonThai")}
            >
              {t("map.nonThaiPercentage")}
            </Button>
            <Button
              size="sm"
              colorScheme={viewMode === "thai" ? "blue" : "gray"}
              onClick={() => setViewMode("thai")}
            >
              {t("map.thaiPercentage")}
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Legend */}
      <Box
        position="absolute"
        bottom={4}
        left={4}
        zIndex={10}
        bg="white"
        p={4}
        borderRadius="md"
        boxShadow="md"
        minW="200px"
      >
        <VStack align="start" spacing={2}>
          <Text fontSize="md" fontWeight="bold">
            {viewMode === "nonThai"
              ? t("map.nonThaiPercentage")
              : t("map.thaiPercentage")}
          </Text>

          {viewMode === "nonThai" ? (
            <VStack align="start" spacing={1}>
              <HStack>
                <Box w={4} h={4} bg="#991B1B" borderRadius="sm" />
                <Text fontSize="sm">≥ 50%</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#DC2626" borderRadius="sm" />
                <Text fontSize="sm">30-49%</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#EF4444" borderRadius="sm" />
                <Text fontSize="sm">20-29%</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#F87171" borderRadius="sm" />
                <Text fontSize="sm">10-19%</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#FCA5A5" borderRadius="sm" />
                <Text fontSize="sm">5-9%</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#FED7D7" borderRadius="sm" />
                <Text fontSize="sm">1-4%</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#FEF2F2" borderRadius="sm" />
                <Text fontSize="sm">{"< 1%"}</Text>
              </HStack>
            </VStack>
          ) : (
            <VStack align="start" spacing={1}>
              <HStack>
                <Box w={4} h={4} bg="#1E3A8A" borderRadius="sm" />
                <Text fontSize="sm">≥ 95%</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#1D4ED8" borderRadius="sm" />
                <Text fontSize="sm">90-94%</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#3B82F6" borderRadius="sm" />
                <Text fontSize="sm">80-89%</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#60A5FA" borderRadius="sm" />
                <Text fontSize="sm">70-79%</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#93C5FD" borderRadius="sm" />
                <Text fontSize="sm">60-69%</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#BFDBFE" borderRadius="sm" />
                <Text fontSize="sm">50-59%</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="#DBEAFE" borderRadius="sm" />
                <Text fontSize="sm">{"< 50%"}</Text>
              </HStack>
            </VStack>
          )}
        </VStack>
      </Box>

      {/* Map */}
      <Box
        flex="1"
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/image/pattern.svg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.12,
          zIndex: 1,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 800"
          preserveAspectRatio="xMidYMid meet"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            cursor: "pointer",
            position: "relative",
            zIndex: 2,
          }}
        >
          {provinces.map((province, index) => (
            <path
              key={index}
              d={coordinatesToPath(province.geometry.coordinates)}
              fill={
                selectedProvince === province.properties.pro_th
                  ? "#50E3C2"
                  : getProvinceColor(province.properties.pro_th)
              }
              stroke="#ffffff"
              strokeWidth="0.5"
              opacity="0.9"
              style={{
                cursor: "pointer",
                filter:
                  selectedProvince === province.properties.pro_th
                    ? "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"
                    : "none",
              }}
              onClick={() => onProvinceClick(province.properties.pro_th)}
            >
              <title>{province.properties.pro_th}</title>
            </path>
          ))}
        </svg>
      </Box>
    </Box>
  );
}
