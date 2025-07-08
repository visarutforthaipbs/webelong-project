import { useEffect, useState } from "react";
import { Box, Button, Text, VStack, HStack, SimpleGrid } from "@chakra-ui/react";
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
      {/* Controls - Mobile: Top center, Desktop: Top left */}
      <Box
        position="absolute"
        top={{ base: 2, md: 4 }}
        left={{ base: "50%", md: 4 }}
        transform={{ base: "translateX(-50%)", md: "none" }}
        zIndex={10}
        bg="white"
        p={{ base: 2, md: 4 }}
        borderRadius={{ base: "lg", md: "md" }}
        boxShadow="md"
        minW={{ base: "200px", md: "auto" }}
        border="1px solid"
        borderColor="gray.200"
      >
        <VStack align="center" spacing={{ base: 2, md: 3 }}>
          <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="bold" textAlign="center">
            สัดส่วนประชากร
          </Text>
          <HStack spacing={{ base: 1, md: 2 }} width="100%" justify="center">
            <Button
              size={{ base: "xs", md: "sm" }}
              colorScheme={viewMode === "nonThai" ? "red" : "gray"}
              onClick={() => setViewMode("nonThai")}
              fontSize={{ base: "2xs", md: "sm" }}
              px={{ base: 2, md: 3 }}
              flex={{ base: 1, md: "none" }}
            >
              {t("map.nonThaiPercentage")}
            </Button>
            <Button
              size={{ base: "xs", md: "sm" }}
              colorScheme={viewMode === "thai" ? "blue" : "gray"}
              onClick={() => setViewMode("thai")}
              fontSize={{ base: "2xs", md: "sm" }}
              px={{ base: 2, md: 3 }}
              flex={{ base: 1, md: "none" }}
            >
              {t("map.thaiPercentage")}
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Legend - Mobile: Bottom center, Desktop: Bottom left */}
      <Box
        position="absolute"
        bottom={{ base: 2, md: 4 }}
        left={{ base: "50%", md: 4 }}
        transform={{ base: "translateX(-50%)", md: "none" }}
        zIndex={10}
        bg="white"
        p={{ base: 3, md: 4 }}
        borderRadius={{ base: "lg", md: "md" }}
        boxShadow="md"
        minW={{ base: "280px", md: "200px" }}
        maxW={{ base: "320px", md: "auto" }}
        border="1px solid"
        borderColor="gray.200"
      >
        <VStack align="start" spacing={{ base: 2, md: 2 }}>
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" textAlign="center" width="100%">
            {viewMode === "nonThai"
              ? t("map.nonThaiPercentage")
              : t("map.thaiPercentage")}
          </Text>

          {viewMode === "nonThai" ? (
            <SimpleGrid columns={{ base: 2, md: 1 }} spacing={{ base: 1, md: 1 }} width="100%">
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#991B1B" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">≥ 50%</Text>
              </HStack>
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#DC2626" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">30-49%</Text>
              </HStack>
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#EF4444" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">20-29%</Text>
              </HStack>
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#F87171" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">10-19%</Text>
              </HStack>
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#FCA5A5" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">5-9%</Text>
              </HStack>
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#FED7D7" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">1-4%</Text>
              </HStack>
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#FEF2F2" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">{"< 1%"}</Text>
              </HStack>
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 2, md: 1 }} spacing={{ base: 1, md: 1 }} width="100%">
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#1E3A8A" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">≥ 95%</Text>
              </HStack>
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#1D4ED8" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">90-94%</Text>
              </HStack>
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#3B82F6" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">80-89%</Text>
              </HStack>
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#60A5FA" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">70-79%</Text>
              </HStack>
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#93C5FD" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">60-69%</Text>
              </HStack>
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#BFDBFE" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">50-59%</Text>
              </HStack>
              <HStack justify="flex-start">
                <Box w={{ base: 4, md: 4 }} h={{ base: 4, md: 4 }} bg="#DBEAFE" borderRadius="sm" />
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">{"< 50%"}</Text>
              </HStack>
            </SimpleGrid>
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
            touchAction: "manipulation",
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
                touchAction: "manipulation",
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
