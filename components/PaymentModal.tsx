'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Loader2, BookOpen } from 'lucide-react';
import Image from 'next/image';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => Promise<void>;
  productTitle: string;
  productPrice: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSubmit,
  productTitle,
  productPrice
}: PaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(phoneNumber);
      setPhoneNumber('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setPhoneNumber('');
      setError('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-950 rounded-2xl shadow-2xl shadow-black/50 max-w-md w-full border border-white/5 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 border-b border-white/5 shrink-0 z-10">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-white transition disabled:opacity-50 hover:bg-white/5 p-1 rounded-full"
                >
                  <X size={20} />
                </button>
                <div className="text-white/90 text-center">
                  <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-3">
                    <BookOpen className="text-amber-500" size={24} />
                  </div>
                  <h3 className="font-bold text-white text-lg leading-tight px-4 line-clamp-2">{productTitle}</h3>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar">
                {/* Payment Logos */}
                <div className="flex flex-col items-center justify-center gap-4 py-6 bg-zinc-900/30 shrink-0">
                  <span className="flex items-center gap-2 text-xs text-zinc-400 font-medium uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Paiement Mobile Sécurisé
                  </span>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="group w-16 h-16 bg-white rounded-2xl p-2 shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-red-500/20">
                      <div className="text-red-600 font-bold text-[10px] uppercase text-center leading-tight">
                        Airtel<br />Money
                      </div>
                    </div>
                    <div className="group w-16 h-16 bg-white rounded-2xl p-2 shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-orange-500/20">
                      <div className="text-orange-500 font-bold text-[10px] uppercase text-center leading-tight">
                        Orange<br />Money
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Amount Display */}
                  <div className="text-center">
                    <p className="text-zinc-400 text-sm mb-1">Total à payer</p>
                    <div className="text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1">
                      <span className="text-2xl text-amber-500">$</span>
                      {productPrice.toFixed(2)}
                    </div>
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label htmlFor="payment-phone" className="block text-sm font-medium text-zinc-300 mb-2">
                      Numéro de téléphone
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-zinc-500 font-medium text-lg">+243</span>
                      </div>
                      <input
                        id="payment-phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="XXX XXX XXX"
                        disabled={isLoading}
                        className="block w-full pl-16 pr-4 py-4 border border-zinc-700 rounded-xl bg-zinc-900/50 text-white text-lg placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium tracking-wide"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Traitement sécurisé...</span>
                      </>
                    ) : (
                      <span>Confirmer le paiement</span>
                    )}
                  </button>

                  {/* Info Text */}
                  <p className="text-[10px] text-zinc-500 text-center leading-relaxed px-4 pb-2">
                    En cliquant sur confirmer, vous recevrez une notification sur votre téléphone pour valider la transaction de manière sécurisée.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
