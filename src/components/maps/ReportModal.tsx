import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, CheckCircle2, MapPin, XCircle, Tag, PlusCircle,
  Loader2, AlertTriangle, ChevronDown
} from 'lucide-react';
import { submitReport, ReportType } from '../../services/facilityReportService';
import { FILTER_OPTIONS, getFilterOptions } from './mapUtils';
import { Clinic } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

// ── Types ──────────────────────────────────────────────────────────────────

interface ReportOption {
  type: ReportType;
  icon: React.ElementType;
  iconColor: string;
  label: string;
  description: string;
  hint?: string;
}

const getReportOptions = (t: any): ReportOption[] => [
  {
    type: 'confirm_correct',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    label: t('maps.report.confirm_correct'),
    description: t('maps.report.confirm_desc'),
  },
  {
    type: 'wrong_location',
    icon: MapPin,
    iconColor: 'text-amber-500',
    label: t('maps.report.wrong_loc'),
    description: t('maps.report.wrong_loc_desc'),
    hint: t('maps.report.wrong_loc_hint'),
  },
  {
    type: 'does_not_exist',
    icon: XCircle,
    iconColor: 'text-red-500',
    label: t('maps.report.not_exist'),
    description: t('maps.report.not_exist_desc'),
  },
  {
    type: 'wrong_type',
    icon: Tag,
    iconColor: 'text-violet-500',
    label: t('maps.report.wrong_type'),
    description: t('maps.report.wrong_type_desc'),
    hint: t('maps.report.wrong_type_hint'),
  },
  {
    type: 'missing_facility',
    icon: PlusCircle,
    iconColor: 'text-blue-500',
    label: t('maps.report.missing'),
    description: t('maps.report.missing_desc'),
  },
];

// ── Component ──────────────────────────────────────────────────────────────

interface ReportModalProps {
  facility: Clinic & { isOpen?: boolean };
  onClose: () => void;
}

type ModalState = 'selecting' | 'filling' | 'sending' | 'success' | 'error';

export const ReportModal: React.FC<ReportModalProps> = ({ facility, onClose }) => {
  const { t } = useLanguage();
  const REPORT_OPTIONS = getReportOptions(t);
  const [selected, setSelected] = useState<ReportOption | null>(null);
  const [description, setDescription] = useState('');
  const [suggestedType, setSuggestedType] = useState('');
  const [modalState, setModalState] = useState<ModalState>('selecting');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectOption = (option: ReportOption) => {
    setSelected(option);
    setModalState('filling');
  };

  const handleBack = () => {
    setSelected(null);
    setDescription('');
    setSuggestedType('');
    setModalState('selecting');
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setModalState('sending');

    const result = await submitReport({
      facilityId: facility.id,
      facilityName: facility.name,
      reportType: selected.type,
      description: description.trim() || undefined,
      suggestedType: selected.type === 'wrong_type' ? suggestedType : undefined,
    });

    if (result.success) {
      setModalState('success');
      setTimeout(onClose, 2500);
    } else {
      setErrorMsg(result.error ?? 'Error desconocido');
      setModalState('error');
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[420px] z-[70] bg-surface rounded-t-3xl md:rounded-3xl shadow-2xl border border-outline-variant/20 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
          <div className="flex-1 min-w-0 mr-3">
            <p className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">
              {t('maps.report.user_report')}
            </p>
            <h3 className="text-sm font-bold text-on-surface truncate">{facility.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-error/10 hover:text-error transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* ── SUCCESS ── */}
          {modalState === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="font-bold text-on-surface">{t('maps.report.sent_title')}</p>
              <p className="text-xs text-on-surface-variant">
                {t('maps.report.sent_desc')}
              </p>
            </motion.div>
          )}

          {/* ── ERROR ── */}
          {modalState === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 py-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-error" />
              </div>
              <p className="text-sm font-bold text-error">{errorMsg}</p>
              <button
                onClick={handleBack}
                className="text-xs text-primary font-bold hover:underline"
              >
                {t('maps.report.try_again')}
              </button>
            </motion.div>
          )}

          {/* ── SELECTING ── */}
          {modalState === 'selecting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-2"
            >
              <p className="text-xs text-on-surface-variant mb-1">{t('maps.report.what_is_problem')}</p>
              {REPORT_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => handleSelectOption(option)}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-outline-variant/20 hover:bg-surface-container-high transition-all text-left group active:scale-[0.98]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className={`w-4.5 h-4.5 ${option.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-on-surface">{option.label}</p>
                      <p className="text-[10px] text-on-surface-variant leading-snug mt-0.5 line-clamp-2">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* ── FILLING ── */}
          {(modalState === 'filling' || modalState === 'sending') && selected && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Selected type recap */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                {React.createElement(selected.icon, {
                  className: `w-5 h-5 ${selected.iconColor} shrink-0`,
                })}
                <div>
                  <p className="text-xs font-bold text-on-surface">{selected.label}</p>
                  {selected.hint && (
                    <p className="text-[10px] text-on-surface-variant">{selected.hint}</p>
                  )}
                </div>
              </div>

              {/* Suggested type selector */}
              {selected.type === 'wrong_type' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">
                    {t('maps.report.correct_type')}
                  </label>
                  <div className="relative">
                    <select
                      value={suggestedType}
                      onChange={e => setSuggestedType(e.target.value)}
                      className="w-full h-11 pl-3 pr-10 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm text-on-surface appearance-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    >
                      <option value="">{t('maps.report.select_type')}</option>
                      {getFilterOptions(t).filter(f => f.value !== 'all').map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">
                  {t('maps.report.additional_comment')} <span className="normal-case font-normal">({t('maps.report.optional')})</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, 200))}
                  placeholder={t('maps.report.comment_placeholder')}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                />
                <span className="text-[10px] text-on-surface-variant text-right">
                  {description.length}/200
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleBack}
                  disabled={modalState === 'sending'}
                  className="flex-1 py-3 bg-surface-container text-on-surface-variant text-xs font-bold rounded-xl hover:bg-surface-container-high transition-all disabled:opacity-50"
                >
                  {t('maps.report.back')}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    modalState === 'sending' ||
                    (selected.type === 'wrong_type' && !suggestedType)
                  }
                  className="flex-2 flex-grow py-3 bg-primary text-on-primary text-xs font-bold rounded-xl hover:brightness-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {modalState === 'sending' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {t('maps.report.sending')}
                    </>
                  ) : (
                    t('maps.report.submit_report')
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
