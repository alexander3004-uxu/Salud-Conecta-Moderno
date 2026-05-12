import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Info } from 'lucide-react';
import { getHealthAssistant } from '../../lib/gemini';
import { useUser } from '../../contexts/UserContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Assistant() {
  const { membership } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hola, soy tu asistente de Salud Conecta IA. ¿En qué puedo ayudarte hoy? Mi misión es facilitarte el acceso a la salud, especialmente a través de la Red Pública (MINSA) si lo necesitas.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await getHealthAssistant(userMessage, membership, history);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col p-4 md:p-6 bg-white shadow-sm border-x border-outline-variant">
      <div className="flex items-center gap-3 mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
          <Bot className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">Asistente IA</h2>
          <p className="text-sm text-on-surface-variant">Empático y Eficiente • Disponible 24/7</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 custom-scrollbar" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-xl shadow-sm border ${
                  message.role === 'assistant'
                    ? 'bg-primary/5 border-primary/10 text-on-surface rounded-tl-none'
                    : 'bg-white border-outline-variant text-on-surface rounded-tr-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.role === 'assistant' ? (
                    <Bot className="w-4 h-4 text-primary" />
                  ) : (
                    <User className="w-4 h-4 text-on-surface-variant" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    {message.role === 'assistant' ? 'Salud Conecta IA' : 'Tú'}
                  </span>
                </div>
                <div className="text-body-md whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl rounded-tl-none flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm font-medium text-primary">Pensando...</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-2 p-2 bg-surface-container rounded-xl border border-outline-variant">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Escribe tu consulta aquí..."
          className="flex-1 p-3 bg-transparent resize-none focus:outline-none text-body-md"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className={`p-3 rounded-lg transition-all ${
            input.trim() && !isLoading
              ? 'bg-primary text-white shadow-md hover:bg-primary-container'
              : 'bg-outline-variant text-white cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-[10px] text-on-surface-variant/60 uppercase font-bold tracking-widest justify-center">
        <Info className="w-3 h-3" />
        La IA puede cometer errores. Considera verificar la información importante.
      </div>
    </div>
  );
}
