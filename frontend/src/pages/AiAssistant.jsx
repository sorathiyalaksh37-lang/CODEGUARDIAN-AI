import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  SparklesIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";
import AnimatedCard from "../components/AnimatedCard";
import GlowButton from "../components/GlowButton";
import TypingIndicator from "../components/TypingIndicator";
import toast from "react-hot-toast";

const AiAssistant = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Welcome to CodeGuardian AI Assistant! 🚀

I'm here to help you with:

• SQL Injection Prevention
• JWT & Authentication Security
• API Protection Strategies
• XSS & CSRF Mitigation
• Secure Coding Best Practices
• Vulnerability Analysis & Fixes
• Node.js Security Patterns
• OWASP Top 10 Security Issues

Ask me anything about security vulnerabilities, and I'll provide professional guidance!`,
    },
  ]);

  const quickPrompts = [
    "How to prevent SQL injection?",
    "Best practices for JWT security",
    "Explain XSS attacks",
    "Secure password hashing",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [question]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  const askAI = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/api/ai/chat",
        { question: currentQuestion },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiMessage = {
        role: "assistant",
        content: res.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try asking your question again.",
        },
      ]);
      toast.error("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const useQuickPrompt = (prompt) => {
    setQuestion(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl"
      >
        <div className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50"
            >
              <SparklesIcon className="w-7 h-7 text-white" />
            </motion.div>

            <div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                AI Security Assistant
              </h1>
              <p className="text-zinc-500 text-sm">
                Powered by Advanced AI • Real-time Responses
              </p>
            </div>
          </div>

          <GlowButton
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            icon={<ArrowLeftIcon />}
          >
            <span className="hidden md:inline">Dashboard</span>
          </GlowButton>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-3xl rounded-2xl px-5 py-4 shadow-xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "bg-zinc-900/80 backdrop-blur-xl border border-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {msg.role === "user" ? (
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <p className="font-bold text-sm">
                      {msg.role === "user" ? "You" : "CodeGuardian AI"}
                    </p>
                  </div>

                  <div
                    className={`prose prose-sm max-w-none ${
                      msg.role === "user" ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl px-5 py-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-sm text-zinc-400">CodeGuardian AI</p>
                  <TypingIndicator />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts (show when no user messages yet) */}
      {messages.length === 1 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pb-4"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-zinc-500 mb-3">💡 Quick Questions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickPrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => useQuickPrompt(prompt)}
                  className="text-left px-4 py-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-green-500/50 rounded-xl transition-all text-sm text-zinc-400 hover:text-white"
                >
                  <CommandLineIcon className="w-4 h-4 inline mr-2 text-green-400" />
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-xl px-4 md:px-6 py-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl flex items-end p-2 gap-2 focus-within:border-green-500/50 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me about security vulnerabilities..."
              className="flex-1 bg-transparent resize-none outline-none text-white px-3 py-3 text-[15px] max-h-[150px] overflow-y-auto"
              style={{ minHeight: '24px' }}
            />

            <motion.button
              onClick={askAI}
              disabled={loading || !question.trim()}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
            >
              <PaperAirplaneIcon className="w-5 h-5 text-white" />
            </motion.button>
          </div>
          
          <p className="text-center text-xs text-zinc-600 mt-3">
            Press <kbd className="px-2 py-0.5 bg-zinc-800 rounded">Enter</kbd> to send • 
            <kbd className="px-2 py-0.5 bg-zinc-800 rounded ml-1">Shift + Enter</kbd> for new line
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AiAssistant;
