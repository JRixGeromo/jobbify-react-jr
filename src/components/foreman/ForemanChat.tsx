import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader, HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface Suggestion {
  text: string;
  route: string;
}

const suggestions: Record<string, Suggestion[]> = {
  '/': [
    { text: 'Show me overdue jobs for this week', route: '/' },
    { text: 'Who are our top 5 clients by revenue?', route: '/' },
    { text: "What's our quote conversion rate this month?", route: '/' },
    { text: 'How many unpaid invoices do we have?', route: '/' },
    { text: "What's our total revenue for this month?", route: '/' },
  ],
  '/jobs': [
    { text: 'Which jobs are scheduled for today?', route: '/jobs' },
    {
      text: 'Show me all jobs that are running behind schedule',
      route: '/jobs',
    },
    { text: "What's the average job completion time?", route: '/jobs' },
    { text: 'List all jobs waiting for parts', route: '/jobs' },
    { text: 'Show me jobs with pending client approval', route: '/jobs' },
  ],
  '/clients': [
    { text: 'Who are our most active clients?', route: '/clients' },
    {
      text: "Show me clients we haven't serviced in 3 months",
      route: '/clients',
    },
    { text: 'Which clients have outstanding balances?', route: '/clients' },
    { text: 'List clients with upcoming scheduled jobs', route: '/clients' },
    { text: 'Who are our newest clients this month?', route: '/clients' },
  ],
  '/quotes': [
    { text: "What's our current quote acceptance rate?", route: '/quotes' },
    { text: 'Show me quotes awaiting client response', route: '/quotes' },
    { text: 'List quotes expiring this week', route: '/quotes' },
    { text: "What's our average quote value?", route: '/quotes' },
    { text: 'Which services are most frequently quoted?', route: '/quotes' },
  ],
  '/invoices': [
    { text: 'Show me overdue invoices', route: '/invoices' },
    { text: "What's our average payment time?", route: '/invoices' },
    { text: 'List unpaid invoices over 30 days', route: '/invoices' },
    { text: 'Show me total receivables', route: '/invoices' },
    { text: 'Which clients have pending payments?', route: '/invoices' },
  ],
};

export function ForemanChat() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm Foreman, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSuggestions = suggestions[location.pathname] || suggestions['/'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSubmit(new Event('submit') as any, suggestion);
  };

  const handleSubmit = async (e: React.FormEvent, suggestionText?: string) => {
    e.preventDefault();
    const text = suggestionText || inputValue;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content:
          "I'm analyzing your data to provide the best possible answer. This is a placeholder response - the actual AI integration will be implemented based on your specific requirements.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Chat Launcher */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all z-50 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-xl z-50 transition-all transform ${
          isOpen
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-100 bg-purple-50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-600" />
            <div>
              <h3 className="font-semibold text-slate-800">Foreman</h3>
              <p className="text-xs text-slate-500">AI Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-purple-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500">
              <Loader className="h-4 w-4 animate-spin" />
              <span className="text-sm">Foreman is typing...</span>
            </div>
          )}
          {messages.length === 1 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <HelpCircle className="h-4 w-4" />
                <span>Try asking:</span>
              </div>
              {currentSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="block w-full text-left text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded px-3 py-2 transition-colors"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-purple-100"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Foreman anything..."
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
