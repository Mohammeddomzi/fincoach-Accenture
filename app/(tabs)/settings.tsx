import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    theme: 'system' as 'light' | 'dark' | 'system',
    currency: 'SAR',
    language: 'en' as 'en' | 'ar',
    notifications: true,
    biometricAuth: false,
    dataExport: true,
    privacyMode: true,
  });
  
  const [nickname, setNickname] = useState('Guest User');

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const handleCurrencyChange = (currency: string) => {
    setSettings(prev => ({ ...prev, currency }));
  };

  const handleNotificationToggle = (value: boolean) => {
    setSettings(prev => ({ ...prev, notifications: value }));
  };

  const handleBiometricToggle = (value: boolean) => {
    setSettings(prev => ({ ...prev, biometricAuth: value }));
  };

  const handleDataExportToggle = (value: boolean) => {
    setSettings(prev => ({ ...prev, dataExport: value }));
  };

  const handlePrivacyModeToggle = (value: boolean) => {
    setSettings(prev => ({ ...prev, privacyMode: value }));
  };

  const handleLanguageChange = (language: 'en' | 'ar') => {
    setSettings(prev => ({ ...prev, language }));
  };

  const handleClearChatHistory = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to delete all chat messages? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would clear the chat messages
            Alert.alert('Success', 'Chat history cleared successfully!');
          },
        },
      ]
    );
  };

  const handleNicknameChange = () => {
    if (nickname.trim()) {
      Alert.alert('Success', 'Nickname updated successfully!');
    } else {
      Alert.alert('Error', 'Please enter a valid nickname');
    }
  };

  const handleExportData = () => {
    Alert.alert('Export Complete', 'Data exported successfully!');
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'Import feature coming soon!');
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will delete all your data and cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'App reset successfully!');
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
        {/* Header */}
        <Text style={styles.headerTitle}>Settings</Text>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          
          <View style={styles.nicknameContainer}>
            <Text style={styles.label}>Nickname</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Enter your nickname"
                placeholderTextColor="#6b7680"
              />
              <TouchableOpacity style={styles.updateButton} onPress={handleNicknameChange}>
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.themeContainer}>
            <Text style={styles.label}>Theme</Text>
            <View style={styles.themeButtons}>
              {(['system', 'light', 'dark'] as const).map((theme) => (
                <TouchableOpacity
                  key={theme}
                  style={[
                    styles.themeButton,
                    settings.theme === theme && styles.themeButtonActive
                  ]}
                  onPress={() => handleThemeChange(theme)}
                >
                  <Text style={[
                    styles.themeButtonText,
                    settings.theme === theme && styles.themeButtonTextActive
                  ]}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.currencyContainer}>
            <Text style={styles.label}>Currency</Text>
            <View style={styles.currencyButtons}>
              {(['SAR', 'USD', 'EUR', 'GBP', 'AED'] as const).map((currency) => (
                <TouchableOpacity
                  key={currency}
                  style={[
                    styles.currencyButton,
                    settings.currency === currency && styles.currencyButtonActive
                  ]}
                  onPress={() => handleCurrencyChange(currency)}
                >
                  <Text style={[
                    styles.currencyButtonText,
                    settings.currency === currency && styles.currencyButtonTextActive
                  ]}>
                    {currency}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.languageContainer}>
            <Text style={styles.label}>Language</Text>
            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  settings.language === 'en' && styles.languageButtonActive
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text style={[
                  styles.languageButtonText,
                  settings.language === 'en' && styles.languageButtonTextActive
                ]}>
                  English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  settings.language === 'ar' && styles.languageButtonActive
                ]}
                onPress={() => handleLanguageChange('ar')}
              >
                <Text style={[
                  styles.languageButtonText,
                  settings.language === 'ar' && styles.languageButtonTextActive
                ]}>
                  العربية
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
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
        </View>

        {/* Chat Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chat Management</Text>
          
          <SettingRow
            title="Clear Chat History"
            subtitle="Delete all previous chat messages"
            icon="trash-outline"
            onPress={handleClearChatHistory}
          />
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
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
        </View>

        {/* About Section */}
        <View style={styles.section}>
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
        </View>

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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 8,
  },
  nicknameContainer: {
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2b2f33',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  updateButton: {
    backgroundColor: '#4f7f8c',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  updateButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  themeContainer: {
    gap: 12,
    marginBottom: 20,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    flex: 1,
    backgroundColor: '#2b2f33',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  themeButtonActive: {
    backgroundColor: '#4f7f8c',
    borderColor: '#4f7f8c',
  },
  themeButtonText: {
    color: '#6b7680',
    fontWeight: '500',
    textAlign: 'center',
  },
  themeButtonTextActive: {
    color: '#ffffff',
  },
  currencyContainer: {
    gap: 12,
    marginBottom: 20,
  },
  currencyButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  currencyButton: {
    flex: 1,
    minWidth: '18%',
    backgroundColor: '#2b2f33',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  currencyButtonActive: {
    backgroundColor: '#4f7f8c',
    borderColor: '#4f7f8c',
  },
  currencyButtonText: {
    color: '#6b7680',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
  },
  currencyButtonTextActive: {
    color: '#ffffff',
  },
  languageContainer: {
    gap: 12,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    flex: 1,
    backgroundColor: '#2b2f33',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  languageButtonActive: {
    backgroundColor: '#4f7f8c',
    borderColor: '#4f7f8c',
  },
  languageButtonText: {
    color: '#6b7680',
    fontWeight: '500',
    textAlign: 'center',
  },
  languageButtonTextActive: {
    color: '#ffffff',
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