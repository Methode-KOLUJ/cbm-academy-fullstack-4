'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Shield } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

interface PhoneAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PhoneAuth({ isOpen, onClose, onSuccess }: PhoneAuthProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const setupRecaptcha = () => {
    if (!auth) {
      setError('Firebase n\'est pas configuré');
      return;
    }

    try {
      // If an existing verifier is present, clear it to avoid stale credentials
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {
          // ignore clear errors
        }
        delete (window as any).recaptchaVerifier;
      }

      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
      });

      // Render the widget to ensure the verifier is initialised and a token can be produced
      // `render()` returns a widget ID, but we don't need to store it here.
      void verifier.render().catch((err) => console.warn('reCAPTCHA render failed:', err));

      (window as any).recaptchaVerifier = verifier;
    } catch (err) {
      console.error('Error setting up reCAPTCHA verifier:', err);
      setError('Impossible d\'initialiser reCAPTCHA. Vérifiez la console.');
    }
  };

  const handleSendCode = async () => {
    setError('');

    // Validate phone number
    if (!phoneNumber) {
      setError('Veuillez entrer un numéro de téléphone');
      return;
    }

    try {
      // Parse and validate phone number
      let formattedPhone = phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        // Assume Congo (+243) if no country code
        formattedPhone = '+243' + phoneNumber.replace(/^0+/, '');
      }

      if (!isValidPhoneNumber(formattedPhone)) {
        setError('Numéro de téléphone invalide');
        return;
      }

      const parsed = parsePhoneNumber(formattedPhone);
      formattedPhone = parsed.number;

      setLoading(true);
      setupRecaptcha();

      if (!auth) {
        setError('Firebase n\'est pas configuré');
        setLoading(false);
        return;
      }

      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);

      setConfirmationResult(result);
      setStep('verify');
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.error('Error sending code:', err);

      if (err.code === 'auth/invalid-phone-number') {
        setError('Numéro de téléphone invalide');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Trop de tentatives. Réessayez plus tard.');
      } else {
        setError('Erreur lors de l\'envoi du code. Réessayez.');
      }
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || !confirmationResult) return;

    setError('');
    setLoading(true);

    try {
      await confirmationResult.confirm(verificationCode);
      setLoading(false);
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      setLoading(false);
      console.error('Error verifying code:', err);

      if (err.code === 'auth/invalid-verification-code') {
        setError('Code de vérification invalide');
      } else if (err.code === 'auth/code-expired') {
        setError('Le code a expiré. Demandez un nouveau code.');
      } else {
        setError('Erreur lors de la vérification. Réessayez.');
      }
    }
  };

  const handleClose = () => {
    setPhoneNumber('');
    setVerificationCode('');
    setStep('phone');
    setError('');
    setConfirmationResult(null);
    // Clear any existing reCAPTCHA verifier to avoid stale app-credentials
    try {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {
          // ignore
        }
        delete (window as any).recaptchaVerifier;
      }
    } catch (e) {
      // ignore
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl z-50 p-6 overflow-hidden"
          >
            {/* Decorative blurred glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {step === 'phone' ? 'Connexion' : 'Vérification'}
                  </h2>
                  <p className="text-xs text-zinc-400">Accédez à votre espace membre</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-zinc-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {step === 'phone' ? (
              <div className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Numéro de téléphone
                  </label>
                  <div className="relative group">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+243 XXX XXX XXX"
                      className="w-full px-4 py-3.5 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Format international (ex: +243...)
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Envoi en cours...' : 'Recevoir le code'}
                </button>

                <p className="text-[10px] text-zinc-600 text-center">
                  En continuant, vous acceptez nos conditions d'utilisation.
                </p>
              </div>
            ) : (
              <div className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Code de vérification
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="— — — — — —"
                    maxLength={6}
                    className="w-full px-4 py-3.5 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-center text-2xl tracking-[0.5em] font-mono transition-all"
                    disabled={loading}
                  />
                  <p className="text-xs text-zinc-500 mt-2 text-center">
                    Entrez le code à 6 chiffres reçu par SMS
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleVerifyCode}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Vérification...' : 'Valider'}
                </button>

                <button
                  onClick={() => {
                    setStep('phone');
                    setVerificationCode('');
                    setError('');
                  }}
                  className="w-full text-amber-500 text-sm hover:text-amber-400 transition"
                  disabled={loading}
                >
                  Modifier le numéro
                </button>
              </div>
            )}

            <div id="recaptcha-container"></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
