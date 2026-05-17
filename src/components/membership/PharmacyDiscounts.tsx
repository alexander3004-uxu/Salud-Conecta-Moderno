import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Search, 
  QrCode, 
  Star, 
  Ticket, 
  Heart, 
  ShoppingBag, 
  Copy, 
  MapPin, 
  ArrowRight,
  Store,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function PharmacyDiscounts() {
  const { t } = useLanguage();
  const coupons = [
    {
      type: t('pharmacy.card_chronic'),
      discount: '30% OFF',
      desc: t('pharmacy.card_chronic_desc'),
      icon: Heart,
      color: 'primary',
      timer: '04:22:15'
    },
    {
      type: t('pharmacy.card_general'),
      discount: '15% OFF',
      desc: t('pharmacy.card_general_desc'),
      icon: ShoppingBag,
      color: 'secondary'
    }
  ];

  const pharmacies = [
    { name: 'Farmacia Central', dist: '0.5 km', address: 'Av. Principal 123', status: 'Abierto', type: 'secondary' },
    { name: 'FarmaSalud 24h', dist: '1.2 km', address: 'Calle Norte 45', status: '24 Horas', type: 'primary' },
    { name: 'Botica San Juan', dist: '2.8 km', address: 'Plaza Sur 88', status: 'Cierra 20:00', type: 'outline' },
  ];

  return (
    <div className="w-full flex-grow flex flex-col gap-12 py-8 px-4 md:px-0">
      {/* Header Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest rounded-full border border-primary/20"
          >
            <Star className="w-3 h-3 fill-primary" />
            {t('pharmacy.badge')}
          </motion.span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-on-surface">{t('pharmacy.title')}</h1>
        <p className="text-lg text-on-surface-variant max-w-3xl font-medium">
          {t('pharmacy.subtitle')}
        </p>
      </section>

      {/* Medication Search */}
      <section className="w-full relative">
        <div className="flex items-center bg-surface-container-low p-2 rounded-2xl border border-outline-variant/30 focus-within:border-primary transition-all shadow-lg">
          <Search className="w-5 h-5 text-on-surface-variant ml-4 mr-3" />
          <input 
            className="flex-grow bg-transparent border-none text-on-surface font-medium placeholder:text-outline-variant focus:ring-0" 
            placeholder={t('pharmacy.search_placeholder')} 
            type="text"
          />
          <button className="hidden sm:flex items-center gap-2 px-4 py-3 bg-surface-container-highest rounded-xl text-on-surface hover:bg-primary hover:text-on-primary transition-all font-display font-black text-[10px] uppercase tracking-widest border border-outline-variant/20 ml-2">
            <QrCode className="w-4 h-4" />
            {t('pharmacy.scan_prescription')}
          </button>
        </div>
      </section>

      {/* Active Coupons */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Ticket className="w-6 h-6 text-secondary" />
          <h2 className="text-xl font-display font-black text-on-surface">{t('pharmacy.my_coupons')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`relative overflow-hidden rounded-[32px] bg-surface-container-low border ${coupon.timer ? 'border-primary' : 'border-outline-variant/30'} p-8 flex flex-col justify-between min-h-[220px] shadow-sm group`}
            >
              <div className={`absolute -right-8 -top-8 w-40 h-40 ${coupon.color === 'primary' ? 'bg-primary' : 'bg-secondary'}/5 rounded-full blur-[60px] pointer-events-none group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="z-10 flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${coupon.color === 'primary' ? 'text-primary' : 'text-secondary'}`}>
                    {coupon.type}
                  </span>
                  <h3 className="text-5xl font-display font-black text-on-surface">{coupon.discount}</h3>
                  <p className="text-xs font-medium text-on-surface-variant mt-2">{coupon.desc}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${coupon.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'} flex items-center justify-center`}>
                  <coupon.icon className="w-6 h-6" />
                </div>
              </div>

              <div className="z-10 flex flex-col gap-4 mt-auto">
                {coupon.timer && (
                  <div className="flex items-center gap-2 text-tertiary bg-tertiary/10 w-fit px-3 py-1 rounded-xl border border-tertiary/20">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('pharmacy.expires_in')}: {coupon.timer}</span>
                  </div>
                )}
                <div className="flex gap-3">
                  <button className={`flex-1 ${coupon.color === 'primary' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'} py-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2`}>
                    <QrCode className="w-4 h-4" />
                    {t('pharmacy.qr_code')}
                  </button>
                  <button className="w-14 h-14 border-2 border-outline-variant/30 rounded-2xl flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-all">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Verified Pharmacies */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-display font-black text-on-surface">{t('pharmacy.verified_title')}</h2>
          </div>
          <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
            {t('pharmacy.view_all')}
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2 h-80 rounded-[32px] overflow-hidden border border-outline-variant/30 relative bg-surface-container-low shadow-sm group">
            <div 
              className="absolute inset-0 opacity-40 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-700 bg-cover bg-center"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnXWi1_KJXXcxGbulhn6FDLJCHtG2-sJGAWYEV05rtiOlnkhVRuYB4ph8vXl8i7JRz4Jh3xGJwZO0OQ73GkUSui9I-8VXKVxIo6p9KNctnWJj6vl6dXjlVoeToUgKYHMufid2P27Xf1MsUUpOuD_hAiv5d7TRLtRliy1D5fbCg13L3okj6bBHNzSc3D5N8JdfduD4qBd13skcH6eUVxnl-2U52PrMPDKaICmhiPEU5eILF04gk5DFZ4lyGxb8A37s05hRZ34HSAw')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Map Pin Example */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none">
              <div className="bg-primary text-on-primary p-2.5 rounded-full shadow-2xl animate-bounce">
                <Store className="w-5 h-5" />
              </div>
              <div className="bg-surface/90 backdrop-blur-md text-on-surface text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-xl border border-outline-variant/30">
                Farmacia Central
              </div>
            </div>
          </div>

          {/* List Container */}
          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {pharmacies.map((pharmacy, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-4 rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 hover:bg-surface-container-high transition-all cursor-pointer group relative overflow-hidden`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${pharmacy.type === 'primary' ? 'bg-primary' : pharmacy.type === 'secondary' ? 'bg-secondary' : 'bg-outline-variant'}`} />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{pharmacy.name}</span>
                  <div className="flex items-center gap-2 text-[10px] font-medium text-on-surface-variant opacity-60 uppercase tracking-widest">
                    <MapPin className="w-3 h-3" />
                    {pharmacy.dist} • {pharmacy.address}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                  pharmacy.status === 'Abierto' ? 'bg-secondary/10 text-secondary' : 
                  pharmacy.status === '24 Horas' ? 'bg-primary/10 text-primary' : 
                  'text-on-surface-variant opacity-60'
                }`}>
                  {pharmacy.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
