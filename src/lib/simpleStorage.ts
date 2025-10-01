import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple in-memory storage for web compatibility
const memoryStorage: { [key: string]: string } = {};

export class SimpleStorage {
  async getItem(key: string): Promise<string | null> {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      } else {
        // Fallback to AsyncStorage for React Native
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      // Fallback to memory storage
      console.warn('Storage error, using memory fallback:', error);
      return memoryStorage[key] || null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      } else {
        // Fallback to AsyncStorage for React Native
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      // Fallback to memory storage
      console.warn('Storage error, using memory fallback:', error);
      memoryStorage[key] = value;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      } else {
        // Fallback to AsyncStorage for React Native
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      // Fallback to memory storage
      console.warn('Storage error, using memory fallback:', error);
      delete memoryStorage[key];
    }
  }

  async clear(): Promise<void> {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.clear();
      } else {
        // Fallback to AsyncStorage for React Native
        await AsyncStorage.clear();
      }
    } catch (error) {
      // Fallback to memory storage
      console.warn('Storage error, using memory fallback:', error);
      Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
    }
  }
}
