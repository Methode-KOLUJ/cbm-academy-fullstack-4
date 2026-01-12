'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Gift, Download } from 'lucide-react';

interface FreeProduct {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
}

interface FreeProductCardProps {
  product: FreeProduct;
}


export default function FreeProductCard({ product }: FreeProductCardProps) {

  const handleDownload = () => {
    // Navigate to tracking API which will redirect to the file
    const link = document.createElement('a');
    link.href = `/api/download-free?file=${encodeURIComponent(product.pdfUrl)}`;
    link.download = `${product.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5 flex flex-col h-full transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.15)]"
    >
      {/* Badge Gratuit - Minimalist */}
      <div className="absolute top-4 left-4 z-20">
        <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-sm shadow-lg">
          Offert
        </span>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-950">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-zinc-950/90 to-transparent opacity-80"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 relative z-10">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2 leading-snug group-hover:text-emerald-400 transition-colors duration-300">
            {product.title}
          </h3>

          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6">
            {product.description}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-emerald-600 text-white py-3 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-emerald-500/20 font-medium text-sm border border-white/5"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger le PDF</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
