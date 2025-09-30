import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAppStore } from '../../lib/state';
import { formatCurrency, analyzeTransactions } from '../../lib/utils';

export default function AnalysisScreen() {
  const { transactions, analysisData, setAnalysisData } = useAppStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUploadCSV = () => {
    Alert.alert('Upload CSV', 'CSV upload feature coming soon!');
  };

  const handleDownloadSample = () => {
    Alert.alert('Download Sample', 'Sample CSV download feature coming soon!');
  };

  const handleAnalyzeData = async () => {
    if (transactions.length === 0) {
      Alert.alert('No Data', 'Please add some transactions first');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analysis = analyzeTransactions(transactions);
      setAnalysisData(analysis);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze data');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportInsights = () => {
    if (!analysisData) {
      Alert.alert('No Data', 'Please analyze your data first');
      return;
    }
    Alert.alert('Export Insights', 'Export feature coming soon!');
  };

  if (transactions.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <View style={styles.emptyState}>
            <Ionicons name="pie-chart-outline" size={80} color="#6b7680" />
            <Text style={styles.emptyTitle}>No Data Yet</Text>
            <Text style={styles.emptySubtitle}>
              Upload your financial data to get insights and analysis
            </Text>
            
            <View style={styles.emptyActions}>
              <Button
                title="Upload CSV"
                onPress={handleUploadCSV}
                icon="cloud-upload"
                size="large"
                style={styles.uploadButton}
              />
              
              <Button
                title="Download Sample CSV"
                onPress={handleDownloadSample}
                icon="download"
                variant="outline"
                size="large"
                style={styles.sampleButton}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Financial Analysis</Text>
          <Button
            title="Analyze"
            onPress={handleAnalyzeData}
            icon="analytics"
            loading={isAnalyzing}
            size="small"
          />
        </View>

        {/* Upload Actions */}
        <Card style={styles.uploadCard} padding="large">
          <View style={styles.uploadHeader}>
            <Ionicons name="document-attach" size={24} color="#4f7f8c" />
            <Text style={styles.uploadTitle}>Data Management</Text>
          </View>
          <Text style={styles.uploadSubtitle}>
            Upload CSV files or download sample data to get started
          </Text>
          
          <View style={styles.uploadActions}>
            <Button
              title="Upload CSV"
              onPress={handleUploadCSV}
              icon="cloud-upload"
              style={styles.uploadAction}
            />
            <Button
              title="Download Sample"
              onPress={handleDownloadSample}
              icon="download"
              variant="outline"
              style={styles.uploadAction}
            />
          </View>
        </Card>

        {/* Analysis Results */}
        {analysisData && (
          <>
            {/* Summary Card */}
            <Card style={styles.summaryCard} padding="large">
              <Text style={styles.summaryTitle}>Financial Summary</Text>
              
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Income</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(analysisData.totalIncome)}
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Expenses</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(analysisData.totalExpenses)}
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Net Income</Text>
                  <Text style={[
                    styles.summaryValue,
                    { color: analysisData.netIncome >= 0 ? '#34C759' : '#FF3B30' }
                  ]}>
                    {formatCurrency(analysisData.netIncome)}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Categories Card */}
            <Card style={styles.categoriesCard} padding="large">
              <Text style={styles.categoriesTitle}>Expense Categories</Text>
              
              {Object.entries(analysisData.categories).map(([category, amount]) => {
                const percentage = (amount / analysisData.totalExpenses) * 100;
                return (
                  <View key={category} style={styles.categoryItem}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryName}>{category}</Text>
                      <Text style={styles.categoryAmount}>
                        {formatCurrency(amount)}
                      </Text>
                    </View>
                    <ProgressBar
                      progress={percentage}
                      height={6}
                      showPercentage={false}
                      color="#4f7f8c"
                    />
                    <Text style={styles.categoryPercentage}>
                      {percentage.toFixed(1)}%
                    </Text>
                  </View>
                );
              })}
            </Card>

            {/* Insights Card */}
            <Card style={styles.insightsCard} padding="large">
              <View style={styles.insightsHeader}>
                <Ionicons name="bulb" size={24} color="#FF9500" />
                <Text style={styles.insightsTitle}>AI Insights</Text>
              </View>
              
              {analysisData.insights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </Card>

            {/* Forecast Card */}
            <Card style={styles.forecastCard} padding="large">
              <View style={styles.forecastHeader}>
                <Ionicons name="trending-up" size={24} color="#4f7f8c" />
                <Text style={styles.forecastTitle}>6-Month Forecast</Text>
              </View>
              
              <Text style={styles.forecastText}>
                If you keep spending like this, you'll be short {formatCurrency(Math.abs(analysisData.netIncome) * 6)} in 6 months.
              </Text>
              
              <View style={styles.forecastActions}>
                <Button
                  title="Export Insights"
                  onPress={handleExportInsights}
                  icon="share"
                  variant="outline"
                  size="small"
                />
              </View>
            </Card>
          </>
        )}

        {/* Privacy Badge */}
        <View style={styles.privacyBadge}>
          <Ionicons name="shield-checkmark" size={20} color="#34C759" />
          <Text style={styles.privacyText}>
            🔐 Your financial data is analyzed locally and never shared
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7680',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  emptyActions: {
    gap: 16,
    width: '100%',
    maxWidth: 300,
  },
  uploadButton: {
    backgroundColor: '#4f7f8c',
  },
  sampleButton: {
    borderColor: '#4f7f8c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  uploadCard: {
    marginBottom: 16,
  },
  uploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6b7680',
    marginBottom: 16,
    lineHeight: 20,
  },
  uploadActions: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadAction: {
    flex: 1,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  summaryGrid: {
    gap: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7680',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  categoriesCard: {
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f7f8c',
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#6b7680',
    marginTop: 4,
    textAlign: 'right',
  },
  insightsCard: {
    marginBottom: 16,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#a5c6d5',
    lineHeight: 20,
    flex: 1,
  },
  forecastCard: {
    marginBottom: 16,
  },
  forecastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  forecastText: {
    fontSize: 16,
    color: '#a5c6d5',
    lineHeight: 24,
    marginBottom: 16,
  },
  forecastActions: {
    alignItems: 'flex-start',
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  privacyText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
    flex: 1,
  },
});