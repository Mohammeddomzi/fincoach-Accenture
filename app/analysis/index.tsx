import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function AnalysisScreen() {
  const [isDarkMode] = useState(true); // This will be connected to theme later

  const handleUploadCSV = () => {
    Alert.alert('Upload CSV', 'CSV upload functionality will be implemented here');
  };

  const handleDownloadSample = () => {
    Alert.alert('Download Sample', 'Sample CSV download functionality will be implemented here');
  };

  const GhostChart = () => (
    <Svg width="100%" height="200" viewBox="0 0 300 200">
      <Defs>
        <LinearGradient id="ghostGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={isDarkMode ? '#4f7f8c' : '#a5c6d5'} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={isDarkMode ? '#4f7f8c' : '#a5c6d5'} stopOpacity="0.1" />
        </LinearGradient>
      </Defs>
      <Path
        d="M20 180 L60 120 L100 140 L140 80 L180 100 L220 60 L260 40 L280 20"
        stroke={isDarkMode ? '#4f7f8c' : '#a5c6d5'}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <Path
        d="M20 180 L60 120 L100 140 L140 80 L180 100 L220 60 L260 40 L280 20 L280 180 L20 180 Z"
        fill="url(#ghostGradient)"
      />
    </Svg>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis</Text>
        <Text style={styles.subtitle}>Upload your financial data for insights</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="analytics" size={24} color="#4f7f8c" />
          <Text style={styles.cardTitle}>Upload CSV to Analyze</Text>
        </View>
        
        <View style={styles.chartContainer}>
          <GhostChart />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleUploadCSV}>
            <Ionicons name="cloud-upload" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Upload CSV</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleDownloadSample}>
            <Ionicons name="download" size={20} color="#4f7f8c" />
            <Text style={styles.secondaryButtonText}>Download Sample CSV</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7680',
  },
  card: {
    margin: 20,
    backgroundColor: '#111315',
    borderRadius: 16,
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  chartContainer: {
    marginBottom: 24,
    backgroundColor: '#15181a',
    borderRadius: 12,
    padding: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4f7f8c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4f7f8c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#4f7f8c',
    fontSize: 16,
    fontWeight: '600',
  },
});

