import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAppStore } from '../../lib/state';

export default function SettingsScreen() {
  const { 
    settings, 
    updateSettings, 
    userProfile, 
    setUserProfile, 
    exportData, 
    importData, 
    resetApp 
  } = useAppStore();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [nickname, setNickname] = useState(userProfile?.nickname || 'Guest User');

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  const handleCurrencyChange = (currency: string) => {
    updateSettings({ currency });
  };

  const handleNotificationToggle = (value: boolean) => {
    updateSettings({ notifications: value });
  };

  const handleBiometricToggle = (value: boolean) => {
    updateSettings({ biometricAuth: value });
  };

  const handleDataExportToggle = (value: boolean) => {
    updateSettings({ dataExport: value });
  };

  const handlePrivacyModeToggle = (value: boolean) => {
    updateSettings({ privacyMode: value });
  };

  const handleNicknameChange = () => {
    if (nickname.trim()) {
      setUserProfile({
        ...userProfile!,
        nickname: nickname.trim(),
        lastActive: new Date(),
      });
      Alert.alert('Success', 'Nickname updated successfully!');
    } else {
      Alert.alert('Error', 'Please enter a valid nickname');
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await exportData();
      // In a real app, you'd share or save this data
      Alert.alert('Export Complete', 'Data exported successfully!');
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'Import feature coming soon!');
  };

  const handleResetApp = async () => {
    Alert.alert(
      'Reset App',
      'This will delete all your data and cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetApp();
              Alert.alert('Success', 'App reset successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset app');
            }
          },
        },
      ]
    );
  };

  const SettingRow = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    rightComponent 
  }: {
    title: string;
    subtitle?: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity 
      style={styles.settingRow} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#4f7f8c" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || (onPress && <Ionicons name="chevron-forward" size={20} color="#6b7680" />)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <Card style={styles.section} padding="large">
          <Text style={styles.sectionTitle}>Profile</Text>
          
          <View style={styles.nicknameContainer}>
            <Input
              label="Nickname"
              value={nickname}
              onChangeText={setNickname}
              placeholder="Enter your nickname"
              leftIcon="person-outline"
            />
            <Button
              title="Update"
              onPress={handleNicknameChange}
              size="small"
              style={styles.updateButton}
            />
          </View>
        </Card>

        {/* Appearance Section */}
        <Card style={styles.section} padding="large">
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.themeContainer}>
            <Text style={styles.themeLabel}>Theme</Text>
            <View style={styles.themeButtons}>
              {(['system', 'light', 'dark'] as const).map((theme) => (
                <Button
                  key={theme}
                  title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                  onPress={() => handleThemeChange(theme)}
                  variant={settings.theme === theme ? 'primary' : 'outline'}
                  size="small"
                  style={styles.themeButton}
                />
              ))}
            </View>
          </View>
        </Card>

        {/* Preferences Section */}
        <Card style={styles.section} padding="large">
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <SettingRow
            title="Notifications"
            subtitle="Receive app notifications"
            icon="notifications-outline"
            rightComponent={
              <Switch
                value={settings.notifications}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#2b2f33', true: '#4f7f8c' }}
                thumbColor={settings.notifications ? '#ffffff' : '#6b7680'}
              />
            }
          />
          
          <SettingRow
            title="Biometric Authentication"
            subtitle="Use fingerprint or face ID"
            icon="finger-print-outline"
            rightComponent={
              <Switch
                value={settings.biometricAuth}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: '#2b2f33', true: '#4f7f8c' }}
                thumbColor={settings.biometricAuth ? '#ffffff' : '#6b7680'}
              />
            }
          />
          
          <SettingRow
            title="Data Export"
            subtitle="Allow data export functionality"
            icon="download-outline"
            rightComponent={
              <Switch
                value={settings.dataExport}
                onValueChange={handleDataExportToggle}
                trackColor={{ false: '#2b2f33', true: '#4f7f8c' }}
                thumbColor={settings.dataExport ? '#ffffff' : '#6b7680'}
              />
            }
          />
          
          <SettingRow
            title="Privacy Mode"
            subtitle="Enhanced privacy protection"
            icon="shield-outline"
            rightComponent={
              <Switch
                value={settings.privacyMode}
                onValueChange={handlePrivacyModeToggle}
                trackColor={{ false: '#2b2f33', true: '#4f7f8c' }}
                thumbColor={settings.privacyMode ? '#ffffff' : '#6b7680'}
              />
            }
          />
        </Card>

        {/* Data Management Section */}
        <Card style={styles.section} padding="large">
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <SettingRow
            title="Export Data"
            subtitle="Download your data as JSON"
            icon="cloud-download-outline"
            onPress={handleExportData}
          />
          
          <SettingRow
            title="Import Data"
            subtitle="Restore from backup"
            icon="cloud-upload-outline"
            onPress={handleImportData}
          />
          
          <SettingRow
            title="Reset App"
            subtitle="Delete all data and start fresh"
            icon="refresh-outline"
            onPress={handleResetApp}
          />
        </Card>

        {/* About Section */}
        <Card style={styles.section} padding="large">
          <Text style={styles.sectionTitle}>About</Text>
          
          <SettingRow
            title="Version"
            subtitle="1.0.0"
            icon="information-circle-outline"
          />
          
          <SettingRow
            title="Privacy Policy"
            subtitle="How we protect your data"
            icon="document-text-outline"
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy coming soon!')}
          />
          
          <SettingRow
            title="Terms of Service"
            subtitle="App usage terms"
            icon="document-outline"
            onPress={() => Alert.alert('Terms of Service', 'Terms of service coming soon!')}
          />
        </Card>

        {/* Privacy Badge */}
        <View style={styles.privacyBadge}>
          <Ionicons name="shield-checkmark" size={24} color="#34C759" />
          <View style={styles.privacyText}>
            <Text style={styles.privacyTitle}>Privacy Protected</Text>
            <Text style={styles.privacySubtitle}>
              Your data is encrypted and stored locally on your device. We never collect or share your personal information.
            </Text>
          </View>
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  nicknameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  updateButton: {
    minWidth: 80,
  },
  themeContainer: {
    gap: 12,
  },
  themeLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2f33',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7680',
    marginTop: 2,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 20,
  },
  privacyText: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759',
    marginBottom: 4,
  },
  privacySubtitle: {
    fontSize: 14,
    color: '#34C759',
    lineHeight: 20,
  },
});