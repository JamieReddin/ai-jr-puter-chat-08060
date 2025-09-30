import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Paintbrush, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TypingIndicator } from './TypingIndicator';
import { ModelSelector } from './ModelSelector';
import { SettingsDialog } from './SettingsDialog';
import { TokenUsageBar } from './TokenUsageBar';
import { ALL_MODEL_VALUES } from '@/data/models';
import { useToast } from '@/hooks/use-toast';

// Declare puter as a global variable
declare global {
  interface Window {
    puter: any;
  }
}
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  model?: string;
}
const MODELS_DATA = {
  "OpenAI": {
    "GPT-5 Series": [{
      value: 'gpt-5-2025-08-07',
      label: 'GPT-5 (2025-08-07)',
      description: 'Latest flagship model'
    }, {
      value: 'gpt-5',
      label: 'GPT-5',
      description: 'Flagship model'
    }, {
      value: 'gpt-5-mini-2025-08-07',
      label: 'GPT-5 Mini (2025-08-07)',
      description: 'Efficient version'
    }, {
      value: 'gpt-5-mini',
      label: 'GPT-5 Mini',
      description: 'Cost-effective'
    }, {
      value: 'gpt-5-nano-2025-08-07',
      label: 'GPT-5 Nano (2025-08-07)',
      description: 'Ultra-fast'
    }, {
      value: 'gpt-5-nano',
      label: 'GPT-5 Nano',
      description: 'Fastest model'
    }, {
      value: 'gpt-5-chat-latest',
      label: 'GPT-5 Chat Latest',
      description: 'Latest chat variant'
    }],
    "GPT-4 Series": [{
      value: 'gpt-4o',
      label: 'GPT-4o',
      description: 'Multimodal capabilities'
    }, {
      value: 'gpt-4o-mini',
      label: 'GPT-4o Mini',
      description: 'Faster GPT-4o'
    }, {
      value: 'gpt-4.1',
      label: 'GPT-4.1',
      description: 'Enhanced GPT-4'
    }, {
      value: 'gpt-4.1-mini',
      label: 'GPT-4.1 Mini',
      description: 'Efficient GPT-4.1'
    }, {
      value: 'gpt-4.1-nano',
      label: 'GPT-4.1 Nano',
      description: 'Ultra-fast GPT-4.1'
    }, {
      value: 'gpt-4.5-preview',
      label: 'GPT-4.5 Preview',
      description: 'Next generation preview'
    }],
    "Reasoning Models": [{
      value: 'o1',
      label: 'o1',
      description: 'Advanced reasoning'
    }, {
      value: 'o1-mini',
      label: 'o1 Mini',
      description: 'Efficient reasoning'
    }, {
      value: 'o1-pro',
      label: 'o1 Pro',
      description: 'Professional reasoning'
    }, {
      value: 'o3',
      label: 'o3',
      description: 'Latest reasoning model'
    }, {
      value: 'o3-mini',
      label: 'o3 Mini',
      description: 'Compact reasoning'
    }, {
      value: 'o4-mini',
      label: 'o4 Mini',
      description: 'Next-gen reasoning'
    }]
  },
  "Anthropic": {
    "Claude 4 Series": [{
      value: 'claude-sonnet-4-5-20250929',
      label: 'Claude 4.5 Sonnet (Sep 2025)',
      description: 'Latest flagship'
    }, {
      value: 'claude-sonnet-4.5',
      label: 'Claude 4.5 Sonnet',
      description: 'Advanced reasoning'
    }, {
      value: 'claude-opus-4-1-20250805',
      label: 'Claude Opus 4.1 (Aug 2025)',
      description: 'Most capable'
    }, {
      value: 'claude-opus-4-1',
      label: 'Claude Opus 4.1',
      description: 'Top performance'
    }, {
      value: 'claude-opus-4-20250514',
      label: 'Claude Opus 4 (May 2025)',
      description: 'Flagship model'
    }, {
      value: 'claude-sonnet-4-20250514',
      label: 'Claude Sonnet 4 (May 2025)',
      description: 'Balanced performance'
    }, {
      value: 'claude-sonnet-4',
      label: 'Claude Sonnet 4',
      description: 'Latest Sonnet'
    }],
    "Claude 3 Series": [{
      value: 'claude-3-7-sonnet-20250219',
      label: 'Claude 3.7 Sonnet (Feb 2025)',
      description: 'Enhanced reasoning'
    }, {
      value: 'claude-3-5-sonnet-20241022',
      label: 'Claude 3.5 Sonnet (Oct 2024)',
      description: 'Popular choice'
    }, {
      value: 'claude-3-5-sonnet-latest',
      label: 'Claude 3.5 Sonnet Latest',
      description: 'Most recent 3.5'
    }, {
      value: 'claude-3-5-sonnet-20240620',
      label: 'Claude 3.5 Sonnet (Jun 2024)',
      description: 'Stable version'
    }, {
      value: 'claude-3-haiku-20240307',
      label: 'Claude 3 Haiku',
      description: 'Fast and efficient'
    }]
  },
  "Google": {
    "Gemini Series": [{
      value: 'gemini-1.5-flash',
      label: 'Gemini 1.5 Flash',
      description: 'Fast performance'
    }, {
      value: 'gemini-2.0-flash',
      label: 'Gemini 2.0 Flash',
      description: 'Latest generation'
    }]
  },
  "Mistral": {
    "Mistral Models": [{
      value: 'mistral-large-latest',
      label: 'Mistral Large Latest',
      description: 'Most capable'
    }, {
      value: 'mistral-medium-latest',
      label: 'Mistral Medium Latest',
      description: 'Balanced choice'
    }, {
      value: 'mistral-small-latest',
      label: 'Mistral Small Latest',
      description: 'Efficient option'
    }, {
      value: 'ministral-8b-latest',
      label: 'Ministral 8B Latest',
      description: 'Compact model'
    }, {
      value: 'ministral-3b-latest',
      label: 'Ministral 3B Latest',
      description: 'Ultra-compact'
    }, {
      value: 'codestral-latest',
      label: 'Codestral Latest',
      description: 'Code specialist'
    }]
  },
  "DeepSeek": {
    "DeepSeek Models": [{
      value: 'deepseek-chat',
      label: 'DeepSeek Chat',
      description: 'General purpose'
    }, {
      value: 'deepseek-reasoner',
      label: 'DeepSeek Reasoner',
      description: 'Reasoning focused'
    }]
  },
  "xAI": {
    "Grok Series": [{
      value: 'grok-3',
      label: 'Grok 3',
      description: 'Latest Grok model'
    }, {
      value: 'grok-3-fast',
      label: 'Grok 3 Fast',
      description: 'Optimized speed'
    }, {
      value: 'grok-3-mini',
      label: 'Grok 3 Mini',
      description: 'Compact version'
    }, {
      value: 'grok-3-mini-fast',
      label: 'Grok 3 Mini Fast',
      description: 'Ultra-fast'
    }, {
      value: 'grok-2-vision',
      label: 'Grok 2 Vision',
      description: 'Multimodal'
    }, {
      value: 'grok-2',
      label: 'Grok 2',
      description: 'Previous generation'
    }, {
      value: 'grok-beta',
      label: 'Grok Beta',
      description: 'Beta version'
    }, {
      value: 'grok-vision-beta',
      label: 'Grok Vision Beta',
      description: 'Vision beta'
    }]
  }
};

