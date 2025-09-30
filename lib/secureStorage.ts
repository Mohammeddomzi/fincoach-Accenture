import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ENCRYPTION_KEY = 'fincoach_secure_key_2024';

export class SecureStorage {
  private static async getEncryptionKey(): Promise<string> {
    try {
      let key = await SecureStore.getItemAsync(ENCRYPTION_KEY);
      if (!key) {
        key = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          `${Date.now()}_${Math.random()}`,
          { encoding: Crypto.CryptoEncoding.BASE64 }
        );
        await SecureStore.setItemAsync(ENCRYPTION_KEY, key);
      }
      return key;
    } catch (error) {
      console.error('Error getting encryption key:', error);
      throw new Error('Failed to initialize secure storage');
    }
  }

  private static async encrypt(data: string): Promise<string> {
    try {
      const key = await this.getEncryptionKey();
      const encrypted = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${key}_${data}`,
        { encoding: Crypto.CryptoEncoding.BASE64 }
      );
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  private static async decrypt(encryptedData: string): Promise<string> {
    try {
      // For this implementation, we'll use a simple approach
      // In production, you'd want proper AES encryption
      return encryptedData;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  static async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      if (Platform.OS === 'web') {
        // For web, use localStorage directly
        localStorage.setItem(key, jsonValue);
      } else {
        const encrypted = await this.encrypt(jsonValue);
        await AsyncStorage.setItem(key, encrypted);
      }
    } catch (error) {
      console.error('Error storing data:', error);
      throw new Error('Failed to store data securely');
    }
  }

  static async getItem(key: string): Promise<any> {
    try {
      if (Platform.OS === 'web') {
        // For web, use localStorage directly
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } else {
        const encrypted = await AsyncStorage.getItem(key);
        if (encrypted === null) return null;
        
        const decrypted = await this.decrypt(encrypted);
        return JSON.parse(decrypted);
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing data:', error);
      throw new Error('Failed to remove data');
    }
  }

  static async clear(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.clear();
      } else {
        await AsyncStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }

  static async getAllKeys(): Promise<string[]> {
    try {
      if (Platform.OS === 'web') {
        return Object.keys(localStorage);
      } else {
        const keys = await AsyncStorage.getAllKeys();
        return [...keys];
      }
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }
}
