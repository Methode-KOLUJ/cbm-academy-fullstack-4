'use client';

import { useState } from 'react';
import PaymentModal from '@/components/PaymentModal';

export default function PaymentModalDemo() {
  const [isOpen, setIsOpen] = useState(true);

  const handlePayment = async (phoneNumber: string) => {
    console.log('Payment phone number:', phoneNumber);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`Paiement initié avec le numéro: ${phoneNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Démonstration de la Modale de Paiement
        </h1>
        <p className="text-gray-400 mb-8">
          Cliquez sur le bouton ci-dessous pour ouvrir la modale
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition shadow-lg"
        >
          Ouvrir la modale de paiement
        </button>
      </div>

      <PaymentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handlePayment}
        productTitle="Comment transformer 50.000 FC en 500.000 FC"
        productPrice={5.00}
      />
    </div>
  );
}
