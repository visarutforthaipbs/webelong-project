import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

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

interface StaticProvinceMapProps {
  onProvinceClick: (provinceName: string) => void;
  selectedProvince?: string;
}

export default function StaticProvinceMap({
  onProvinceClick,
  selectedProvince,
}: StaticProvinceMapProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [bounds, setBounds] = useState<{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    fetch("/data/provinces.geojson")
      .then((response) => response.json())
      .then((data) => {
        setProvinces(data.features);

        // Calculate bounds for all provinces
        let minX = Infinity,
          maxX = -Infinity,
          minY = Infinity,
          maxY = -Infinity;

        data.features.forEach((feature: Province) => {
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
      })
      .catch((error) => {
        console.error("Error loading GeoJSON data:", error);
      });
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
    const scale = Math.min(scaleX, scaleY) * 0.85; // Add padding by scaling down to 85%

    const offsetX = (width - (maxX - minX) * scale) / 2;
    const offsetY = (height - (maxY - minY) * scale) / 2;

    let pathData = "";

    const processPolygon = (polygon: number[][][]) => {
      polygon.forEach((ring) => {
        ring.forEach((coord, coordIndex) => {
          const x = (coord[0] - minX) * scale + offsetX;
          const y = height - ((coord[1] - minY) * scale + offsetY); // Flip Y axis

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
      // MultiPolygon
      (coords as number[][][][]).forEach((polygon) => {
        processPolygon(polygon);
      });
    } else {
      // Polygon
      processPolygon(coords as number[][][]);
    }

    return pathData;
  };

  const getProvinceCenter = (
    coords: number[][][] | number[][][][]
  ): { x: number; y: number } => {
    if (!bounds) return { x: 0, y: 0 };

    const { minX, maxX, minY, maxY } = bounds;
    const width = 1000;
    const height = 800;

    const scaleX = width / (maxX - minX);
    const scaleY = height / (maxY - minY);
    const scale = Math.min(scaleX, scaleY) * 0.85; // Add padding by scaling down to 85%

    const offsetX = (width - (maxX - minX) * scale) / 2;
    const offsetY = (height - (maxY - minY) * scale) / 2;

    // Get all coordinates
    const allCoords: number[][] = [];
    const flatCoords = flattenCoordinates(coords);
    allCoords.push(...flatCoords);

    // Calculate centroid
    let sumX = 0;
    let sumY = 0;
    allCoords.forEach(([lng, lat]) => {
      sumX += (lng - minX) * scale + offsetX;
      sumY += height - ((lat - minY) * scale + offsetY);
    });

    return {
      x: sumX / allCoords.length,
      y: sumY / allCoords.length,
    };
  };

  if (!bounds || provinces.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        bg="gray.50"
      >
        กำลังโหลดแผนที่...
      </Box>
    );
  }

  return (
    <Box
      height="100vh"
      width="100%"
      bg="gray.50"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
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
                : "#519ACB"
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
            onMouseEnter={(e) => {
              e.currentTarget.setAttribute("opacity", "1");
              e.currentTarget.setAttribute("stroke-width", "1");
              e.currentTarget.style.filter =
                "drop-shadow(0px 2px 6px rgba(0,0,0,0.15))";

              const center = getProvinceCenter(province.geometry.coordinates);
              setHoveredProvince({
                name: province.properties.pro_th,
                x: center.x,
                y: center.y,
              });
            }}
            onMouseLeave={(e) => {
              const isSelected =
                selectedProvince === province.properties.pro_th;
              e.currentTarget.setAttribute("opacity", "0.9");
              e.currentTarget.setAttribute("stroke-width", "0.5");
              e.currentTarget.style.filter = isSelected
                ? "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"
                : "none";

              setHoveredProvince(null);
            }}
            onClick={() => onProvinceClick(province.properties.pro_th)}
          >
            <title>{province.properties.pro_th}</title>
          </path>
        ))}

        {/* Hover Label */}
        {hoveredProvince && (
          <g>
            {/* Background for the label */}
            <rect
              x={hoveredProvince.x - 40}
              y={hoveredProvince.y - 25}
              width="80"
              height="30"
              rx="6"
              fill="rgba(0, 0, 0, 0.8)"
              stroke="#50E3C2"
              strokeWidth="1"
            />
            {/* Province name text */}
            <text
              x={hoveredProvince.x}
              y={hoveredProvince.y - 8}
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="bold"
              fontFamily="Noto Sans Thai, sans-serif"
            >
              {hoveredProvince.name}
            </text>
          </g>
        )}
      </svg>
    </Box>
  );
}
