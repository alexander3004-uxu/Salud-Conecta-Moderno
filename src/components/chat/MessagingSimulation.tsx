import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MoreVertical, 
  Users, 
  Disc, 
  MessageSquare, 
  Lock, 
  CheckCircle2, 
  Stethoscope, 
  Calendar, 
  MapPin, 
  Info,
  ExternalLink,
  ChevronLeft,
  Smile,
  Paperclip,
  Mic,
  BadgeCheck,
  Check,
  X
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MessagingSimulation() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  return (
    <div className="flex-grow flex h-full bg-[#0B141A] text-[#DAE2FD] font-sans selection:bg-[#00A884]/30">
      {/* Sidebar (Contacts List) */}
      <aside className="w-1/3 hidden lg:flex flex-col border-r border-[#222D34] bg-[#111B21] shrink-0">
        {/* Sidebar Header */}
        <header className="bg-[#202C33] h-[59px] px-4 flex items-center justify-between shrink-0 border-b border-[#222D34]">
          <div className="flex items-center gap-3 text-[#8696A0]">
            <div className="w-10 h-10 rounded-full bg-[#2A3942] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="flex gap-6 text-[#8696A0]">
            <Users className="w-5 h-5 cursor-pointer hover:text-[#DAE2FD] transition-colors" />
            <Disc className="w-5 h-5 cursor-pointer hover:text-[#DAE2FD] transition-colors" />
            <MessageSquare className="w-5 h-5 cursor-pointer hover:text-[#DAE2FD] transition-colors" />
            <MoreVertical className="w-5 h-5 cursor-pointer hover:text-[#DAE2FD] transition-colors" />
          </div>
        </header>

        {/* Search Bar */}
        <div className="p-3 border-b border-[#222D34]">
          <div className="bg-[#202C33] rounded-lg flex items-center px-3 py-1.5 gap-3">
            <Search className="text-[#8696A0] w-4 h-4" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none text-sm text-[#DAE2FD] focus:ring-0 w-full placeholder-[#8696A0] p-0" 
              placeholder={t('chat.simulation.search')} 
              type="text"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {/* Active Chat Item */}
          <div className="flex items-center px-4 py-3 hover:bg-[#202C33] cursor-pointer bg-[#2A3942] transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center mr-4 shrink-0 border border-[#404753] overflow-hidden">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Stethoscope className="text-primary w-6 h-6" />
              </div>
            </div>
            <div className="flex-1 border-b border-[#222D34] pb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-base text-[#DAE2FD]">{t('chat.simulation.name')}</span>
                <span className="text-[10px] text-[#00A884] font-medium tracking-tighter">10:42 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#8696A0] truncate w-[80%] flex items-center gap-1">
                  🏥 {t('chat.simulation.subject')}
                </span>
                <div className="bg-[#00A884] text-[#111B21] text-[10px] font-black rounded-full w-[18px] h-[18px] flex items-center justify-center">1</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full bg-[#0B141A] relative shadow-2xl">
        {/* Chat Header */}
        <header className="bg-[#202C33] h-[59px] px-4 flex items-center justify-between shrink-0 z-10 border-b border-[#222D34] shadow-sm">
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center overflow-hidden border border-outline-variant/30">
               <Stethoscope className="text-primary w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-base text-[#DAE2FD]">{t('chat.simulation.name')}</h2>
                <BadgeCheck className="w-4 h-4 text-[#00A884] fill-[#00A884]/20" />
              </div>
              <p className="text-[11px] font-bold text-[#8696A0] uppercase tracking-widest">{t('chat.simulation.official')}</p>
            </div>
          </div>
          <div className="flex gap-6 text-[#8696A0]">
            <Search className="w-5 h-5 cursor-pointer hover:text-[#DAE2FD] transition-colors" />
            <MoreVertical className="w-5 h-5 cursor-pointer hover:text-[#DAE2FD] transition-colors" />
          </div>
        </header>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-3 custom-scrollbar wa-chat-bg">
          {/* Date Chip */}
          <div className="flex justify-center mb-4">
            <span className="bg-[#182229] text-[#8696A0] text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-sm border border-[#222D34]">{t('chat.simulation.today')}</span>
          </div>

          {/* Security Banner */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#182229]/80 backdrop-blur-sm text-[#FFD279] text-[11px] px-4 py-3 rounded-xl max-w-[90%] md:max-w-[70%] text-center shadow-sm flex items-start gap-3 border border-[#FFD279]/10">
              <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{t('chat.simulation.security_msg')}</p>
            </div>
          </div>

          {/* Official Message Bubble */}
          <div className="flex mb-4 group">
            <div className="bg-[#202C33] rounded-2xl md:rounded-tl-none p-0 max-w-[95%] md:max-w-[450px] shadow-lg relative overflow-hidden flex flex-col border border-[#404753]/30">
               {/* Header Branding in Bubble */}
               <div className="bg-[#222D34] px-4 py-3 flex items-center gap-3 border-b border-[#404753]/20">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Stethoscope className="text-primary w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[#DAE2FD] leading-tight">{t('chat.simulation.name')}</h3>
                  <p className="text-[10px] text-[#8696A0] font-medium">{t('chat.simulation.message_title')}</p>
                </div>
              </div>

              {/* Message Content */}
              <div className="px-4 py-4 text-sm text-[#DAE2FD] leading-relaxed">
                <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('chat.simulation.message_body') }}></p>
                
                {/* Details Block */}
                <div className="bg-[#182229] rounded-xl border border-[#404753]/20 p-4 mb-4 flex flex-col gap-3 shadow-inner">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                    <div>
                      <span className="text-[10px] font-bold text-[#8696A0] uppercase tracking-wider block mb-0.5">{t('chat.simulation.specialist')}</span>
                      <strong className="text-sm font-bold text-[#DAE2FD]">{t('chat.simulation.dr_name')}</strong>
                      <p className="text-[11px] text-[#8696A0]">{t('chat.simulation.dr_specialty')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-secondary shrink-0 mt-1" />
                    <div>
                      <span className="text-[10px] font-bold text-[#8696A0] uppercase tracking-wider block mb-0.5">{t('chat.simulation.datetime')}</span>
                      <strong className="text-sm font-bold text-[#DAE2FD]">{t('chat.simulation.date')}</strong>
                      <p className="text-[11px] text-[#8696A0]">{t('chat.simulation.time')}</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <div className="flex items-start gap-4 bg-[#182229] p-4 rounded-xl border border-primary/10">
                    <MapPin className="text-[#00A884] w-6 h-6 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-[#8696A0] uppercase tracking-wider block mb-1">{t('chat.simulation.location_label')}</span>
                      <p className="text-[#DAE2FD] font-medium leading-snug mb-2">{t('chat.simulation.location')}</p>
                      <a className="text-[#3192FC] text-xs font-bold hover:underline flex items-center gap-1.5" href="#">
                        {t('chat.simulation.open_maps')} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Instructions Alert */}
                <div className="mb-4 border-l-[3px] border-[#F04438] bg-[#F04438]/5 p-4 rounded-r-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="text-[#F04438] w-4 h-4" />
                    <strong className="text-[#F04438] text-[11px] font-black uppercase tracking-widest">{t('chat.simulation.important_instructions')}</strong>
                  </div>
                  <ul className="list-disc list-inside text-[#C0C7D5] text-xs space-y-1.5 decoration-[#F04438]/30">
                    <li dangerouslySetInnerHTML={{ __html: t('chat.simulation.instruction1') }}></li>
                    <li dangerouslySetInnerHTML={{ __html: t('chat.simulation.instruction2') }}></li>
                    <li dangerouslySetInnerHTML={{ __html: t('chat.simulation.instruction3') }}></li>
                  </ul>
                </div>

                <p className="text-xs text-[#8696A0] mb-2 font-medium">{t('chat.simulation.confirm_prompt')}</p>
                
                {/* Timestamp */}
                <div className="flex justify-end">
                  <span className="text-[10px] text-[#8696A0] font-medium tracking-tighter">10:42 AM</span>
                </div>
              </div>

              {/* Interactive Buttons */}
              <div className="border-t border-[#404753]/20 flex flex-col bg-[#222D34]/30 backdrop-blur-md">
                <button className="w-full py-3.5 text-[#3192FC] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#2A3942] transition-colors border-b border-[#404753]/20 active:scale-[0.98]">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('chat.simulation.btn_confirm')}
                </button>
                <button className="w-full py-3.5 text-[#F04438] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#2A3942] transition-colors active:scale-[0.98]">
                  <X className="w-4 h-4" />
                  {t('chat.simulation.btn_cancel')}
                </button>
              </div>
            </div>
          </div>

          {/* User Response Bubble */}
          <div className="flex justify-end mb-4 animate-in slide-in-from-right duration-500 delay-700 fill-mode-both">
            <div className="bg-[#005C4B] rounded-2xl rounded-tr-none py-2 px-3 md:px-4 max-w-[85%] shadow-lg relative border border-[#00A884]/10">
              <p className="text-sm text-[#E9EDEF] inline-block mr-12 leading-relaxed">{t('chat.simulation.user_reply')}</p>
              <div className="text-[10px] text-[#8696A0] absolute bottom-1.5 right-2 flex items-center gap-1 font-medium tracking-tighter">
                10:45 AM
                <div className="flex -space-x-1 translate-y-[1px]">
                  <Check className="w-3 h-3 text-[#53BDEB] stroke-[3]" />
                  <Check className="w-3 h-3 text-[#53BDEB] stroke-[3]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input Area */}
        <footer className="bg-[#202C33] min-h-[62px] px-4 py-2.5 flex items-end gap-3 shrink-0 z-10 border-t border-[#222D34]">
          <button className="text-[#8696A0] hover:text-[#DAE2FD] p-2 rounded-full transition-colors mb-0.5">
            <Smile className="w-6 h-6" />
          </button>
          <button className="text-[#8696A0] hover:text-[#DAE2FD] p-2 rounded-full transition-colors mb-0.5 rotate-45">
            <Paperclip className="w-6 h-6" />
          </button>
          <div className="flex-1 bg-[#2A3942] rounded-xl border border-[#404753]/20 min-h-[42px] flex items-center px-4 py-1.5 shadow-inner">
            <input 
              readOnly
              className="w-full bg-transparent border-none text-sm md:text-base text-[#DAE2FD] focus:ring-0 placeholder-[#8696A0] p-0" 
              placeholder={t('chat.simulation.input_placeholder')} 
              type="text"
            />
          </div>
          <button className="text-[#8696A0] hover:text-[#DAE2FD] p-2 rounded-full transition-colors mb-0.5">
            <Mic className="w-6 h-6" />
          </button>
        </footer>
      </main>

      <style>{`
        .wa-chat-bg {
          background-color: #0b141a;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50l50-50M0 100l50-50M100 100L0 0' stroke='rgba(255,255,255,0.03)' stroke-width='2' fill='none' /%3E%3C/svg%3E");
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374045;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
