import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Lock, 
  CheckCircle2, 
  Info, 
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Activity,
  Headset
} from 'lucide-react';

interface CheckoutProps {
  plan: {
    name: string;
    price: string;
    features: string[];
  };
  onBack: () => void;
  onComplete: () => void;
}
import { useLanguage } from '../../contexts/LanguageContext';

export default function Checkout({ plan, onBack, onComplete }: CheckoutProps) {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 2000);
  };

  const subtotal = parseFloat(plan.price.replace('$', '')) || 0;
  const tax = subtotal * 0.085;
  const total = subtotal + tax;

  return (
    <div className="w-full min-h-screen bg-background text-on-background relative overflow-hidden flex flex-col pt-24 pb-12">
      {/* Ambient background glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col lg:flex-row gap-12 items-start justify-center">
        {/* Left Column: Form */}
        <section className="w-full lg:w-7/12 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-4 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('checkout.back')}
            </button>
            <h1 className="text-4xl font-display font-black text-on-surface tracking-tight">{t('checkout.title')}</h1>
            <p className="text-on-surface-variant font-medium">{t('checkout.subtitle')}</p>
          </div>

          {/* Method Selector */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{t('checkout.method')}</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all relative overflow-hidden ${
                  paymentMethod === 'card' 
                    ? 'border-primary bg-surface-container-high' 
                    : 'border-outline-variant/30 bg-surface-container-low/50 opacity-60 hover:opacity-100'
                }`}
              >
                <AnimatePresence>
                  {paymentMethod === 'card' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 text-primary"
                    >
                      <CheckCircle2 className="w-5 h-5 fill-primary/10" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <CreditCard className={`w-8 h-8 mb-3 ${paymentMethod === 'card' ? 'text-primary' : 'text-on-surface-variant'}`} />
                <span className={`text-xs font-black uppercase tracking-widest ${paymentMethod === 'card' ? 'text-on-surface' : 'text-on-surface-variant'}`}>{t('checkout.card')}</span>
              </button>

              <button 
                onClick={() => setPaymentMethod('wallet')}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all relative overflow-hidden ${
                  paymentMethod === 'wallet' 
                    ? 'border-primary bg-surface-container-high' 
                    : 'border-outline-variant/30 bg-surface-container-low/50 opacity-60 hover:opacity-100'
                }`}
              >
                <AnimatePresence>
                  {paymentMethod === 'wallet' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 text-primary"
                    >
                      <CheckCircle2 className="w-5 h-5 fill-primary/10" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <Wallet className={`w-8 h-8 mb-3 ${paymentMethod === 'wallet' ? 'text-primary' : 'text-on-surface-variant'}`} />
                <span className={`text-xs font-black uppercase tracking-widest ${paymentMethod === 'wallet' ? 'text-on-surface' : 'text-on-surface-variant'}`}>{t('checkout.wallet')}</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <motion.form 
            layout
            onSubmit={handlePayment}
            className="bg-surface-container-low/60 backdrop-blur-md rounded-[32px] border border-outline-variant/30 p-8 flex flex-col gap-6 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 bg-secondary/5 border-b border-l border-outline-variant/30 rounded-bl-3xl px-4 py-1.5 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{t('checkout.encryption')}</span>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{t('checkout.cardholder')}</label>
              <input required className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-2xl p-4 text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium" placeholder={t('checkout.cardholder_placeholder')} type="text"/>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{t('checkout.card_number')}</label>
              <div className="relative w-full">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
                <input required className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-display font-black tracking-[0.2em]" placeholder="0000 0000 0000 0000" type="text"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{t('checkout.expiry')}</label>
                <input required className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-2xl p-4 text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium" placeholder="MM/YY" type="text"/>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex justify-between items-center text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                  CVV
                  <Info className="w-3.5 h-3.5 opacity-40 cursor-help" />
                </label>
                <input required className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-2xl p-4 text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium" placeholder="123" type="password" maxLength={4}/>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-2 bg-surface/50 p-4 rounded-2xl border border-outline-variant/10">
              <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
              <p className="text-[10px] font-medium text-on-surface-variant leading-relaxed">
                {t('checkout.security_msg')}
              </p>
            </div>
          </motion.form>
        </section>

        {/* Right Column: Order Summary */}
        <aside className="w-full lg:w-5/12 flex flex-col gap-6 sticky top-24">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="border-b border-outline-variant/10 pb-6 flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{t('checkout.plan_selected')}</span>
                <h2 className="text-3xl font-display font-black text-on-surface uppercase">{plan.name}</h2>
                <span className="text-xs font-medium text-on-surface-variant">{t('checkout.monthly_billing')}</span>
              </div>
              <div className="text-3xl font-display font-black text-on-surface">
                {plan.price}<span className="text-sm opacity-40 tracking-normal font-medium">.00</span>
              </div>
            </div>

            <ul className="flex flex-col gap-4">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs font-medium text-on-surface">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 pt-6 border-t border-outline-variant/10">
              <div className="flex justify-between items-center text-sm font-medium text-on-surface-variant">
                <span>{t('checkout.subtotal')}</span>
                <span>{plan.price}.00</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-on-surface-variant">
                <span>{t('checkout.taxes')}</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end pt-6 border-t border-outline-variant/10">
              <span className="text-xl font-display font-black text-on-surface">{t('checkout.total')}</span>
              <span className="text-4xl font-display font-black text-primary tracking-tight">
                ${total.toFixed(2)}
              </span>
            </div>

            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-5 rounded-2xl font-display font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all ${
                isProcessing 
                  ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed' 
                  : 'bg-primary text-on-primary hover:brightness-110 shadow-primary/20 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                  />
                  {t('checkout.processing')}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {t('checkout.confirm')}
                </>
              )}
            </button>

            <p className="text-[10px] text-on-surface-variant text-center font-medium leading-relaxed opacity-60">
              {t('checkout.terms')} <button className="text-primary hover:underline">{t('checkout.terms_link')}</button> {t('checkout.and')} <button className="text-primary hover:underline">{t('checkout.privacy_link')}</button>.
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 px-8">
            <HeartPulse className="w-5 h-5 text-secondary opacity-40 shrink-0" />
            <p className="text-[10px] font-medium text-on-surface-variant italic leading-normal">
              {t('checkout.social_proof')}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
