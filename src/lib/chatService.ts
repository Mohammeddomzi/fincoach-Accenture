interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatSettings {
  currency: string;
  locale: string;
}

export class ChatService {
  private static instance: ChatService;
  
  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async sendMessage(
    message: string, 
    settings: ChatSettings = { currency: 'SAR', locale: 'en-SA' }
  ): Promise<string> {
    try {
      // Check if we have an API key configured
      const hasApiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      
      if (!hasApiKey) {
        console.log('No OpenAI API key found, using intelligent fallback responses');
        return this.getIntelligentFallbackResponse(message, settings);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          settings,
          stream: false, // Get complete response
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Chat API error:', response.status, errorText);
        
        // Check if it's an API key error
        if (response.status === 500 && errorText.includes('API key')) {
          return this.getIntelligentFallbackResponse(message, settings);
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.content || 'Sorry, I could not process your request.';
    } catch (error) {
      console.error('Chat API error:', error);
      return this.getIntelligentFallbackResponse(message, settings);
    }
  }

  private getIntelligentFallbackResponse(message: string, settings: ChatSettings): string {
    const lowerMessage = message.toLowerCase();
    const currency = settings.currency;
    
    // Budget-related questions
    if (lowerMessage.includes('budget') || lowerMessage.includes('spending') || lowerMessage.includes('expense')) {
      return `Here's how to manage your ${currency} budget effectively:\n\n• Track every expense for 30 days\n• Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings\n• Set monthly spending limits by category\n• Review and adjust your budget weekly\n• Use apps to monitor spending in real-time\n\nStart with tracking current expenses, then create your first budget!`;
    }
    
    // Savings questions
    if (lowerMessage.includes('save') || lowerMessage.includes('emergency') || lowerMessage.includes('fund')) {
      return `Building your ${currency} savings strategy:\n\n• Emergency fund: 3-6 months of expenses\n• Start with ${currency} 500-1000 as initial goal\n• Automate transfers to savings account\n• Use high-yield savings accounts\n• Create separate funds for different goals\n\nEven ${currency} 50/month adds up to ${currency} 600/year!`;
    }
    
    // Debt questions
    if (lowerMessage.includes('debt') || lowerMessage.includes('loan') || lowerMessage.includes('credit')) {
      return `Debt management in ${currency}:\n\n• List all debts with interest rates\n• Pay minimums on all, extra on highest rate\n• Consider debt consolidation if rates are high\n• Avoid new debt while paying existing\n• Snowball method: pay smallest debt first for motivation\n\nEvery ${currency} 100 extra payment saves significant interest over time!`;
    }
    
    // Investment questions
    if (lowerMessage.includes('invest') || lowerMessage.includes('stock') || lowerMessage.includes('portfolio')) {
      return `Investment basics for ${currency}:\n\n• Start with employer retirement matching\n• Consider low-cost index funds\n• Diversify across different asset classes\n• Invest regularly (dollar-cost averaging)\n• Keep 6+ months emergency fund before investing\n\n*This is general advice. Consult a financial advisor for personalized guidance.*`;
    }
    
    // Goal setting
    if (lowerMessage.includes('goal') || lowerMessage.includes('target') || lowerMessage.includes('plan')) {
      return `Setting smart financial goals with ${currency}:\n\n• Make goals SMART: Specific, Measurable, Achievable, Relevant, Time-bound\n• Start with short-term goals (3-6 months)\n• Break large goals into smaller milestones\n• Track progress monthly\n• Celebrate small wins to stay motivated\n\nExample: "Save ${currency} 5000 for vacation by December"`;
    }
    
    // General financial advice
    if (lowerMessage.includes('help') || lowerMessage.includes('advice') || lowerMessage.includes('tips')) {
      return `Your ${currency} financial wellness roadmap:\n\n• Build emergency fund (3-6 months expenses)\n• Track all income and expenses\n• Pay off high-interest debt\n• Automate savings and bill payments\n• Review finances monthly\n• Set clear financial goals\n• Invest for long-term growth\n\nStart with one step and build momentum!`;
    }
    
    // Default response
    return `I'm here to help with your ${currency} financial journey! Here are key areas to focus on:\n\n• Emergency fund: 3-6 months expenses\n• Budget tracking: Know where every ${currency} goes\n• Debt reduction: Pay off high-interest debt first\n• Savings automation: Set up automatic transfers\n• Goal setting: Make specific, time-bound financial goals\n\nWhat specific area would you like help with?`;
  }

  async sendStreamingMessage(
    message: string,
    settings: ChatSettings = { currency: 'SAR', locale: 'en-SA' },
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          settings,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.trim()) {
            onChunk(line);
          }
        }
      }
    } catch (error) {
      console.error('Streaming chat error:', error);
      onError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  generateMessageId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  createMessage(text: string, isUser: boolean): ChatMessage {
    return {
      id: this.generateMessageId(),
      text,
      isUser,
      timestamp: new Date().toISOString(),
    };
  }
}
