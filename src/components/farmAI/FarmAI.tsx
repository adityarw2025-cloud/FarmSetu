import React, { useState } from 'react';
import { Bot, Send, User, RefreshCw, HelpCircle } from 'lucide-react';
import type { AIChatMessage } from '../../types';
import { getFarmAIResponse } from '../../services/aiService';

export const FarmAI: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '👋 **Welcome to FarmAI!** I am your AI farming assistant connected with your live farm IoT telemetry, weather forecasts, and marketplace prices. How can I help you optimize your crop yield today?',
      timestamp: 'Just Now'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');

  const suggestedQuestions = [
    'Should I irrigate today?',
    'What does my soil moisture indicate?',
    'What is the weather outlook?',
    'What is the current marketplace trend?'
  ];

  const handleSend = (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim()) return;

    const userMsg: AIChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');

    // Generate assistant response
    setTimeout(() => {
      const aiMsg = getFarmAIResponse(prompt);
      setMessages(prev => [...prev, aiMsg]);
    }, 400);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100vh - 180px)' }}>
      {/* Top Banner */}
      <div className="card" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #0F4C3A 0%, #16A34A 100%)',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
              FarmAI — Your Farming Assistant
            </h2>
            <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>
              Context-aware insights for irrigation, weather, and produce market trends
            </p>
          </div>
        </div>

        <button 
          onClick={() => setMessages([messages[0]])} 
          className="btn btn-sm"
          style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', borderRadius: '20px' }}
        >
          <RefreshCw size={14} /> Clear Chat
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '20px', background: 'white', whiteSpace: 'nowrap' }}
          >
            <HelpCircle size={14} color="#16A34A" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="card" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: '#F8FAFC'
      }}>
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} style={{
              display: 'flex',
              flexDirection: isUser ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isUser ? 'var(--primary)' : '#16A34A',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {isUser ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div style={{
                maxWidth: '75%',
                background: isUser ? 'var(--primary)' : 'white',
                color: isUser ? 'white' : 'var(--text-main)',
                padding: '14px 18px',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                boxShadow: 'var(--shadow-sm)',
                border: isUser ? 'none' : '1px solid var(--surface-border)',
                fontSize: '0.925rem',
                lineHeight: 1.5
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                <div style={{ fontSize: '0.65rem', marginTop: '6px', textAlign: isUser ? 'right' : 'left', opacity: 0.7 }}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input Footer */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="text"
            placeholder="Ask FarmAI about irrigation, soil moisture, weather or produce prices..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="form-input"
            style={{ borderRadius: '24px' }}
          />
          <button type="submit" className="btn btn-emerald" style={{ borderRadius: '24px', padding: '10px 20px' }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
