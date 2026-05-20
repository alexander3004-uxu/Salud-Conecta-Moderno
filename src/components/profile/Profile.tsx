import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Droplet,
  ShieldAlert,
  Cake,
  Save,
  Cloud,
  Info,
  Lock,
  HardDrive,
  QrCode,
  ShieldCheck,
  LogOut,
  Camera,
  X,
  Check,
  Edit,
  Activity,
  Plus,
  RotateCcw,
  RefreshCw,
  Trash2,
  Eye,
  FileText as FileIcon,
  Image as ImageIcon,
  Folder,
  UploadCloud,
  Settings as SettingsIcon,
  FileDigit,
  CheckCircle2,
  AlertTriangle,
  Scan,
  ChevronDown
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { BiometricModal } from './BiometricModal';
import DocumentScanner from '../history/DocumentScanner';
import { useLanguage } from '../../contexts/LanguageContext';

export function Profile() {
  const { t, language } = useLanguage();
  const [user, setUser] = useState<any>(() => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) return firebaseUser;

    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Listen for auth changes to sync profile
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsubscribe();
  }, []);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const navigateToSettings = () => {
    window.dispatchEvent(new CustomEvent('changeTab', { detail: 'settings' }));
  };

  const handleValidateIdentity = () => {
    setIsModalOpen(true);
  };

  const handleValidationSuccess = () => {
    setIsValidated(true);
    setIsModalOpen(false);
  };

  const [tempQrActive, setTempQrActive] = useState(false);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);

  const generateTempAccess = () => {
    setTempQrActive(true);
    setExpiryTime(15); // 15 minutes
    setTimeout(() => {
      setTempQrActive(false);
      setExpiryTime(null);
    }, 15000 * 60); // In a real app this would be more complex
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Mock data matching the UI mockup
  const [profile, setProfile] = useState({
    name: user?.displayName || 'Carlos Méndez',
    phone: '+54 9 11 1234-5678',
    email: user?.email || 'carlos.mendez@ejemplo.com',
    address: 'Av. Libertador 1234, Piso 5A, CABA',
    bloodType: 'O Positivo',
    allergies: 'Penicilina',
    dob: '14 Mar 1978',
    photoURL: user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuCNjxM_kx1krlJpGAVOh-nfFDhGn7s-29GpIE4wJWRsqYWpCfOS2KwA0mDjXP283OFfd0LtGx5JPWVrYMEB1cg1irom_1Hm34eluol-cmYe4YG_wnOcjQSvXjDOPm-gtH24rSMm6i0J8uh2fP2_ixZm9Bq0yqMp4aTljcnyLHm8NYc7BeN6mABRDrlnCT35AHv-EBa3m15B2F8AG3IKN-eRA6aH-P_gNEBQ7te36sc60HjVj0KVBPIT4WPJljYhbiXnLMmBo9Tw9A"
  });

  const handlePhotoClick = () => {
    if (isValidated) {
      fileInputRef.current?.click();
    } else {
      handleValidateIdentity();
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, photoURL: reader.result as string });
        setIsPreviewMode(true);
        setToastMessage(t('profile.photo_uploaded'));
        setToastType('success');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: '1', name: 'María Méndez', relationship: 'Esposa', phone: '+54 9 11 9876-5432' }
  ]);

  const [files, setFiles] = useState([
    { id: '1', name: 'Resumen_Clinico_Anual.pdf', date: '12/10/2023', type: 'pdf' },
    { id: '2', name: 'Radiografia_Torax.png', date: '05/11/2023', type: 'image' }
  ]);

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'error' | 'success'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = () => {
    setUploadStatus('uploading');
    setUploadError(null);

    // Simulated upload delay
    setTimeout(() => {
      // 30% chance of failure for demo purposes
      if (Math.random() > 0.7) {
        setUploadStatus('error');
        setUploadError(t('profile.upload_error'));
      } else {
        const newFile = {
          id: Date.now().toString(),
          name: `Documento_${new Date().toLocaleDateString('es-ES').replace(/\//g, '_')}.pdf`,
          date: new Date().toLocaleDateString('es-ES'),
          type: 'pdf'
        };
        setFiles([newFile, ...files]);
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 2000);
      }
    }, 1500);
  };

  const handleDocumentCapture = (data: any) => {
    const newFile = {
      id: data.id,
      name: data.title + '.pdf',
      date: data.date,
      type: 'pdf'
    };
    setFiles([newFile, ...files]);
    setToastMessage(t('profile.doc_scanned'));
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsPreviewMode(false);

      // Persist the updated details back to the active user context
      const updatedUser = {
        ...user,
        displayName: profile.name,
        photoURL: profile.photoURL
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Trigger a sync event so that other components in the SPA (like header/sidebar) update dynamically
      window.dispatchEvent(new Event('storage'));

      setToastMessage(t('profile.profile_updated'));
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const handleAddContact = () => {
    setToastMessage(t('profile.contact_added'));
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    auth.signOut();
    window.location.reload(); // Recarga para resetear el estado de App.tsx
  };

  return (
    <div className="flex-1 w-full max-w-[800px] mx-auto px-4 md:px-6 py-10 pb-32 flex flex-col gap-10">
      {/* Header Section: Profile Overview */}
      <section className="bg-surface-container rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden group shadow-xl border border-outline-variant/30">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="flex flex-col items-center shrink-0">
          <div
            onClick={handlePhotoClick}
            className="relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-primary-container shrink-0 overflow-hidden shadow-2xl group/avatar cursor-pointer"
          >
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src={profile.photoURL}
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
            />

            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200">
              <Camera className="text-white w-8 h-8" />
            </div>

            <AnimatePresence>
              {isPreviewMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-surface/60 backdrop-blur-sm flex flex-col items-center justify-center gap-1"
                >
                  <div className="w-full h-1 bg-surface-container absolute top-0">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '66%' }}
                      className="bg-primary h-full"
                    />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest">{t('profile.preview')}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isPreviewMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center gap-2"
            >
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary-container text-on-primary-container px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {t('profile.confirm')}
              </button>
              <button
                onClick={() => {
                  setIsPreviewMode(false);
                  setProfile({ ...profile, photoURL: user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuCNjxM_kx1krlJpGAVOh-nfFDhGn7s-29GpIE4wJWRsqYWpCfOS2KwA0mDjXP283OFfd0LtGx5JPWVrYMEB1cg1irom_1Hm34eluol-cmYe4YG_wnOcjQSvXjDOPm-gtH24rSMm6i0J8uh2fP2_ixZm9Bq0yqMp4aTljcnyLHm8NYc7BeN6mABRDrlnCT35AHv-EBa3m15B2F8AG3IKN-eRA6aH-P_gNEBQ7te36sc60HjVj0KVBPIT4WPJljYhbiXnLMmBo9Tw9A" });
                }}
                className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-error-container hover:text-on-error-container transition-all"
              >
                <X className="w-4 h-4" />
                {t('profile.cancel')}
              </button>
            </motion.div>
          )}

          <button
            onClick={handlePhotoClick}
            className="mt-4 text-outline-variant hover:text-primary text-[10px] uppercase font-bold tracking-[0.2em] flex items-center gap-2 transition-all transition-colors"
          >
            <Edit className="w-3 h-3" />
            {t('profile.change_photo')}
          </button>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 w-full">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface tracking-tight mb-2">
            {profile.name}
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <p className="text-body-md text-on-surface-variant font-medium">{t('profile.status.frequent')}</p>
            <div className="h-4 w-px bg-outline-variant/30 mx-1" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 text-secondary text-[11px] font-bold uppercase tracking-wider"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('profile.status.verified')}
            </motion.div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 w-full">
            <div className="bg-surface-container-high border border-outline-variant/30 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-inner">
              <Droplet className="text-tertiary w-5 h-5 fill-tertiary/20" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">{t('profile.blood')}</span>
                <span className="text-sm font-bold text-on-surface">{profile.bloodType}</span>
              </div>
            </div>
            <div className="bg-surface-container-high border border-outline-variant/30 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-inner">
              <ShieldAlert className="text-secondary w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">{t('profile.allergies')}</span>
                <span className="text-sm font-bold text-on-surface">{profile.allergies}</span>
              </div>
            </div>
            <div className="bg-surface-container-high border border-outline-variant/30 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-inner">
              <Cake className="text-primary w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">{t('profile.birth')}</span>
                <span className="text-sm font-bold text-on-surface">{profile.dob}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Details Inputs */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-display font-bold text-on-surface flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <User className="w-5 h-5 text-primary" />
            </div>
            {t('profile.personal_info')}
          </h2>
          {!isValidated && (
            <button
              onClick={handleValidateIdentity}
              disabled={isSaving}
              className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {t('profile.validate')}
            </button>
          )}
        </div>

        {!isValidated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 flex items-center gap-3 shadow-inner"
          >
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs font-medium text-on-surface-variant italic">{t('profile.validate_desc')}</p>
          </motion.div>
        )}

        <div className="bg-surface-container rounded-3xl p-6 md:p-8 border border-outline-variant/30 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
          {/* Nombre Completo */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest ml-1">{t('profile.name_label')}</label>
            <div className={`relative group ${!isValidated ? 'opacity-60' : ''}`}>
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant group-focus-within:text-primary transition-colors" />
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isValidated}
                className={`w-full h-14 pl-12 pr-12 rounded-2xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner ${!isValidated ? 'cursor-not-allowed' : ''}`}
              />
              {!isValidated ? (
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
              ) : (
                <Edit className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant opacity-50" />
              )}
            </div>
          </div>

          {/* Fecha de Nacimiento */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest ml-1">{t('profile.birth')}</label>
            <div className={`relative group ${!isValidated ? 'opacity-60' : ''}`}>
              <Cake className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant group-focus-within:text-primary transition-colors" />
              <input
                value={profile.dob}
                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                disabled={!isValidated}
                className={`w-full h-14 pl-12 pr-12 rounded-2xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner ${!isValidated ? 'cursor-not-allowed' : ''}`}
              />
              {!isValidated ? (
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
              ) : (
                <Edit className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant opacity-50" />
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest ml-1">{t('profile.phone')}</label>
            <div className={`relative group ${!isValidated ? 'opacity-60' : ''}`}>
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant group-focus-within:text-primary transition-colors" />
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isValidated}
                className={`w-full h-14 pl-12 pr-12 rounded-2xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner ${!isValidated ? 'cursor-not-allowed' : ''}`}
              />
              {!isValidated ? (
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
              ) : (
                <Edit className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant opacity-50" />
              )}
            </div>
          </div>

          {/* Correo Electrónico */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest ml-1">{t('profile.email')}</label>
            <div className={`relative group ${!isValidated ? 'opacity-60' : ''}`}>
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant group-focus-within:text-primary transition-colors" />
              <input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isValidated}
                className={`w-full h-14 pl-12 pr-12 rounded-2xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner ${!isValidated ? 'cursor-not-allowed' : ''}`}
              />
              {!isValidated ? (
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
              ) : (
                <Edit className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant opacity-50" />
              )}
            </div>
          </div>

          {/* Grupo Sanguíneo (Selección) */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest ml-1">{t('profile.blood')}</label>
            <div className={`relative group ${!isValidated ? 'opacity-60' : ''}`}>
              <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant group-focus-within:text-primary transition-colors fill-outline-variant/10" />
              <select
                value={profile.bloodType}
                onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                disabled={!isValidated}
                className={`w-full h-14 pl-12 pr-12 rounded-2xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner appearance-none ${!isValidated ? 'cursor-not-allowed' : ''}`}
              >
                <option value={`O ${t('profile.positive')}`}>O {t('profile.positive')}</option>
                <option value={`O ${t('profile.negative')}`}>O {t('profile.negative')}</option>
                <option value={`A ${t('profile.positive')}`}>A {t('profile.positive')}</option>
                <option value={`A ${t('profile.negative')}`}>A {t('profile.negative')}</option>
                <option value={`B ${t('profile.positive')}`}>B {t('profile.positive')}</option>
                <option value={`B ${t('profile.negative')}`}>B {t('profile.negative')}</option>
                <option value={`AB ${t('profile.positive')}`}>AB {t('profile.positive')}</option>
                <option value={`AB ${t('profile.negative')}`}>AB {t('profile.negative')}</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none gap-2">
                {!isValidated ? (
                  <Lock className="w-4 h-4 text-outline-variant" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-outline-variant opacity-50" />
                )}
              </div>
            </div>
          </div>

          {/* Alergias Críticas */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest ml-1">{t('profile.allergies')}</label>
            <div className={`relative group ${!isValidated ? 'opacity-60' : ''}`}>
              <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant group-focus-within:text-primary transition-colors" />
              <input
                value={profile.allergies}
                onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                disabled={!isValidated}
                className={`w-full h-14 pl-12 pr-12 rounded-2xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner ${!isValidated ? 'cursor-not-allowed' : ''}`}
              />
              {!isValidated ? (
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
              ) : (
                <Edit className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant opacity-50" />
              )}
            </div>
          </div>

          {/* Ubicación Residencial */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest ml-1">{t('profile.address')}</label>
            <div className={`relative group ${!isValidated ? 'opacity-60' : ''}`}>
              <MapPin className="absolute left-4 top-5 w-5 h-5 text-outline-variant group-focus-within:text-primary transition-colors" />
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                rows={2}
                disabled={!isValidated}
                className={`w-full p-4 pl-12 pr-12 rounded-2xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner resize-none ${!isValidated ? 'cursor-not-allowed' : ''}`}
              />
              {!isValidated ? (
                <Lock className="absolute right-4 top-5 w-4 h-4 text-outline-variant" />
              ) : (
                <Edit className="absolute right-4 top-5 w-4 h-4 text-outline-variant opacity-50" />
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={handleSave}
              disabled={!isValidated || isSaving}
              className="bg-primary-container hover:brightness-95 text-on-primary-container px-8 py-4 rounded-2xl font-display font-bold text-sm shadow-xl transition-all flex items-center gap-2 group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 group-hover:animate-bounce" />
              {isSaving ? t('profile.saving') : t('profile.save')}
            </button>
          </div>
        </div>
      </section>

      {/* Medical Documentation Section */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-display font-bold text-on-surface flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Folder className="w-5 h-5 text-primary" />
            </div>
            {t('profile.docs')}
          </h2>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="bg-secondary-container text-on-secondary-container px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-secondary transition-all shadow-md active:scale-95 shadow-lg shadow-secondary/15"
          >
            <Scan className="w-4 h-4" />
            {t('profile.scan')}
          </button>
        </div>

        <div className="bg-surface-container rounded-3xl p-6 md:p-8 border border-outline-variant/30 flex flex-col gap-8 shadow-sm">
          {/* Status Banners */}
          <AnimatePresence>
            {uploadStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-error/10 border border-error/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 shadow-lg shadow-error/5"
              >
                <div className="bg-error/20 p-3 rounded-xl border border-error/30">
                  <ShieldAlert className="w-5 h-5 text-error shrink-0" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm font-bold text-error">{t('profile.sync_error')}</p>
                  <p className="text-xs text-error/80 mt-1 leading-relaxed">{uploadError}</p>
                </div>
                <button
                  onClick={handleFileUpload}
                  className="w-full sm:w-auto px-6 py-2.5 bg-error text-on-error rounded-xl font-display font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-md active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t('profile.retry')}
                </button>
              </motion.div>
            )}

            {uploadStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="bg-secondary/20 p-1.5 rounded-full">
                  <Check className="w-4 h-4 text-secondary" />
                </div>
                <p className="text-sm font-bold text-secondary">{t('profile.sync_success')}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Zone */}
          <div
            onClick={() => uploadStatus !== 'uploading' && handleFileUpload()}
            className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer bg-surface-container-high/50 group/upload overflow-hidden ${uploadStatus === 'uploading' ? 'cursor-not-allowed border-primary/40' :
                uploadStatus === 'error' ? 'border-error/40 hover:border-error' :
                  'border-outline-variant/40 hover:border-primary'
              }`}
          >
            {/* Pulsing background during upload */}
            {uploadStatus === 'uploading' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-primary"
              />
            )}

            <div className={`relative w-20 h-20 rounded-full bg-surface-container flex items-center justify-center transition-all border border-outline-variant/20 shadow-xl ${uploadStatus === 'uploading' ? 'shadow-primary/10' :
                uploadStatus === 'error' ? 'bg-error/5 group-hover/upload:bg-error/10' :
                  'group-hover/upload:bg-primary/10'
              }`}>
              {/* Progress Ring */}
              {uploadStatus === 'uploading' && (
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <motion.circle
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray: "100 100" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    cx="40"
                    cy="40"
                    r="38"
                    className="stroke-primary fill-none stroke-[3]"
                    pathLength="100"
                  />
                </svg>
              )}

              {uploadStatus === 'uploading' ? (
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <UploadCloud className="w-8 h-8 text-primary" />
                </motion.div>
              ) : uploadStatus === 'error' ? (
                <ShieldAlert className="w-8 h-8 text-error" />
              ) : (
                <UploadCloud className="w-8 h-8 text-outline-variant group-hover/upload:text-primary transition-colors" />
              )}
            </div>

            <div className="text-center relative z-10 h-10 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {uploadStatus === 'uploading' ? (
                  <motion.div
                    key="uploading-text"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-sm font-bold text-primary flex items-center gap-2">
                      {t('profile.saving')}
                    </span>
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1 h-1 bg-primary rounded-full" />
                      <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-primary rounded-full" />
                      <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-primary rounded-full" />
                    </div>
                  </motion.div>
                ) : uploadStatus === 'error' ? (
                  <motion.p
                    key="error-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-bold text-error"
                  >
                    Error
                  </motion.p>
                ) : (
                  <motion.div
                    key="idle-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <p className="text-sm font-bold text-on-surface">{t('profile.upload_desc')}</p>
                    <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest mt-1">{t('profile.upload_sub')}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              disabled={uploadStatus === 'uploading'}
              className="relative z-10 px-8 py-3 bg-surface-container-high border border-outline-variant/30 text-xs font-bold text-on-surface rounded-xl hover:border-primary/50 transition-all disabled:opacity-50 shadow-lg active:scale-95 min-w-[200px]"
            >
              {uploadStatus === 'uploading' ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <span>{t('settings.processing')}</span>
                </div>
              ) : t('profile.select_files')}
            </button>
          </div>

          {/* File List */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest ml-1">{t('profile.recent_files')}</h3>
            <div className="grid grid-cols-1 gap-3">
              {files.map((file) => (
                <div key={file.id} className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-4 flex items-center justify-between hover:border-primary/30 transition-all group/file shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${file.type === 'pdf' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'} border border-current/10`}>
                      {file.type === 'pdf' ? <FileIcon className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface group-hover/file:text-primary transition-colors">{file.name}</span>
                      <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase opacity-60">{file.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-primary/10 text-on-surface-variant hover:text-primary rounded-xl transition-all" title={t('profile.preview')}>
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-error/10 text-on-surface-variant hover:text-error rounded-xl transition-all" title={t('profile.delete')}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contacts Section */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-display font-bold text-on-surface flex items-center gap-3">
            <div className="bg-error/20 p-2 rounded-lg">
              <Phone className="w-5 h-5 text-error" />
            </div>
            {t('profile.emergency_contacts')}
          </h2>
          {!isValidated && (
            <button
              onClick={handleValidateIdentity}
              disabled={isSaving}
              className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {t('profile.validate')}
            </button>
          )}
        </div>

        {!isValidated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 flex items-center gap-3 shadow-inner"
          >
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs font-medium text-on-surface-variant italic">{t('profile.validate_desc')}</p>
          </motion.div>
        )}

        <div className="bg-surface-container rounded-3xl p-6 md:p-8 border border-outline-variant/30 flex flex-col gap-10 shadow-sm">
          {/* New Contact Form from Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 relative">
              <label className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest ml-1">{t('profile.name_label')}</label>
              <input
                disabled={!isValidated}
                className="w-full h-12 px-4 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={t('profile.placeholder_name')}
              />
              {!isValidated && <Lock className="absolute right-3 top-[38px] w-4 h-4 text-outline-variant opacity-50" />}
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest ml-1">{t('profile.rel_label')}</label>
              <input
                disabled={!isValidated}
                className="w-full h-12 px-4 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={t('profile.placeholder_rel')}
              />
              {!isValidated && <Lock className="absolute right-3 top-[38px] w-4 h-4 text-outline-variant opacity-50" />}
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest ml-1">{t('profile.phone')}</label>
              <input
                disabled={!isValidated}
                className="w-full h-12 px-4 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="+54 9 11 ..."
              />
              {!isValidated && <Lock className="absolute right-3 top-[38px] w-4 h-4 text-outline-variant opacity-50" />}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddContact}
              disabled={!isValidated}
              className="bg-secondary-container hover:bg-secondary text-on-secondary-container font-label-md text-label-md rounded-xl px-8 py-3 transition-all flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              {t('profile.add_contact')}
            </button>
          </div>

          <div className="h-px bg-outline-variant/20 w-full" />

          <div className="grid grid-cols-1 gap-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className={`bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner ${!isValidated ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="bg-error/10 p-3 rounded-xl border border-error/20">
                    <User className="w-5 h-5 text-error" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-on-surface">{contact.name}</span>
                    <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">{contact.relationship} • {contact.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    disabled={!isValidated}
                    className="flex-1 sm:flex-none p-2 hover:bg-primary/10 text-on-surface-variant hover:text-primary rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-transparent hover:border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isValidated ? <Edit className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span className="sm:hidden">{t('profile.edit')}</span>
                  </button>
                  <button
                    onClick={() => setEmergencyContacts(emergencyContacts.filter(c => c.id !== contact.id))}
                    disabled={!isValidated}
                    className="flex-1 sm:flex-none p-2 hover:bg-error/10 text-on-surface-variant hover:text-error rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-transparent hover:border-error/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isValidated ? <Trash2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span className="sm:hidden">{t('profile.delete')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            disabled={!isValidated}
            className="w-full py-5 border-2 border-dashed border-outline-variant/30 rounded-[28px] text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidated ? (
              <>
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                {t('profile.add_trusted')}
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                {t('profile.not_validated')}
              </>
            )}
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-display font-bold text-on-surface flex items-center gap-3">
            <div className="bg-secondary/20 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-secondary" />
            </div>
            {t('profile.health_config')}
          </h2>
          <div className="flex items-center gap-3 ml-auto">
            {!isValidated && (
              <button
                onClick={handleValidateIdentity}
                disabled={isSaving}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isSaving ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {t('profile.validate')}
              </button>
            )}
            <button
              onClick={navigateToSettings}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-[10px] font-bold text-primary uppercase tracking-widest hover:border-primary/50 transition-all shadow-sm"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              {t('settings.notifications')}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2 ml-1">
          {!isValidated ? <Info className="w-4 h-4 text-outline-variant" /> : <Check className="w-4 h-4 text-secondary" />}
          <p className="text-[10px] font-medium text-on-surface-variant italic">
            {isValidated ? t('profile.validated_true') : t('profile.validate_desc')}
          </p>
        </div>

        <div className="bg-surface-container rounded-3xl border border-outline-variant/30 overflow-hidden divide-y divide-on-surface/10 shadow-sm">
          <div className="p-6 flex items-center justify-between hover:bg-surface-container-high transition-all">
            <div className="flex flex-col">
              <span className="text-on-surface font-bold">{t('profile.sync_cloud')}</span>
              <span className="text-xs text-on-surface-variant mt-1">{t('profile.sync_vault')}</span>
            </div>
            <div className="w-12 h-6 bg-secondary rounded-full relative shadow-inner cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
            </div>
          </div>
          <div className="p-6 flex items-center justify-between hover:bg-surface-container-high transition-all">
            <div className="flex flex-col">
              <span className="text-on-surface font-bold">{t('profile.local_storage')}</span>
              <span className="text-xs text-on-surface-variant mt-1">{t('profile.indexdb')}</span>
            </div>
            <div className="w-12 h-6 bg-secondary rounded-full relative shadow-inner cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <AnimatePresence>
        {isScannerOpen && (
          <DocumentScanner
            onClose={() => setIsScannerOpen(false)}
            onCapture={handleDocumentCapture}
          />
        )}
      </AnimatePresence>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {/* Pasaporte Card */}
        <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/30 flex flex-col items-start gap-6 relative overflow-hidden group shadow-lg">
          <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <QrCode className="w-48 h-48" />
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/20 border border-primary-container flex items-center justify-center shrink-0 shadow-inner">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface font-bold text-lg">{t('profile.passport')}</span>
              <span className="text-xs text-on-surface-variant font-medium">{t('profile.share_temp')}</span>
            </div>
          </div>

          <div className="w-full flex-grow flex flex-col items-center justify-center py-6 bg-surface-container-high/30 rounded-3xl border border-outline-variant/10 shadow-inner group/qr">
            <div className={`transition-all duration-500 scale-125 mb-4 group-hover/qr:scale-[1.3] ${tempQrActive ? 'opacity-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'opacity-20 blur-[2px]'}`}>
              <QrCode className="w-24 h-24 text-on-surface" />
            </div>
            {tempQrActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  {t('profile.code_active')}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">{t('profile.expire_in').replace('{time}', expiryTime?.toString() || '15')}</span>
              </motion.div>
            )}
          </div>

          <div className="flex flex-col w-full gap-3 mt-auto">
            <button
              onClick={generateTempAccess}
              className="w-full bg-primary text-on-primary font-display font-bold py-4 rounded-2xl shadow-xl hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50"
              disabled={tempQrActive}
            >
              {t('profile.generate_temp')}
            </button>
            <div className="flex gap-2">
              <button className="flex-1 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface font-display font-bold text-xs py-3 rounded-2xl transition-all">
                {t('profile.view_qr')}
              </button>
            </div>
            <p className="text-[10px] text-on-surface-variant text-center mt-1 italic">{t('profile.temp_expiry')}</p>
          </div>
        </div>

        {/* Encryption Card */}
        <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/30 flex flex-col justify-between gap-8 shadow-lg">
          <div className="flex items-start gap-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-outline" />
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface font-bold">{t('profile.encryption')}</span>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                {t('profile.encryption_desc')}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between w-full mt-auto pt-6 border-t border-on-surface/10">
            <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">{t('profile.encryption_status')}</span>
            <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/20 shadow-sm">
              {t('profile.system_active')}
            </span>
          </div>
        </div>
      </section>

      {/* Sign Out */}
      <div className="pt-8 mb-20">
        <button
          onClick={handleLogout}
          className="w-full py-5 bg-error/10 text-error rounded-[32px] border border-error/20 font-display font-bold shadow-xl flex items-center justify-center gap-3 hover:bg-error hover:text-on-error transition-all active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          {t('profile.logout_full')}
        </button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%', transition: { duration: 0.2 } }}
            className="fixed bottom-10 left-1/2 z-[100] min-w-[300px]"
          >
            <div className={`backdrop-blur-md border rounded-2xl p-4 shadow-2xl flex items-center gap-3 ${toastType === 'success'
                ? 'bg-surface-bright/95 border-secondary/30'
                : 'bg-error-container/20 border-error/30'
              }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${toastType === 'success'
                  ? 'bg-secondary/10 border-secondary/30'
                  : 'bg-error/10 border-error/30'
                }`}>
                {toastType === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-error" />
                )}
              </div>
              <p className={`text-xs font-bold ${toastType === 'success' ? 'text-on-surface' : 'text-error'
                }`}>{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BiometricModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleValidationSuccess}
      />
    </div>
  );
}
