import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Link,
  Spinner,
  Alert,
  AlertIcon,
  Icon,
  IconButton,
  Collapse,
  useDisclosure,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  Card,
  CardBody,
  Button,
  Heading,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ExternalLinkIcon, ViewIcon } from "@chakra-ui/icons";
import { apiUrl } from "../config/api";

interface NotionPage {
  id: string;
  properties: {
    "Title/ชื่อเรื่อง/ชื่องาน": {
      title: Array<{ plain_text: string }>;
    };
    "Brief/โปรย": {
      rich_text: Array<{ plain_text: string }>;
    };
    Province: {
      select: { name: string; color: string } | null;
    };
    Tags: {
      multi_select: Array<{ name: string; color: string }>;
    };
    Type: {
      select: { name: string; color: string } | null;
    };
    "Link/บทความ/YouTube": {
      url: string | null;
    };
    Status: {
      status: { name: string; color: string };
    };
  };
}

interface NotionResponse {
  results: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
}

interface NotionContentSidebarProps {
  selectedProvince: string | null;
  onClose: () => void;
}

const NotionContentSidebar: React.FC<NotionContentSidebarProps> = ({
  selectedProvince,
  onClose,
}) => {
  const [content, setContent] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    isOpen,
    onOpen,
    onClose: collapseClose,
  } = useDisclosure({ defaultIsOpen: true });

  const fetchNotionContent = async (provinceName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl("/api/notion-content"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          province: provinceName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch content");
      }

      const data: NotionResponse = await response.json();
      setContent(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProvince) {
      fetchNotionContent(selectedProvince);
      onOpen();
    }
  }, [selectedProvince, onOpen]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "คลิป":
        return <ViewIcon />;
      default:
        return <ExternalLinkIcon />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "คลิป":
        return "green";
      default:
        return "blue";
    }
  };

  const getTagColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "blue",
      green: "green",
      yellow: "yellow",
      red: "red",
      purple: "purple",
      pink: "pink",
      orange: "orange",
      brown: "orange",
      gray: "gray",
      default: "gray",
    };
    return colorMap[color] || "gray";
  };

  if (!selectedProvince) {
    return null;
  }

  return (
    <Box
      position="fixed"
      right={0}
      top={0}
      h="100vh"
      w={isOpen ? { base: "100vw", md: "400px", lg: "450px" } : "0px"}
      bg="white"
      borderLeft={{ base: "none", md: "1px solid" }}
      borderColor="gray.200"
      boxShadow="xl"
      zIndex={1000}
      transition="width 0.3s ease"
      overflow="hidden"
    >
      <Box h="full" overflow="hidden">
        {/* Header */}
        <Box p={4} borderBottom="1px solid" borderColor="gray.200" bg="gray.50">
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading size="md" color="gray.700">
                เนื้อหาจาก {selectedProvince}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                โดย Locals Thai PBS
              </Text>
            </VStack>
            <HStack>
              <IconButton
                aria-label="Toggle sidebar"
                icon={<ChevronLeftIcon />}
                size="sm"
                variant="ghost"
                onClick={isOpen ? collapseClose : onOpen}
              />
              <IconButton
                aria-label="Close sidebar"
                icon={<ChevronLeftIcon />}
                size="sm"
                variant="ghost"
                onClick={onClose}
              />
            </HStack>
          </HStack>
        </Box>

        {/* Content */}
        <Collapse in={isOpen} animateOpacity>
          <Box h="calc(100vh - 80px)" overflowY="auto" p={4}>
            {loading && (
              <VStack spacing={4} py={8}>
                <Spinner size="lg" color="blue.500" />
                <Text color="gray.500">กำลังโหลดเนื้อหา...</Text>
              </VStack>
            )}

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">{error}</Text>
              </Alert>
            )}

            {content.length === 0 && !loading && !error && (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                  ไม่พบเนื้อหาสำหรับจังหวัด {selectedProvince}
                </Text>
              </Alert>
            )}

            <VStack spacing={4} align="stretch">
              {content.map((page) => (
                <Card key={page.id} size="sm" variant="outline">
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      {/* Title */}
                      <Text
                        fontWeight="bold"
                        fontSize="md"
                        color="gray.700"
                        lineHeight="1.4"
                      >
                        {page.properties["Title/ชื่อเรื่อง/ชื่องาน"]?.title?.[0]
                          ?.plain_text || "ไม่มีชื่อ"}
                      </Text>

                      {/* Type and Status */}
                      <HStack spacing={2}>
                        {page.properties.Type?.select && (
                          <Badge
                            colorScheme={getTypeColor(
                              page.properties.Type.select.name
                            )}
                            variant="subtle"
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <Icon
                              as={() =>
                                getTypeIcon(
                                  page.properties.Type.select?.name || ""
                                )
                              }
                              boxSize={3}
                            />
                            {page.properties.Type.select.name}
                          </Badge>
                        )}

                        {page.properties.Status?.status && (
                          <Badge
                            colorScheme={
                              page.properties.Status.status.color === "green"
                                ? "green"
                                : "gray"
                            }
                            variant="subtle"
                          >
                            {page.properties.Status.status.name}
                          </Badge>
                        )}
                      </HStack>

                      {/* Brief */}
                      {page.properties["Brief/โปรย"]?.rich_text?.[0]
                        ?.plain_text && (
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          lineHeight="1.5"
                          noOfLines={4}
                        >
                          {
                            page.properties["Brief/โปรย"].rich_text[0]
                              .plain_text
                          }
                        </Text>
                      )}

                      {/* Tags */}
                      {page.properties.Tags?.multi_select &&
                        page.properties.Tags.multi_select.length > 0 && (
                          <Wrap spacing={1}>
                            {page.properties.Tags.multi_select.map(
                              (tag, index) => (
                                <WrapItem key={index}>
                                  <Tag
                                    size="sm"
                                    colorScheme={getTagColor(tag.color)}
                                    variant="subtle"
                                  >
                                    <TagLabel>{tag.name}</TagLabel>
                                  </Tag>
                                </WrapItem>
                              )
                            )}
                          </Wrap>
                        )}

                      {/* Link */}
                      {page.properties["Link/บทความ/YouTube"]?.url && (
                        <Button
                          as={Link}
                          href={page.properties["Link/บทความ/YouTube"].url}
                          isExternal
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          leftIcon={<ExternalLinkIcon />}
                          _hover={{ textDecoration: "none" }}
                        >
                          ดูเนื้อหา
                        </Button>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default NotionContentSidebar;
