// Simple storage that works on both web and mobile
export class SimpleStorage {
  static setItem(key: string, value: any): void {
    try {
      const jsonValue = JSON.stringify(value);
      if (typeof window !== 'undefined' && window.localStorage) {
        // Web
        window.localStorage.setItem(key, jsonValue);
      } else {
        // React Native - use a simple in-memory store for now
        if (!global.__fincoachStorage) {
          global.__fincoachStorage = {};
        }
        global.__fincoachStorage[key] = jsonValue;
      }
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }

  static getItem(key: string): any {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Web
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } else {
        // React Native - use in-memory store
        if (!global.__fincoachStorage) {
          global.__fincoachStorage = {};
        }
        const value = global.__fincoachStorage[key];
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        if (global.__fincoachStorage) {
          delete global.__fincoachStorage[key];
        }
      }
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }

  static clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      } else {
        global.__fincoachStorage = {};
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}
