import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { Animated } from "react-native";
import { pickCSVFile, parseCSV, downloadSampleCSV } from "../../lib/csv";
import { analyzeCSV } from "../../lib/ai";
import { formatCurrency } from "../../lib/currency";
import MetricCard from "../../components/MetricCard";
import { CSVData, MetricCard as MetricCardType } from "../../types";
import GhostChart from "../../components/GhostChart";
import Header from "../../src/components/ui/Header";
import Card from "../../src/components/ui/Card";
import GlowButton from "../../src/components/ui/GlowButton";

export default function AnalysisScreen() {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePickFile = async () => {
    try {
      const uri = await pickCSVFile();
      if (!uri) return;

      setIsLoading(true);
      const parsed = await parseCSV(uri);

      if (!parsed) {
        Alert.alert("Error", "Failed to parse CSV file");
        return;
      }

      setCsvData(parsed);
      await analyzeData(parsed);
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick CSV file");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeData = async (data: CSVData) => {
    try {
      const result = await analyzeCSV(data.summary);
      if (result) {
        setAnalysis(result);
      } else {
        Alert.alert("Error", "Failed to analyze data");
      }
    } catch (error) {
      console.error("Error analyzing data:", error);
      Alert.alert("Error", "Failed to analyze data");
    }
  };

  const handleDownloadSample = () => {
    downloadSampleCSV();
  };

  const formatAnalysis = (analysisText: string) => {
    // Split the analysis into sections
    const sections = analysisText.split(/(?=###)/);

    return sections
      .map((section, index) => {
        if (!section.trim()) return null;

        const lines = section
          .trim()
          .split("\n")
          .filter((line) => line.trim());
        const title = lines[0]?.replace(/^###\s*/, "") || "";
        const content = lines.slice(1);

        return { title, content, key: index };
      })
      .filter(Boolean);
  };

  const getSectionColor = (title: string) => {
    // Unified color for all AI recommendation sections
    return "$blue9";
  };

  const renderAnalysisSection = (section: {
    title: string;
    content: string[];
    key: number;
  }) => {
    const color = getSectionColor(section.title);

    return (
      <View
        key={section.key}
        backgroundColor="$gray8"
        padding="$4"
        borderRadius="$4"
        marginBottom="$3"
        borderLeftWidth={4}
        borderLeftColor={color}
      >
        <YStack space="$3">
          <Text fontSize="$5" fontWeight="bold" color={color}>
            {section.title}
          </Text>

          <YStack space="$2">
            {section.content.map((line, lineIndex) => {
              // Check if it's a numbered list item
              const isNumberedItem = /^\d+\.\s/.test(line);
              const isBulletItem = /^[•·-]\s/.test(line);

              if (isNumberedItem || isBulletItem) {
                return (
                  <XStack
                    key={lineIndex}
                    marginBottom="$1"
                    alignItems="flex-start"
                  >
                    <Text
                      color={color}
                      fontSize="$3"
                      marginRight="$2"
                      marginTop="$1"
                    >
                      •
                    </Text>
                    <Text color="$color" fontSize="$4" flex={1} lineHeight="$4">
                      {line.replace(/^\d+\.\s|[•·-]\s/, "")}
                    </Text>
                  </XStack>
                );
              }

              return (
                <Text
                  key={lineIndex}
                  color="$color"
                  fontSize="$4"
                  marginBottom="$1"
                  lineHeight="$4"
                >
                  {line}
                </Text>
              );
            })}
          </YStack>
        </YStack>
      </View>
    );
  };

  const getCategoryColor = (category: string) => {
    // Unified color for all categories
    return "$blue9";
  };

  const renderCategoryCard = (category: string, count: number) => {
    const color = getCategoryColor(category);

    return (
      <View
        key={category}
        backgroundColor="$gray8"
        padding="$3"
        borderRadius="$3"
        marginBottom="$2"
        borderWidth={1}
        borderColor="$borderColor"
        width="48%"
      >
        <YStack space="$2" alignItems="center">
          <Text
            color="$color"
            fontSize="$4"
            fontWeight="600"
            textAlign="center"
            numberOfLines={2}
          >
            {category}
          </Text>
          <View
            backgroundColor={color}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2"
          >
            <Text color="white" fontSize="$3" fontWeight="bold">
              {count} transaction{count !== 1 ? "s" : ""}
            </Text>
          </View>
        </YStack>
      </View>
    );
  };

  const getMetricCards = (): MetricCardType[] => {
    if (!csvData) return [];

    const metrics: MetricCardType[] = [
      {
        title: "Total Records",
        value: csvData.summary.totalRows.toString(),
      },
    ];

    if (csvData.summary.totals) {
      Object.entries(csvData.summary.totals).forEach(([key, value]) => {
        metrics.push({
          title: `Total ${key}`,
          value: formatCurrency(value as number),
        });
      });
    }

    if (csvData.summary.dateRange) {
      const startDate = new Date(csvData.summary.dateRange.start);
      const endDate = new Date(csvData.summary.dateRange.end);
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      metrics.push({
        title: "Date Range",
        value: `${daysDiff} days`,
      });
    }

    return metrics;
  };

  return (
    <View flex={1} backgroundColor="$background">
      <Header />
      <ScrollView style={{ padding: 16 }}>
        <YStack space="$4">
          {!csvData ? (
            <Card>
                <YStack alignItems="center" space="$4">
                  <View style={{ position: "relative", width: "100%", height: 120, opacity: 0.3 }} pointerEvents="none">
                    <GhostChart width={280} height={120} />
                  </View>
                  <YStack alignItems="center" space="$2">
                    <Text fontSize="$6" fontWeight="800" color="$color" textAlign="center">
                      Upload CSV to Analyze
                    </Text>
                    <Text fontSize="$4" color="$textDim" textAlign="center">
                      Upload your financial data in CSV format to get AI-powered insights
                    </Text>
                  </YStack>
                  <YStack space="$3" alignItems="center" width="100%">
                    <GlowButton onPress={handlePickFile} disabled={isLoading}>
                      {isLoading ? "Processing..." : "Upload CSV"}
                    </GlowButton>
                    <Button
                      variant="outlined"
                      borderColor="$borderColor"
                      color="$textDim"
                      onPress={handleDownloadSample}
                      borderRadius="$3"
                      paddingHorizontal="$4"
                      paddingVertical="$3"
                      width="100%"
                    >
                      Download Sample CSV
                    </Button>
                  </YStack>
                </YStack>
              </Card>
          ) : (
            <>
              {/* Metrics */}
              <YStack space="$3">
                <Text fontSize="$6" fontWeight="bold" color="$color">
                  Key Metrics
                </Text>
                <XStack space="$3" flexWrap="wrap">
                  {getMetricCards().map((metric, index) => (
                    <View key={index} width="48%" marginBottom="$3">
                      <MetricCard metric={metric} />
                    </View>
                  ))}
                </XStack>
              </YStack>

              {/* Categories */}
              {csvData.summary.categories && (
                <YStack space="$3">
                  <Text fontSize="$6" fontWeight="bold" color="$color">
                    Categories
                  </Text>
                  <XStack space="$3" flexWrap="wrap">
                    {Object.entries(csvData.summary.categories).map(
                      ([category, count]) =>
                        renderCategoryCard(category, count as number)
                    )}
                  </XStack>
                </YStack>
              )}

              {/* AI Analysis */}
              {analysis && (
                <YStack space="$3">
                  <Text fontSize="$6" fontWeight="bold" color="$color">
                    AI Recommendations
                  </Text>
                  {formatAnalysis(analysis).map(renderAnalysisSection)}
                </YStack>
              )}

              {/* Actions */}
              <XStack space="$3" justifyContent="center">
                <Button
                  backgroundColor="$blue9"
                  color="white"
                  onPress={handlePickFile}
                  borderRadius="$3"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                >
                  Upload New File
                </Button>
                <Button
                  variant="outlined"
                  borderColor="$gray8"
                  color="$gray11"
                  onPress={() => {
                    setCsvData(null);
                    setAnalysis("");
                  }}
                  borderRadius="$3"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                >
                  Clear Data
                </Button>
              </XStack>
            </>
          )}
        </YStack>
      </ScrollView>
    </View>
  );
}
