import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Info } from 'lucide-react';
import { getHealthAssistant } from '../../lib/gemini';
import { useUser } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface Message { role: 'user' | 'assistant'; content: string; }

export default function Assistant() {
  const { t } = useLanguage();
  const { membership } = useUser();
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: t('chat.assistant.greeting') }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: m.content }]
    }));

    const response = await getHealthAssistant(userMessage, membership, history);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col p-4 md:p-6 bg-surface shadow-sm">
      <div className="flex items-center gap-3 mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary">
          <Bot className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">{t('chat.assistant.title')}</h2>
          <p className="text-sm text-on-surface-variant">{t('chat.assistant.subtitle')}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 custom-scrollbar" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] p-4 rounded-xl shadow-sm border ${message.role === 'assistant' ? 'bg-primary/5 border-primary/10 text-on-surface' : 'bg-surface-container-low border-outline-variant/20 text-on-surface'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {message.role === 'assistant' ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-on-surface-variant" />}
                  <span className="text-xs font-bold uppercase">{message.role === 'assistant' ? t('chat.assistant.role_ai') : t('chat.assistant.role_user')}</span>
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {String(message.content || '').split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < String(message.content || '').split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm font-medium text-primary">{t('chat.assistant.thinking')}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 p-2 bg-surface-container-low rounded-xl border border-outline-variant/20">
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder={t('chat.assistant.input_placeholder')} className="flex-1 p-3 bg-transparent resize-none focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/50" rows={1} />
        <button onClick={handleSend} disabled={isLoading || !input.trim()} className={`p-3 rounded-lg transition-all ${input.trim() && !isLoading ? 'bg-primary text-on-primary hover:bg-primary/90' : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed'}`}>
          <Send className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 text-center text-xs text-on-surface-variant/60">{t('chat.assistant.disclaimer')}</div>
    </div>
  );
}