import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { ChatMessage } from "../types";
import {
  sendChatMessage,
  saveChatMessages,
  loadChatMessages,
  loadSettings,
} from "../lib/ai";
import { useNetworkStatus } from "../lib/net";
import OfflineQueue from "../lib/offlineQueue";

interface ChatViewProps {
  onMessageSent?: (message: string) => void;
}

export default function ChatView({ onMessageSent }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [settings, setSettings] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const isOnline = useNetworkStatus();
  const offlineQueue = OfflineQueue.getInstance();

  useEffect(() => {
    loadMessages();
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    const loadedSettings = await loadSettings();
    setSettings(loadedSettings);
  };

  useEffect(() => {
    if (isOnline && offlineQueue.getQueueLength() > 0) {
      flushOfflineMessages();
    }
  }, [isOnline]);

  const loadMessages = async () => {
    const loadedMessages = await loadChatMessages();
    setMessages(loadedMessages.slice(-50)); // Keep last 50 messages
  };

  const flushOfflineMessages = async () => {
    const queuedMessages = await offlineQueue.flush();
    for (const queuedMessage of queuedMessages) {
      await sendMessage(queuedMessage.content);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setStreamingMessage("");

    try {
      if (!isOnline) {
        await offlineQueue.enqueue(messageText);
        const offlineMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Message queued for when you're back online.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, offlineMessage]);
        return;
      }

      console.log("Sending message:", messageText);
      console.log("Settings:", settings);

      const stream = await sendChatMessage(messageText, settings);
      console.log("Stream received:", !!stream);

      if (!stream) {
        console.log("No stream received, showing error message");
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setStreamingMessage(fullResponse);
      }

      // Update the final message with the complete response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, content: fullResponse }
            : msg
        )
      );

      onMessageSent?.(messageText);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setStreamingMessage("");
    }
  };

  const handleSend = () => {
    sendMessage(inputText);
  };

  useEffect(() => {
    saveChatMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, streamingMessage]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <YStack flex={1} backgroundColor="$background">
        {/* Offline Banner */}
        {!isOnline && (
          <View backgroundColor="$red9" padding="$2">
            <Text color="white" textAlign="center">
              You're offline. Messages will be queued and sent when you're back
              online.
            </Text>
          </View>
        )}

        {/* Guided prompts when empty */}
        {messages.length === 0 && !isLoading && !streamingMessage && (
          <View padding="$3" backgroundColor="$gray8">
            <Text color="$color" fontSize="$5" fontWeight="700" marginBottom="$2">
              Welcome!
            </Text>
            <Text color="$gray11" marginBottom="$3">
              Do you want to track expenses, set goals, or get forecasts today?
            </Text>
            <XStack gap={8} flexWrap="wrap">
              <Button backgroundColor="$primary" color="$color" onPress={() => setInputText("Help me track expenses from my CSV")}>Track expenses</Button>
              <Button backgroundColor="$secondary" color="$color" onPress={() => setInputText("I want to set a savings goal")}>Set goals</Button>
              <Button backgroundColor="$accent" color="$color" onPress={() => setInputText("Give me a 6-month savings forecast")}>Get forecasts</Button>
            </XStack>
          </View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <View key={message.id} marginBottom="$3">
              <XStack
                justifyContent={
                  message.role === "user" ? "flex-end" : "flex-start"
                }
              >
                <View
                  backgroundColor={
                    message.role === "user" ? "$primary" : "$gray8"
                  }
                  padding="$3"
                  borderRadius="$3"
                  maxWidth="80%"
                >
                  <Text color="$color">{message.content}</Text>
                  <Text fontSize="$2" color="$gray11" marginTop="$1">
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                </View>
              </XStack>
            </View>
          ))}

          {/* Streaming message */}
          {isLoading && streamingMessage && (
            <View marginBottom="$3">
              <XStack justifyContent="flex-start">
                <View
                  backgroundColor="$gray8"
                  padding="$3"
                  borderRadius="$3"
                  maxWidth="80%"
                >
                  <Text color="$color">{streamingMessage}</Text>
                  <Text fontSize="$2" color="$gray11" marginTop="$1">
                    Typing...
                  </Text>
                </View>
              </XStack>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <XStack
          padding="$3"
          backgroundColor="$background"
          borderTopWidth={1}
          borderTopColor="$borderColor"
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask your financial advisor..."
            placeholderTextColor="$textDim"
            style={{
              flex: 1,
              backgroundColor: "$panel",
              color: "$color",
              padding: 12,
              borderRadius: 8,
              marginRight: 8,
              borderWidth: 1,
              borderColor: "$borderColor",
            }}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <Button
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
            backgroundColor="$primary"
            color="white"
            paddingHorizontal="$4"
            borderRadius="$3"
            opacity={!inputText.trim() || isLoading ? 0.5 : 1}
          >
            Send
          </Button>
        </XStack>

        {/* Disclaimer */}
        <View padding="$2" backgroundColor="$gray8">
          <Text fontSize="$2" color="$gray11" textAlign="center">
            Educational purposes only. Not professional financial advice.
          </Text>
        </View>
      </YStack>
    </KeyboardAvoidingView>
  );
}
