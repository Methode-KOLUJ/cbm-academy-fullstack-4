'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import PaymentModal from './PaymentModal';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
  onAuthRequired?: () => void;
}

export default function ProductCard({ product, onAuthRequired }: ProductCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleBuy = () => {
    // Check if user is authenticated
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        alert('Veuillez vous connecter pour acheter ce livre');
      }
      return;
    }

    // Open payment modal
    setIsPaymentModalOpen(true);
  };

  const handlePayment = async (paymentPhoneNumber: string) => {
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    // Trigger payment flow with separate payment phone number
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product._id,
        firebaseUid: user.uid,
        phoneNumber: paymentPhoneNumber, // Use payment phone number instead of auth phone
      }),
    });
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (data.success && data.orderId) {
      // Pawapay flow: Redirect to order page to wait for confirmation
      router.push(`/order/${data.orderId}`);
    } else if (data.paymentUrl && data.params) {
      // Legacy MaishaPay flow (keep for safety if needed or remove)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.paymentUrl;

      Object.entries(data.params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } else if (data.paymentUrl) {
      // Fallback for direct URL
      window.location.href = data.paymentUrl;
    } else {
      throw new Error('Payment initialization failed: ' + (data.error || 'Unknown error'));
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5 flex flex-col h-full transition-all duration-500 hover:border-amber-500/40 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.15)]"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-950">
          <Image
            src={product.imageUrl.startsWith('http') ? product.imageUrl : `/api/images/${product.imageUrl}`}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Subtle gradient overlay for text readability if needed, but keeping it clean for now */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-zinc-950/90 to-transparent opacity-60"></div>

          {/* Quick Action Button (Optional, can be added later) */}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1 relative z-10">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2 leading-snug group-hover:text-amber-500 transition-colors duration-300">
              {product.title}
            </h3>

            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-4">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 pt-4 mt-auto border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-0.5">Prix</p>
                <p className="text-2xl font-bold text-white tracking-tight">
                  <span className="text-amber-500">$</span>{product.price.toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={handleBuy}
              className="w-full bg-white text-black hover:bg-amber-500 hover:text-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-amber-500/20"
            >
              Acheter maintenant
            </button>
          </div>
        </div>
      </motion.div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handlePayment}
        productTitle={product.title}
        productPrice={product.price}
      />
    </>
  );
}
