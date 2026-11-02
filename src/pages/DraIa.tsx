import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSkinProfile } from '../services/firestore/skinProfiles';
import { getUserAnalyses } from '../services/firestore/analyses';
import type { SkinProfile, AnalysisResult } from '../types/database';
import { Sparkles, Send, Bot, User, RefreshCw, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  time: string;
}

const LOCAL_CHAT_KEY = 'tadra_dra_chat_history';

export default function DraIa() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const [userHistory, setUserHistory] = useState<AnalysisResult[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carrega perfil e análises
    const loadContext = async () => {
      try {
        const [profile, analyses] = await Promise.all([
          getSkinProfile(currentUser?.uid),
          getUserAnalyses(currentUser?.uid)
        ]);
        setSkinProfile(profile);
        setUserHistory(analyses);
      } catch (e) {
        console.error("Erro ao carregar contexto para Dra IA:", e);
      }
    };
    loadContext();

    // Carrega histórico de mensagens do cache local
    const saved = localStorage.getItem(LOCAL_CHAT_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {}
    } else {
      // Mensagem de boas-vindas inicial calorosa e feminina
      const initialGreeting: ChatMessage = {
        id: 'welcome_1',
        sender: 'model',
        text: 'Olá, querida! Seja muito bem-vinda ao seu espaço exclusivo de cuidado. ✨ Eu sou a **Dra. TADRA**, sua dermatologista virtual.\n\nEstou pronta para analisar sua rotina, tirar dúvidas sobre ativos e te ajudar a conquistar sua melhor versão de pele. Me conta: o que você gostaria de perguntar hoje? 🌸',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialGreeting]);
      localStorage.setItem(LOCAL_CHAT_KEY, JSON.stringify([initialGreeting]));
    }
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/chat-dra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ sender: m.sender, text: m.text })),
          userProfile: skinProfile,
          userHistory: userHistory
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Erro na comunicação');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'model',
        text: data.reply || 'Estou aqui com você, querida. Poderia reformular sua dúvida? 🌸',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      localStorage.setItem(LOCAL_CHAT_KEY, JSON.stringify(finalMessages));

    } catch (error: any) {
      console.error(error);
      const fallbackMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        sender: 'model',
        text: error.message || 'Muitas pacientes estão tirando dúvidas no momento. Pode me reenviar sua mensagem em instantes, por favor? 🌸',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newMessages, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Deseja iniciar uma nova conversa com a Dra. TADRA?')) {
      localStorage.removeItem(LOCAL_CHAT_KEY);
      const initialGreeting: ChatMessage = {
        id: 'welcome_' + Date.now(),
        sender: 'model',
        text: 'Nova consulta iniciada! 🌸 Como posso te ajudar a cuidar da sua pele agora, querida?',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialGreeting]);
      localStorage.setItem(LOCAL_CHAT_KEY, JSON.stringify([initialGreeting]));
    }
  };

  // Sugestões de perguntas rápidas
  const quickQuestions = [
    'Qual a melhor ordem para aplicar meus produtos?',
    'Posso misturar retinol com ácido hialurônico?',
    'Como cuidar dos poros e da oleosidade sem ressecar?'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-2xl mx-auto w-full px-4 pt-2 pb-24">
      
      {/* Header do Chat */}
      <div className="glass-effect bg-white/5 border border-white/10 rounded-3xl p-3.5 mb-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link to="/app" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-rose-400 p-[2px] shadow-[0_0_15px_theme(colors.primary.500/50%)]">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-rose-300">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold font-jakarta text-white">Dra. TADRA IA</h3>
              <Sparkles className="w-3 h-3 text-primary-400" />
            </div>
            <p className="text-[11px] text-white/50 font-inter">
              {skinProfile ? `Pele ${skinProfile.skinType} • Online` : 'Dermatologia Virtual • Online'}
            </p>
          </div>
        </div>

        <button 
          onClick={clearChat}
          title="Nova consulta"
          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Área de Mensagens com rolagem suave */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollable-content py-2">
        {messages.map((msg) => {
          const isModel = msg.sender === 'model';
          return (
            <div key={msg.id} className={`flex items-end gap-2.5 ${isModel ? 'justify-start' : 'justify-end'}`}>
              {isModel && (
                <div className="w-7 h-7 rounded-xl bg-primary-500/20 text-rose-300 border border-primary-500/30 flex items-center justify-center shrink-0 mb-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-3xl p-4 text-sm font-inter leading-relaxed shadow-sm ${
                isModel 
                  ? 'bg-white/10 border border-white/15 text-white/90 rounded-bl-sm glass-effect' 
                  : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-br-sm shadow-[0_0_20px_theme(colors.primary.500/25%)]'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span className={`text-[10px] block mt-1.5 text-right ${isModel ? 'text-white/40' : 'text-white/70'}`}>
                  {msg.time}
                </span>
              </div>

              {!isModel && (
                <div className="w-7 h-7 rounded-xl bg-white/10 text-white/70 border border-white/15 flex items-center justify-center shrink-0 mb-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-end gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-xl bg-primary-500/20 text-rose-300 border border-primary-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-white/10 border border-white/15 rounded-3xl rounded-bl-sm px-4 py-3 glass-effect flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões Rápidas de Pergunta */}
      {messages.length <= 2 && !loading && (
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollable-content">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => { setInput(q); }}
              className="text-xs text-white/70 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Campo de Envio */}
      <form onSubmit={handleSend} className="mt-2 relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Converse com a Dra. TADRA..."
            className="w-full pl-5 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all font-inter shadow-lg"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 w-9 h-9 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-all disabled:opacity-40 shadow-[0_0_12px_theme(colors.primary.500/50%)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
}
