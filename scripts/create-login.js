const fs = require('fs');

const loginCode = `import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Chrome } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { signInWithGoogle, signInWithGoogleRedirect } from '../../lib/firebase';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { t