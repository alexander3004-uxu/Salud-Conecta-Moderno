import React, { useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { useUser } from '../../contexts/UserContext';
import centrosSaludData from '../../data/centros_salud.json';
import { useLanguage } from '../../contexts/LanguageContext';

import { motion } from 'motion/react';
import { 
  Search as SearchIcon, 
  Stethoscope, 
  Hospital, 
  Store, 
  FlaskConical, 
  Star, 
  MapPin, 
  Calendar,
  PlusSquare,
  Navigation,
  ChevronRight,
  ShieldCheck,
  Activity,
  Building2,
  Lock,
  PhoneCall,
  ExternalLink,
  Heart,
  X as XIcon
} from 'lucide-react';

interface SearchProps {
  onOpenRegistration: (type?: 'doctor' | 'clinic' | 'lab_pharmacy') => void;
}

export default function Search({ onOpenRegistration }: SearchProps) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [locationQuery, setLocationQuery] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState<any | null>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [likedItems, setLikedItems] = React.useState<Record<string, boolean>>({});



  React.useEffect(() => {
    const handleCategory = (e: any) => {
      setActiveCategory(e.detail);
      setCurrentPage(1);
    };
    window.addEventListener('setSearchCategory', handleCategory);
    return () => window.removeEventListener('setSearchCategory', handleCategory);
  }, []);
  const itemsPerPage = 10;
  const { isPremium } = useUser();

  const categories = [
    { id: 'public_health', icon: Building2, label: t('search.cat_public'), isPublic: true },
    { id: 'doctor', icon: Stethoscope, label: t('search.cat_doctors') },
    { id: 'clinic', icon: Hospital, label: t('search.cat_clinics') },
    { id: 'pharmacy', icon: Store, label: t('search.cat_pharmacies') },
    { id: 'lab', icon: FlaskConical, label: t('search.cat_labs') }
  ];

  const publicItems = useMemo(() => {
    return centrosSaludData.map((item: any, index: number) => {
        const rawType = (item.type || '').toLowerCase();
        return {
          id: `public-${index}`,
          category: 'public_health',
          name: item.name,
          description: item.sector || item.address || 'Institución Pública de Salud',
          image: '',
          rating: 4.5,
          distance: 'Centro MINSA',
          status: rawType.includes('hospital') ? 'Abierto 24h' : 'Horario Regular',
          statusType: 'available',
          services: item.services || ['Atención General'],
          phone: item.phone || '+505 2222-2222',
          address: item.address || 'Nicaragua',
          location: { lat: item.location.lat, lng: item.location.lng }
        };
    });
  }, []);

  const allItems = [
    ...publicItems,
    {
      id: '1',
      category: 'doctor',
      name: 'Dr. Alejandro Martínez',
      description: 'Cardiología Intervencionista',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
      rating: 4.9,
      distance: '2.4 km',
      status: 'Disponible Ahora',
      statusType: 'available',
      services: ['Ecocardiograma', 'Holter', 'Prueba de Esfuerzo'],
      phone: '+505 2278 1283',
      address: 'Pista Juan Pablo II, Managua',
      location: { lat: 12.120, lng: -86.245 }
    },
    {
      id: '2',
      category: 'doctor',
      name: 'Dra. Valentina Silva',
      description: 'Neurología Clínica',
      image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200',
      rating: 4.8,
      distance: '3.1 km',
      status: 'Mañana, 09:00',
      statusType: 'scheduled',
      services: ['Electroencefalograma', 'Mapeo Cerebral'],
      phone: '+505 2265 1400',
      address: 'Pista Suburbana, Managua',
      location: { lat: 12.124, lng: -86.298 }
    },
    {
      id: '3',
      category: 'clinic',
      name: 'Clínica Santa Clara',
      description: 'Políclinico Multidisciplinario',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200',
      rating: 4.7,
      distance: '1.2 km',
      status: 'Abierto 24h',
      statusType: 'available',
      services: ['Rayos X', 'Laboratorio', 'Farmacia 24/7'],
      phone: '+505 2552 2323',
      address: 'Granada, Nicaragua',
      location: { lat: 11.931, lng: -85.954 }
    },
    {
      id: '4',
      category: 'pharmacy',
      name: 'Farmacia San Jorge',
      description: 'Medicamentos y Convenios',
      image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=200',
      rating: 4.5,
      distance: '0.5 km',
      status: 'Cierra a las 22:00',
      statusType: 'limited',
      services: ['Recetario', 'Cosmética', 'Inyectables'],
      phone: '+505 2552 8000',
      address: 'Plaza Central, Granada',
      location: { lat: 11.930, lng: -85.957 }
    },
    {
      id: '5',
      category: 'lab',
      name: 'Laboratorio LabQuest',
      description: 'Análisis Clínicos y Biotecnología',
      image: 'https://images.unsplash.com/photo-1579152276558-9f196a575a7c?auto=format&fit=crop&q=80&w=200',
      rating: 4.6,
      distance: '4.2 km',
      status: 'Resultados en 24h',
      statusType: 'available',
      services: ['Hematología', 'Química Sanguínea', 'Uroanálisis'],
      phone: '+505 2552 1122',
      address: 'Calle La Calzada, Granada',
      location: { lat: 11.929, lng: -85.953 }
    }
  ];

  const topFeaturedItems = React.useMemo(() => {
    return [...allItems].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, [allItems]);

  React.useEffect(() => {
    if (topFeaturedItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % topFeaturedItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [topFeaturedItems.length]);

  const toggleLike = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const filteredItems = (() => {
    let items = activeCategory 
      ? allItems.filter(item => item.category === activeCategory)
      : allItems;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(item => {
        const nameMatch = item.name?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const servicesMatch = item.services?.some(s => s.toLowerCase().includes(q));
        return nameMatch || descMatch || servicesMatch;
      });
    }

    if (locationQuery.trim()) {
      const loc = locationQuery.toLowerCase().trim();
      items = items.filter(item => {
        const descMatch = item.description?.toLowerCase().includes(loc);
        const nameMatch = item.name?.toLowerCase().includes(loc);
        const distMatch = item.distance?.toLowerCase().includes(loc);
        return descMatch || nameMatch || distMatch;
      });
    }

    return items;
  })();

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const featuredItem = paginatedItems[0] || allItems[0];

  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-0">
      {/* Search & Filters Hero */}
      <section className="bg-surface-container border border-outline-variant/30 rounded-3xl p-8 md:p-10 relative overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-2 tracking-tight">
              {t('search.hero_title')}
            </h1>
            <p className="text-on-surface-variant text-base font-medium opacity-70 mb-8">
              {t('search.hero_subtitle')}
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-[2] group/search">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within/search:text-primary transition-colors w-5 h-5" />
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 text-on-surface placeholder-on-surface-variant/50 rounded-xl pl-12 pr-4 py-4 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" 
                placeholder={t('search.search_placeholder')} 
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="relative flex-1 group/location">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within/location:text-primary transition-colors w-5 h-5" />
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 text-on-surface placeholder-on-surface-variant/50 rounded-xl pl-12 pr-4 py-4 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" 
                placeholder={t('search.location_placeholder')} 
                type="text"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Categories Bar */}
      <div className="sticky top-[72px] md:top-[116px] z-30 bg-surface-container/90 backdrop-blur-xl border border-outline-variant/30 rounded-[28px] p-5 shadow-lg flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isLocked = !cat.isPublic && !isPremium;
          return (
            <button 
              key={cat.id}
              onClick={() => {
                if (isLocked) {
                  window.dispatchEvent(new CustomEvent('changeTab', { detail: 'membership' }));
                  return;
                }
                setActiveCategory(activeCategory === cat.id ? null : cat.id);
                setCurrentPage(1);
              }}
              className={`px-5 py-2.5 rounded-full flex items-center gap-2 font-display font-medium text-xs transition-all border ${
                activeCategory === cat.id 
                  ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105' 
                  : isLocked 
                    ? 'bg-surface-container-low text-on-surface-variant/50 border-outline-variant/20 opacity-80'
                    : 'bg-surface-container-high text-on-surface-variant border-outline-variant/40 hover:border-primary/50'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
              {isLocked && <Lock className="w-3 h-3 ml-1" />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column: Results */}
        <div className="flex-1 flex flex-col gap-8">
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-on-surface flex items-center gap-3">
                <Star className="w-6 h-6 text-secondary fill-secondary" />
                {activeCategory 
                  ? `${t('search.results_for')} ${categories.find(c => c.id === activeCategory)?.label}`
                  : t('search.featured_results')
                }
              </h2>
              {activeCategory && (
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {t('search.view_all')}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {paginatedItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ x: 4 }}
                  className="bg-surface-container border border-outline-variant/30 rounded-2xl flex flex-col sm:flex-row overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative"
                >
                  <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative bg-surface-bright flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-secondary/10 text-center absolute inset-0">
                        <span className="text-xs font-display font-bold text-primary leading-tight">
                          {item.name}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                       <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md backdrop-blur-md ${
                        item.statusType === 'available' 
                          ? 'bg-secondary/90 text-on-secondary' 
                          : 'bg-surface-container-highest/90 text-on-surface-variant'
                       }`}>
                         {item.statusType === 'available' && <span className="w-1.5 h-1.5 rounded-full bg-on-secondary animate-pulse"></span>}
                         {item.status}
                       </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-display font-bold text-on-surface leading-tight mb-1">{item.name}</h3>
                          <p className="text-on-surface-variant text-sm line-clamp-2">{item.description}</p>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className="flex items-center text-secondary gap-1 text-sm font-bold bg-secondary/10 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 fill-secondary" /> {item.rating}
                          </span>
                        </div>
                      </div>
                      
                      {item.services && item.services.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.services.slice(0, 3).map((service: string, idx: number) => (
                            <span key={idx} className="text-[10px] font-bold text-primary bg-primary/5 border border-primary/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                              {service}
                            </span>
                          ))}
                          {item.services.length > 3 && (
                            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-md">
                              +{item.services.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20 mt-auto">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
                        <MapPin className="w-4 h-4 text-primary" /> {item.distance}
                      </span>
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="bg-primary text-on-primary hover:brightness-110 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
                      >
                        {item.category === 'doctor' ? t('search.book_appointment') : t('search.view_profile')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-outline-variant/30">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl font-bold text-sm bg-surface-container-high hover:bg-surface-bright disabled:opacity-50 disabled:cursor-not-allowed transition-all text-on-surface flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" /> {t('search.prev')}
                </button>
                <div className="flex gap-2">
                   <span className="text-sm font-medium text-on-surface-variant">
                     {t('search.page')} <strong className="text-on-surface">{currentPage}</strong> {t('search.of')} {totalPages}
                   </span>
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl font-bold text-sm bg-surface-container-high hover:bg-surface-bright disabled:opacity-50 disabled:cursor-not-allowed transition-all text-on-surface flex items-center gap-2"
                >
                  {t('search.next')} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="p-12 text-center bg-surface-container border border-outline-variant/30 rounded-3xl">
                <p className="text-on-surface-variant font-medium">{t('search.no_results')}</p>
              </div>
            )}
          </section>

          {/* Registration Banner */}
          <section className="bg-gradient-to-r from-surface-container to-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex-1 relative z-10 flex flex-col gap-2">
              <h3 className="text-2xl font-display font-bold text-on-surface flex items-center gap-3">
                <PlusSquare className="w-6 h-6 text-primary" />
                {t('search.join_network')}
              </h3>
              <p className="text-on-surface-variant text-base font-medium opacity-70 max-w-md leading-relaxed">
                {t('search.join_desc')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
              <button 
                onClick={() => onOpenRegistration('doctor')}
                className="px-8 py-4 bg-surface-container-highest text-on-surface font-display font-bold text-sm rounded-2xl hover:bg-surface-bright transition-all border border-outline-variant/50 shadow-lg"
              >
                {t('search.join_doctor')}
              </button>
              <button 
                onClick={() => onOpenRegistration('clinic')}
                className="px-8 py-4 bg-primary text-on-primary font-display font-bold text-sm rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-primary/20"
              >
                {t('search.join_clinic')}
              </button>
            </div>
          </section>
        </div>

        {/* Right column: Dynamic & Premium Image Carousel */}
        <aside className="w-full lg:w-[400px] shrink-0 h-[500px] lg:h-[calc(100vh-242px)] lg:sticky lg:top-[222px] rounded-[32px] overflow-hidden border border-outline-variant/30 bg-surface-container relative shadow-2xl flex flex-col group/aside">
          {topFeaturedItems.length > 0 && (
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  {topFeaturedItems[currentSlide].image ? (
                    <img 
                      src={topFeaturedItems[currentSlide].image} 
                      alt={topFeaturedItems[currentSlide].name}
                      className="w-full h-full object-cover select-none"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 to-secondary/20 text-center absolute inset-0">
                      <span className="text-xl font-display font-black text-primary leading-tight">
                        {topFeaturedItems[currentSlide].name}
                      </span>
                    </div>
                  )}
                  {/* Glassmorphic and dark overlays for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/25" />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Carousel UI Elements */}
          {topFeaturedItems.length > 0 && (
            <div className="relative z-10 p-6 flex flex-col h-full justify-between text-white">
              {/* Header inside carousel: Badge and Heart Button */}
              <div className="flex justify-between items-center w-full">
                <span className="bg-primary/95 text-on-primary backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-on-primary text-on-primary animate-pulse" />
                  {t('search.featured_network')}
                </span>
                
                <button 
                  onClick={(e) => toggleLike(topFeaturedItems[currentSlide].id, e)}
                  className={`p-3.5 rounded-full border transition-all shadow-xl active:scale-90 ${
                    likedItems[topFeaturedItems[currentSlide].id] 
                      ? 'bg-red-500 border-red-500 text-white scale-110' 
                      : 'bg-black/35 backdrop-blur-md border-white/20 text-white hover:bg-black/55'
                  }`}
                  title={t('search.save_favorites')}
                >
                  <Heart className={`w-5 h-5 ${likedItems[topFeaturedItems[currentSlide].id] ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Bottom Card details inside carousel */}
              <div className="space-y-5">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentSlide}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl"
                  >
                    <div>
                      {/* Rating star/heart indicators */}
                      <div className="flex justify-between items-center gap-4 mb-2">
                        <span className="flex items-center text-amber-300 gap-1.5 text-xs font-black bg-amber-400/10 border border-amber-300/20 px-2.5 py-1 rounded-md">
                          ★ {topFeaturedItems[currentSlide].rating.toFixed(1)}
                        </span>
                        
                        <span className="text-[10px] font-bold text-red-300 flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                          {Math.round((topFeaturedItems[currentSlide].rating * 14) + (likedItems[topFeaturedItems[currentSlide].id] ? 1 : 0))} {t('search.recommendations')}
                        </span>
                      </div>

                      <h3 className="font-display font-black text-xl leading-tight text-white mb-1.5 drop-shadow">
                        {topFeaturedItems[currentSlide].name}
                      </h3>
                      
                      <p className="text-white/80 text-xs font-medium line-clamp-2">
                        {topFeaturedItems[currentSlide].description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-semibold text-white/70">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{topFeaturedItems[currentSlide].address || t('search.general_location')}</span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const hasCoordinates = !!topFeaturedItems[currentSlide].location;
                          const url = hasCoordinates
                            ? `https://www.google.com/maps/search/?api=1&query=${topFeaturedItems[currentSlide].location.lat},${topFeaturedItems[currentSlide].location.lng}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(topFeaturedItems[currentSlide].name + ', ' + topFeaturedItems[currentSlide].address)}`;
                          window.open(url, '_blank');
                        }}
                        className="flex-1 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {t('search.map')}
                      </button>

                      <button 
                        onClick={() => setSelectedItem(topFeaturedItems[currentSlide])}
                        className="flex-1 py-3 bg-primary text-on-primary hover:brightness-110 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5"
                      >
                        {t('search.details')}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Indicators dots */}
                <div className="flex justify-center gap-2 pt-2">
                  {topFeaturedItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage && setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentSlide 
                          ? 'w-6 bg-primary' 
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      title={`${t('search.view_slide')} ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
      <AnimatePresence>
        {selectedItem && (
          <EstablishmentDetailModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
            likedItems={likedItems}
            onToggleLike={toggleLike}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface DetailModalProps {
  item: any;
  onClose: () => void;
  likedItems: Record<string, boolean>;
  onToggleLike: (itemId: string, e: React.MouseEvent) => void;
}

function EstablishmentDetailModal({ item, onClose, likedItems, onToggleLike }: DetailModalProps) {
  const { t } = useLanguage();
  const isPublic = item.category === 'public_health';
  const hasCoordinates = !!item.location;

  const handleDirections = () => {
    if (hasCoordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${item.location.lat},${item.location.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ', ' + item.address)}`;
      window.open(url, '_blank');
    }
  };

  const handleAction = () => {
    onClose();
    if (item.category === 'doctor') {
      window.dispatchEvent(new CustomEvent('changeTab', { detail: 'appointments' }));
    } else {
      window.dispatchEvent(new CustomEvent('changeTab', { detail: 'appointments' }));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-surface-container border border-outline-variant/30 rounded-[32px] overflow-hidden w-full max-w-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
      >
        {/* Cover Image & Close */}
        <div className="relative h-60 w-full bg-surface-bright shrink-0 flex items-center justify-center overflow-hidden">
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-br from-primary/15 to-secondary/15 text-center absolute inset-0">
              <span className="text-lg font-display font-black text-primary leading-tight max-w-md">
                {item.name}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white hover:bg-black/60 p-2.5 rounded-full transition-all border border-white/20"
          >
            <XIcon className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap gap-2 items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              isPublic 
                ? 'bg-hospital-green text-white' 
                : 'bg-amber-500 text-black'
            }`}>
              {isPublic ? t('search.minsa_network') : t('search.premium_clinic')}
            </span>
            <div className="flex gap-2">
              <span className="flex items-center text-amber-400 gap-1 text-sm font-black bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm">
                ★ {item.rating}
              </span>
              <button 
                onClick={(e) => onToggleLike(item.id, e)}
                className={`flex items-center gap-1.5 text-xs font-black bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm border transition-all active:scale-95 ${
                  likedItems[item.id] ? 'text-red-400 border-red-500/30' : 'text-white/80 border-white/10'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${likedItems[item.id] ? 'fill-red-400 text-red-400' : ''}`} />
                {Math.round((item.rating * 14) + (likedItems[item.id] ? 1 : 0))}
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-grow">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-on-surface leading-tight mb-2">
              {item.name}
            </h2>
            <p className="text-primary text-sm font-bold uppercase tracking-wider">
              {item.category === 'doctor' ? t('search.registered_medical_pro') : t('search.medical_establishment')}
            </p>
          </div>

          <div className="space-y-4 border-t border-outline-variant/10 pt-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t('search.about_us')}</h3>
            <p className="text-on-surface-variant text-base leading-relaxed font-medium opacity-90">
              {item.description}
            </p>
          </div>

          {item.services && item.services.length > 0 && (
            <div className="space-y-3 border-t border-outline-variant/10 pt-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t('search.available_services')}</h3>
              <div className="flex flex-wrap gap-2">
                {item.services.map((service: string, idx: number) => (
                  <span key={idx} className="text-[10px] font-extrabold text-primary bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-outline-variant/10 pt-6">
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t('search.direct_contact')}</h4>
              <p className="text-on-surface font-semibold text-lg flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-primary shrink-0" />
                {item.phone}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t('search.location_address')}</h4>
              <p className="text-on-surface font-medium text-sm flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                {item.address}
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 bg-surface-container-high/50 border-t border-outline-variant/20 shrink-0 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleDirections}
            className="flex-1 py-4 border border-outline-variant/80 hover:bg-surface-container-highest/50 text-on-surface rounded-2xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            {t('search.directions')}
          </button>
          
          <button 
            onClick={handleAction}
            className="flex-1 py-4 bg-primary text-on-primary hover:brightness-110 rounded-2xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <Calendar className="w-4 h-4" />
            {item.category === 'doctor' ? t('search.book_appointment') : t('search.request_turn')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
