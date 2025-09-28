import AsyncStorage from "@react-native-async-storage/async-storage";
import { OfflineMessage } from "../types";

class OfflineQueue {
  private static instance: OfflineQueue;
  private queue: OfflineMessage[] = [];
  private readonly STORAGE_KEY = "offline_queue";

  private constructor() {
    this.loadQueue();
  }

  static getInstance(): OfflineQueue {
    if (!OfflineQueue.instance) {
      OfflineQueue.instance = new OfflineQueue();
    }
    return OfflineQueue.instance;
  }

  private async loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load offline queue:", error);
    }
  }

  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error("Failed to save offline queue:", error);
    }
  }

  async enqueue(message: string): Promise<void> {
    const offlineMessage: OfflineMessage = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date(),
    };

    this.queue.push(offlineMessage);
    await this.saveQueue();
  }

  async flush(): Promise<OfflineMessage[]> {
    const messages = [...this.queue];
    this.queue = [];
    await this.saveQueue();
    return messages;
  }

  async getQueue(): Promise<OfflineMessage[]> {
    return [...this.queue];
  }

  async clear(): Promise<void> {
    this.queue = [];
    await this.saveQueue();
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

export default OfflineQueue;
