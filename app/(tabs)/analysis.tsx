import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { pickCSVFile, parseCSV, downloadSampleCSV } from "../../lib/csv";
import { analyzeCSV } from "../../lib/ai";
import { formatCurrency } from "../../lib/currency";
import MetricCard from "../../components/MetricCard";
import { CSVData, MetricCard as MetricCardType } from "../../types";

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
      <ScrollView style={{ padding: 16 }}>
        <YStack space="$4">
          <Text fontSize="$8" fontWeight="bold" color="$color">
            Financial Analysis
          </Text>

          {!csvData ? (
            <View
              backgroundColor="$gray8"
              padding="$6"
              borderRadius="$4"
              alignItems="center"
            >
              <Text
                fontSize="$5"
                color="$gray11"
                textAlign="center"
                marginBottom="$3"
              >
                Upload CSV to Analyze
              </Text>
              <Text
                fontSize="$4"
                color="$gray11"
                textAlign="center"
                marginBottom="$4"
              >
                Upload your financial data in CSV format to get AI-powered
                insights
              </Text>

              <YStack space="$3" alignItems="center">
                <Button
                  backgroundColor="$blue9"
                  color="white"
                  onPress={handlePickFile}
                  disabled={isLoading}
                  borderRadius="$3"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                >
                  {isLoading ? "Processing..." : "Upload CSV"}
                </Button>

                <Button
                  variant="outlined"
                  borderColor="$gray8"
                  color="$gray11"
                  onPress={handleDownloadSample}
                  borderRadius="$3"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                >
                  Download Sample CSV
                </Button>
              </YStack>
            </View>
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
                  <View backgroundColor="$gray8" padding="$4" borderRadius="$4">
                    {Object.entries(csvData.summary.categories).map(
                      ([category, count]) => (
                        <XStack
                          key={category}
                          justifyContent="space-between"
                          marginBottom="$2"
                        >
                          <Text color="$color">{category}</Text>
                          <Text color="$gray11">{count} transactions</Text>
                        </XStack>
                      )
                    )}
                  </View>
                </YStack>
              )}

              {/* AI Analysis */}
              {analysis && (
                <YStack space="$3">
                  <Text fontSize="$6" fontWeight="bold" color="$color">
                    AI Recommendations
                  </Text>
                  <View backgroundColor="$gray8" padding="$4" borderRadius="$4">
                    <Text color="$color" lineHeight="$4">
                      {analysis}
                    </Text>
                  </View>
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
