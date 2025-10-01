import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LoadingDots } from '../../components/LoadingDots';
import { storage } from '../../lib/storage';
import { ChatMessage } from '../../lib/types';
import { sendChatMessage } from '../../lib/ai';

export default function AdvisorScreen() {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history on component mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const history = storage.getItem('advisor-chat-history') || [];
        setChatHistory(history);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    loadHistory();
  }, []);

  // Save chat history whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      storage.setItem('advisor-chat-history', chatHistory);
    }
  }, [chatHistory]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatMessage,
      isUser: true,
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setIsLoading(true);

    try {
      // Get current settings for the API call
      const settings = storage.getItem('fincoach-data') || {};
      
      // Call the real OpenAI API
      const stream = await sendChatMessage(chatMessage, settings);
      
      if (stream) {
        // Create AI message placeholder
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: '',
          isUser: false,
        };
        
        setChatHistory(prev => [...prev, aiMessage]);
        
        // Read the stream and update the message
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            fullResponse += chunk;
            
            // Update the last message with the current response
            setChatHistory(prev => {
              const updated = [...prev];
              const lastMessage = updated[updated.length - 1];
              if (lastMessage && !lastMessage.isUser) {
                lastMessage.text = fullResponse;
              }
              return updated;
            });
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        throw new Error('No response from API');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble connecting right now. Please check your internet connection and try again later.',
        isUser: false,
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatIfSimulator = () => {
    Alert.alert('What-If Simulator', 'This feature will help you calculate different scenarios for your financial goals. Coming soon!');
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter' && !event.nativeEvent.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to delete all chat messages? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setChatHistory([]);
            Alert.alert('Success', 'Chat history cleared successfully!');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles" size={24} color="#4f7f8c" />
            <Text style={styles.cardTitle}>Welcome to FinCoach!</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Your AI-powered financial advisor is ready to help you achieve your goals.
          </Text>
          
          <TouchableOpacity style={styles.primaryButton} onPress={() => setShowChat(true)}>
            <Ionicons name="chatbubbles" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Ask Coach</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(tabs)/goals')}>
            <Ionicons name="trophy" size={20} color="#4f7f8c" />
            <Text style={styles.secondaryButtonText}>Set Goal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleWhatIfSimulator}>
            <Ionicons name="calculator" size={20} color="#4f7f8c" />
            <Text style={styles.secondaryButtonText}>What-If Simulator</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="trending-up" size={24} color="#34C759" />
            <Text style={styles.cardTitle}>AI Forecast</Text>
          </View>
          <Text style={styles.forecastText}>
            If you contribute {formatCurrency(500)}/month, you'll reach your goal of {formatCurrency(10000)} in 20 months.
          </Text>
        </View>
      </ScrollView>

      {/* Chat Modal */}
      <Modal visible={showChat} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>AI Advisor</Text>
            <View style={styles.modalHeaderActions}>
              {chatHistory.length > 0 && (
                <TouchableOpacity onPress={handleClearChat} style={styles.clearButton}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setShowChat(false)}>
                <Ionicons name="close" size={24} color="#6b7680" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.chatContainer}>
            {chatHistory.length === 0 && (
              <View style={styles.welcomeMessage}>
                <Ionicons name="sparkles" size={48} color="#4f7f8c" />
                <Text style={styles.welcomeTitle}>Hi! I'm your AI Financial Coach</Text>
                <Text style={styles.welcomeText}>
                  Ask me anything about budgeting, saving, investing, or achieving your financial goals!
                </Text>
              </View>
            )}

            {chatHistory.map((message) => (
              <View key={message.id} style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage
              ]}>
                <Text style={[
                  styles.messageText,
                  message.isUser ? styles.userMessageText : styles.aiMessageText
                ]}>
                  {message.text}
                </Text>
              </View>
            ))}

            {isLoading && (
              <View style={styles.loadingContainer}>
                <LoadingDots />
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={chatMessage}
              onChangeText={setChatMessage}
              placeholder="Ask your financial question..."
              placeholderTextColor="#6b7680"
              multiline
              onKeyPress={handleKeyPress}
              blurOnSubmit={false}
            />
            <TouchableOpacity 
              style={[styles.sendButton, (!chatMessage.trim() || isLoading) && styles.sendButtonDisabled]} 
              onPress={handleSendMessage}
              disabled={!chatMessage.trim() || isLoading}
            >
              <Ionicons name="send" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2b2f33',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#a5c6d5',
    lineHeight: 20,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#4f7f8c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#4f7f8c',
    fontSize: 16,
    fontWeight: '500',
  },
  forecastText: {
    fontSize: 14,
    color: '#a5c6d5',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2f33',
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  clearButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeMessage: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#a5c6d5',
    textAlign: 'center',
    lineHeight: 24,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4f7f8c',
    padding: 12,
    borderRadius: 12,
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2b2f33',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#a5c6d5',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#2b2f33',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#2b2f33',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4f7f8c',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#2b2f33',
    opacity: 0.5,
  },
});