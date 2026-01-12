'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Home, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Order {
  _id: string;
  status: 'pending' | 'paid' | 'failed';
  downloadToken?: string;
}

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    // Poll every 5 seconds if pending
    const interval = setInterval(() => {
        if (order?.status === 'pending') {
            fetchOrder();
        }
    }, 5000);

    return () => clearInterval(interval);
  }, [params.id, order?.status]);

  // Handle payment success from URL parameters or Polling
  useEffect(() => {
    // If order is paid (detected via polling), redirect to my-books
    if (order?.status === 'paid' && !processingPayment) {
        console.log('Order paid detected via polling. Redirecting to my-books...');
        router.push(`/my-books?success=true&orderId=${order._id}`);
        return;
    }

    const handlePaymentSuccess = async () => {
      const status = searchParams.get('status');
      console.log('Order page mounted. Status from URL:', status);
      console.log('Order state:', { orderId: params.id, status: order?.status, downloadToken: order?.downloadToken ? 'present' : 'missing' });
      
      // Check if payment was successful (status 200 or 2000)
      if (status && (status === '200' || status === '2000') && !processingPayment) {
        console.log('Processing payment success...');
        setProcessingPayment(true);
        
        try {
          // Update order status via payment callback
          console.log('Calling payment callback...');
          const response = await fetch(`/api/payment-callback?orderId=${params.id}&status=${status}`, {
            method: 'GET',
          });

          console.log('Payment callback response status:', response.status);

          if (response.redirected) {
            // Follow the redirect
            console.log('Redirect detected, following to:', response.url);
            window.location.href = response.url;
          } else {
            // Manually redirect to my-books with success flag
            console.log('No redirect, pushing to /my-books');
            router.push(`/my-books?success=true&orderId=${params.id}`);
          }
        } catch (error) {
          console.error('Error processing payment:', error);
          setProcessingPayment(false);
        }
      }
    };

    if (!loading && order) {
      // Only call handlePaymentSuccess if we have URL params to process
      if (searchParams.get('status')) {
          handlePaymentSuccess();
      }
    }
  }, [searchParams, params.id, loading, order, processingPayment, router]);

  const handleDownload = () => {
    if (order?.downloadToken) {
      const link = document.createElement('a');
      link.href = `/api/download/${order.downloadToken}`;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Loading state with animated loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Animated concentric circles */}
            <div className="relative w-24 h-24">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-blue-500/30 border-t-blue-600 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-4 border-purple-500/30 border-t-purple-600 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <BookOpen className="w-8 h-8 text-blue-600" />
              </motion.div>
            </div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-700 font-medium text-lg"
            >
              Chargement de votre commande...
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande introuvable</h2>
          <p className="text-gray-600 mb-6">Cette commande n'existe pas ou a été supprimée.</p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
          >
            <Home className="w-4 h-4" />
            Retour à la Boutique
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={order.status}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-white/80 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-2xl max-w-md w-full text-center relative z-10 border border-white/20"
        >
          {order.status === 'paid' ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative mx-auto mb-6 w-20 h-20"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-green-100 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-900 mb-3"
              >
                Paiement Réussi! 🎉
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-8 text-lg"
              >
                Merci pour votre achat. Votre livre est disponible dans votre bibliothèque.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg shadow-blue-500/30"
                >
                  📥 Télécharger PDF
                </motion.button>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/my-books"
                    className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    <BookOpen className="w-5 h-5" />
                    Voir Mes Livres
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/books"
                    className="flex items-center justify-center gap-2 w-full text-gray-600 py-4 rounded-xl font-medium hover:text-gray-900 hover:bg-gray-50 transition"
                  >
                    <Home className="w-5 h-5" />
                    Retour à la Boutique
                  </Link>
                </motion.div>
              </motion.div>
            </>
          ) : order.status === 'failed' ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative mx-auto mb-6 w-20 h-20"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="absolute inset-0 bg-red-100 rounded-full flex items-center justify-center"
                >
                  <XCircle className="w-12 h-12 text-red-600" />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-900 mb-3"
              >
                Paiement Échoué
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-8 text-lg"
              >
                Une erreur s'est produite lors de la transaction. Veuillez réessayer.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/books"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg"
                >
                  <Home className="w-5 h-5" />
                  Retour à la Boutique
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              {/* Pending state with beautiful animations */}
              <div className="relative mx-auto mb-6 w-24 h-24">
                {/* Rotating outer ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-transparent border-t-yellow-500 border-r-yellow-400 rounded-full"
                />
                
                {/* Counter-rotating middle ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border-4 border-transparent border-t-orange-500 border-l-orange-400 rounded-full"
                />
                
                {/* Orbiting dots */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: i * 0.3 
                    }}
                    className="absolute inset-0"
                  >
                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-500 rounded-full -translate-x-1/2" />
                  </motion.div>
                ))}
              </div>

              <motion.h2
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
              >
                Paiement en cours...
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 mb-6 text-md"
              >
                Veuillez patienter pendant que nous confirmons votre achat.
              </motion.p>

              {/* Progress indicator */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      className="w-3 h-3 bg-yellow-500 rounded-full"
                    />
                  ))}
                </div>
                
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sm text-gray-500"
                >
                  Cela peut prendre quelques instants...
                </motion.p>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
