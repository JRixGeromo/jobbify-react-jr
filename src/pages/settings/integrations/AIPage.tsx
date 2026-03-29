import React, { useState, useRef, useEffect } from 'react';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import {
  ArrowLeft,
  Bot,
  Send,
  Sparkles,
  Settings,
  Loader,
  Trash2,
  Download,
  Share2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  loading?: boolean;
}

interface Suggestion {
  text: string;
  category: string;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm Foreman, your AI assistant. I can help you analyze your Labor Grid data and answer questions about your business. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  const suggestions: Suggestion[] = [
    { text: "What's my revenue for this month?", category: 'Financial' },
    { text: 'Show me overdue invoices', category: 'Financial' },
    {
      text: "Which clients haven't been contacted in 30 days?",
      category: 'Client Management',
    },
    { text: "What's my average job completion time?", category: 'Operations' },
    { text: 'Show me the most profitable services', category: 'Analytics' },
    { text: 'List upcoming appointments for this week', category: 'Schedule' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      loading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInputValue('');

    // Simulate AI response with typing effect
    setTimeout(() => {
      setMessages((prev) => {
        const response =
          'Based on your Labor Grid data, I can provide the following analysis... [AI response would be generated here based on actual data integration]';
        return prev.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: response, loading: false }
            : msg
        );
      });
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/settings/integrations"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Integrations
        </Link>
        <Breadcrumbs />
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                AI Workbench
              </h1>
              <p className="text-slate-600">
                Analyze your data with Foreman AI
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Chat Interface */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 flex flex-col h-[calc(100vh-12rem)]">
            {/* Chat Header */}
            <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Foreman AI
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="text-sm rounded-lg border border-slate-200 px-3 py-1.5"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5">GPT-3.5</option>
                  </select>
                  <button className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {message.loading ? (
                      <div className="flex items-center gap-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Analyzing data...</span>
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs mt-2 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-purple-100 p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Foreman anything..."
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Suggestions */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Suggestions
            </h3>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputValue(suggestion.text);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-50 group"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <p className="font-medium text-slate-800 group-hover:text-purple-600">
                      {suggestion.text}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 ml-6">
                    {suggestion.category}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-slate-400" />
                  <p className="font-medium text-slate-800">
                    Export Conversation
                  </p>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-slate-400" />
                  <p className="font-medium text-slate-800">Share Analysis</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
