'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Download, BookOpen, Calendar, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PurchasedBook {
  orderId: string;
  productId: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  purchaseDate: string;
  downloadToken: string;
}

export function MyBooksContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<PurchasedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      fetchUserBooks();
    }
  }, [user, authLoading, router]);

  // Separate effect for handling successful purchase and auto-download
  useEffect(() => {
    if (!user || books.length === 0) return;

    const justPurchased = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    console.log('Success effect triggered:', { justPurchased, orderId, booksCount: books.length, userId: user?.uid });

    if (justPurchased === 'true') {
      setShowSuccessMessage(true);
      // Hide message after 6 seconds
      setTimeout(() => setShowSuccessMessage(false), 6000);
    }
  }, [user, books, searchParams]);

  const fetchUserBooks = async () => {
    try {
      const token = await user?.getIdToken();
      console.log('Fetching books for user:', user?.uid);

      const res = await fetch(`/api/user-orders?firebaseUid=${user?.uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('User orders response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('Books received:', data.books);
        setBooks(data.books);
      } else {
        const errorData = await res.json();
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (downloadToken: string, title: string) => {
    const link = document.createElement('a');
    link.href = `/api/download/${downloadToken}`;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dismkznnn/image/upload/v1764111111/noise-dark_tigk1l.png')] opacity-20 pointer-events-none"></div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4"
          >
            <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 flex items-center gap-4 shadow-2xl pointer-events-auto max-w-md w-full">
              <CheckCircle className="w-8 h-8 text-green-400 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white">Paiement réussi !</h3>
                <p className="text-green-100">
                  Votre livre a été ajouté à votre bibliothèque. Vous pouvez le télécharger à tout moment.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-10">
        <h1 className="text-4xl font-extrabold text-white mb-2">Ma Bibliothèque</h1>
        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/5 rounded-3xl border border-white/10"
          >
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Aucun livre acheté
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Votre bibliothèque est vide pour le moment. Découvrez nos ouvrages pour commencer votre apprentissage.
            </p>
            <Link
              href="/books"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-500 transition shadow-lg shadow-blue-500/25"
            >
              Parcourir les livres
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="mb-6">
              <span className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm text-gray-300 border border-white/10">
                {books.length} livre{books.length > 1 ? 's' : ''} acquis
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book, index) => (
                <motion.div
                  key={book.orderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={book.imageUrl.startsWith('http') ? book.imageUrl : `/api/images/${book.imageUrl}`}
                      alt={book.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 to-transparent"></div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                      {book.description}
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Acheté le{' '}
                          {new Date(book.purchaseDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDownload(book.downloadToken, book.title)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger PDF
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