// Flatten all models for easy search
const ALL_MODELS = Object.entries(MODELS_DATA).flatMap(([provider, categories]) => Object.entries(categories).flatMap(([category, models]) => models.map(model => ({
  ...model,
  provider,
  category
}))));
const POPULAR_MODELS = [{
  value: 'gpt-5-nano',
  label: 'GPT-5 Nano',
  provider: 'OpenAI',
  description: 'Fast and efficient'
}, {
  value: 'claude-3-5-sonnet-latest',
  label: 'Claude 3.5 Sonnet',
  provider: 'Anthropic',
  description: 'Popular choice'
}, {
  value: 'gemini-2.0-flash',
  label: 'Gemini 2.0 Flash',
  provider: 'Google',
  description: 'Latest Google model'
}, {
  value: 'grok-3-mini-fast',
  label: 'Grok 3 Mini Fast',
  provider: 'xAI',
  description: 'Ultra-fast reasoning'
}, {
  value: 'mistral-large-latest',
  label: 'Mistral Large',
  provider: 'Mistral',
  description: 'Most capable Mistral'
}, {
  value: 'deepseek-chat',
  label: 'DeepSeek Chat',
  provider: 'DeepSeek',
  description: 'General purpose'
}];
export default function ChatInterface() {
  const [username, setUsername] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-5-nano');
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [enabledModels, setEnabledModels] = useState<string[]>(() => {
    const stored = localStorage.getItem('enabledModels');
    return stored ? JSON.parse(stored) : POPULAR_MODELS.map(m => m.value);
  });
  const [sessionTokens, setSessionTokens] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Check if user is signed in with Puter
    const checkAuth = async () => {
      if (!window.puter) {
        setTimeout(checkAuth, 100);
        return;
      }
      const isSignedIn = await window.puter.auth.isSignedIn();
      if (!isSignedIn) {
        navigate('/auth');
      } else {
        // Get user info from Puter
        try {
          const user = await window.puter.auth.getUser();
          setUsername(user.username || 'User');
        } catch (error) {
          console.error('Error getting user info:', error);
          setUsername('User');
        }
      }
    };
    checkAuth();
  }, [navigate]);

  // Save enabled models to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('enabledModels', JSON.stringify(enabledModels));
  }, [enabledModels]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Estimate token count (rough approximation: 1 token ≈ 4 characters)
  const estimateTokens = (text: string) => Math.ceil(text.length / 4);
  const handleNewChat = () => {
    setMessages([]);
    setSessionTokens(0);
    setInputValue('');
    setIsLoading(false);
    setStreamingMessageId(null);
  };

  // Filter models based on enabled models
  const filteredModelsData = Object.fromEntries(Object.entries(MODELS_DATA).map(([provider, categories]) => [provider, Object.fromEntries(Object.entries(categories).map(([category, models]) => [category, models.filter(model => enabledModels.includes(model.value))]).filter(([, models]) => models.length > 0))]).filter(([, categories]) => Object.keys(categories).length > 0));
  const filteredAllModels = ALL_MODELS.filter(model => enabledModels.includes(model.value));
  const filteredPopularModels = POPULAR_MODELS.filter(model => enabledModels.includes(model.value));
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    const assistantMessageId = generateId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      model: selectedModel
    };
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInputValue('');
    setIsLoading(true);
    setStreamingMessageId(assistantMessageId);

    // Update session tokens
    const messageTokens = estimateTokens(userMessage.content);
    setSessionTokens(prev => prev + messageTokens);
    try {
      // Use puter.ai.chat with streaming
      const response = await window.puter.ai.chat(userMessage.content, {
        model: selectedModel,
        stream: true
      });
      let accumulatedContent = '';
      for await (const part of response) {
        if (part?.text) {
          accumulatedContent += part.text;
          setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? {
            ...msg,
            content: accumulatedContent,
            isStreaming: true
          } : msg));
        }
      }

      // Mark streaming as complete and update session tokens
      setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? {
        ...msg,
        isStreaming: false
      } : msg));

      // Add assistant response tokens to session
      const assistantTokens = estimateTokens(accumulatedContent);
      setSessionTokens(prev => prev + assistantTokens);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? {
        ...msg,
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        isStreaming: false
      } : msg));
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
      inputRef.current?.focus();
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex-none border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col gap-3 p-3 sm:p-4 max-w-6xl mx-auto">
          {/* Top row: Logo and buttons */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <div className="absolute inset-0 blur-sm bg-primary/30 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">JR AI Chat</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {username && <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">@{username}</span>}
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={handleNewChat} title="New Chat">
                <Paintbrush className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <SettingsDialog modelsData={MODELS_DATA} allModels={ALL_MODELS} enabledModels={enabledModels} onEnabledModelsChange={setEnabledModels} allModelValues={ALL_MODEL_VALUES} />
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={async () => {
              await window.puter.auth.signOut();
              navigate('/auth');
              toast({
                title: 'Signed out successfully'
              });
            }}>
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Second row: Model selector */}
          <div className="flex items-center justify-center w-full sm:max-w-md sm:mx-auto">
            <ModelSelector selectedModel={selectedModel} onModelSelect={setSelectedModel} modelsData={filteredModelsData} allModels={filteredAllModels} popularModels={filteredPopularModels} />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Model and timestamp info */}
          {messages.length > 0 && <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <span>Model:</span>
                <Badge variant="secondary">
                  {filteredAllModels.find(m => m.value === selectedModel)?.label || filteredPopularModels.find(m => m.value === selectedModel)?.label || selectedModel}
                </Badge>
              </div>
              <div>
                Started: {messages[0]?.timestamp.toLocaleString()}
              </div>
            </div>}

          {messages.length === 0 && <div className="text-center py-8 sm:py-12 px-4">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 mb-3 sm:mb-4">
                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Start a conversation</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                Ask me anything! I'm powered by advanced AI models.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Explain quantum computing", "Write a story", "Help with coding", "Creative ideas"].map((suggestion, i) => <Button key={i} variant="outline" size="sm" onClick={() => setInputValue(suggestion)} className="text-xs sm:text-sm">
                    {suggestion}
                  </Button>)}
              </div>
            </div>}

          {messages.map(message => <div key={message.id} className={`flex flex-col gap-1 animate-fade-in ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              {message.role === 'assistant' && <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                  <span>{message.model || selectedModel}</span>
                  <span>|</span>
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                </div>}
              <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {message.role === 'assistant' && <div className="flex-none">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  </div>}

                <Card className={`max-w-[85%] sm:max-w-[70%] ${message.role === 'user' ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' : 'bg-card border-border'}`}>
                  <CardContent className="p-3 sm:p-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert text-sm sm:text-base">
                      {message.content || message.isStreaming && <TypingIndicator />}
                    </div>
                    {message.isStreaming && message.content && <div className="mt-2">
                        <div className="inline-block w-2 h-4 bg-current animate-pulse" />
                      </div>}
                  </CardContent>
                </Card>

                {message.role === 'user' && <div className="flex-none">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  </div>}
              </div>
            </div>)}

          {isLoading && streamingMessageId === null && <div className="flex gap-3 animate-fade-in">
              <div className="flex-none">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </div>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <TypingIndicator />
                </CardContent>
              </Card>
            </div>}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-none border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-3 sm:p-4 w-full">
          {/* Token usage indicator */}
          <div className="mb-2 sm:mb-3 w-full overflow-x-auto">
            <TokenUsageBar currentMessageTokens={estimateTokens(inputValue)} sessionTokens={sessionTokens} />
          </div>

          <div className="flex gap-2 sm:gap-3 items-end w-full">
            <div className="flex-1 relative min-w-0">
              <Input ref={inputRef} value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={handleKeyPress} onKeyDown={handleKeyDown} placeholder="Type your message..." className="pr-12 min-h-[44px] sm:min-h-[50px] text-sm sm:text-base resize-none bg-background border-border w-full" disabled={isLoading} autoFocus />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 sm:mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 sm:gap-4">
              <Badge variant="secondary" className="text-xs">
                {messages.length} messages
              </Badge>
            </div>
            <a href="https://developer.puter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-xs">
              Powered by Puter
            </a>
          </div>
        </div>
      </div>
    </div>;
}