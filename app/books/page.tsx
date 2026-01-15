'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';
import PhoneAuth from '@/components/PhoneAuth';
import FreeProductCard from '@/components/FreeProductCard';
import { Gift } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data.filter(p => (p as any).slug !== 'free-downloads-global'));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 rounded-md min-h-screen bg-gray-950">
      {/* Hero Section */}

      {/* Glow lights */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-purple-600/20 blur-[120px] rounded-full"></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-10 lg:mt-14">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 uppercase tracking-tight">
            Livres pour <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Entrepreneurs</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Améliorez vos compétences grâce à cette collection de livres de haute qualité, sélectionnés pour vous propulser vers le succès.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAuthRequired={() => setIsAuthOpen(true)}
              />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20 text-gray-300">
            Aucun produit disponible pour l'instant. Revenez plus tard !
          </div>
        )}

        {/* Free Books Section */}
        <div className="mt-24 pt-12 border-t border-gray-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-4 flex items-center justify-center gap-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                Ressources Gratuites
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Une sélection de contenus offerts pour booster votre apprentissage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FreeProductCard
              product={{
                id: 'free-1',
                title: '21 commandements d\'un homme de valeur',
                description: 'Un homme de vision marche selon certaines règles qui, une fois réunies lui octroyent de la valeur.',
                imageUrl: '/pdf/21_commandement.jpg',
                pdfUrl: '/pdf/21_commandement.pdf'
              }}
            />
            <FreeProductCard
              product={{
                id: 'free-2',
                title: 'Les bases de l\'entrepreneuriat',
                description: 'Le guide essentiel pour comprendre les bases de l\'entrepreneuriat et démarrer du bon pied.',
                imageUrl: '/pdf/Entrepreneuriat.jpg',
                pdfUrl: '/pdf/Entrepreneuriat.pdf'
              }}
            />
            <FreeProductCard
              product={{
                id: 'free-3',
                title: 'Marketing 2.0',
                description: 'Devenez maître du marketing digital ainsi que traditionnel pour maximiser vos chances en entrepreneuriat.',
                imageUrl: '/pdf/Marketing.jpg',
                pdfUrl: '/pdf/Marketing.pdf'
              }}
            />
            <FreeProductCard
              product={{
                id: 'free-4',
                title: 'Ko tika te soki olembi tika soki esimbi',
                description: 'Cet ouvrage vous encourage à persévérer dans l\'entrepreneuriat et de n\'arrêter qu\'au succès.',
                imageUrl: '/pdf/Ko_tika_te.jpg',
                pdfUrl: '/pdf/Ko_tika_te.pdf'
              }}
            />
            <FreeProductCard
              product={{
                id: 'free-5',
                title: 'Business plan simplifié',
                description: 'Un guide essentiel pour comprendre comment élaborer un business plan de façon rapide et efficace.',
                imageUrl: '/pdf/Business_plan_simplifie.png',
                pdfUrl: '/pdf/Business_plan_simplifie 2.0.pdf'
              }}
            />
            <FreeProductCard
              product={{
                id: 'free-6',
                title: 'Guide sur la fabrication des chips Makemba',
                description: 'Votre guide essentiel pour comprendre comment fabriquer des chips grâce à la banane (Makemba).',
                imageUrl: '/pdf/Makemba.jpg',
                pdfUrl: '/pdf/Makemba.pdf'
              }}
            />
            <FreeProductCard
              product={{
                id: 'free-7',
                title: 'Extrait du livre 30 idées business',
                description: 'Ceci est un aperçu gratuit du E-book 30 idées business.',
                imageUrl: '/pdf/Extrait_30_idées_business.jpg',
                pdfUrl: '/pdf/Extrait_30_idées_business.pdf'
              }}
            />
          </div>
        </div>
      </main>

      <PhoneAuth
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

