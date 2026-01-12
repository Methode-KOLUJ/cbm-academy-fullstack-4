"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";


export default function Album() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/album/images')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          console.log('Images loaded:', data.length);
          setPhotos(data.map((img: any) => img.url));
        } else {
            console.error('API Error:', data.error);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching album:', err);
        setLoading(false);
      });
  }, []);

  const open = (index: number) => setCurrent(index);
  const close = () => setCurrent(null);
  const prev = (e: any) => {
    e.stopPropagation();
    if (current === null) return;
    setCurrent((prev) => (prev! - 1 + photos.length) % photos.length);
  };
  const next = (e: any) => {
    e.stopPropagation();
    if (current === null) return;
    setCurrent((prev) => (prev! + 1) % photos.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="w-full rounded-sm max-w-7xl mx-auto py-20 px-4 md:px-8 mt-0.5 md:mt-1 bg-linear-to-br from-black via-gray-900 to-gray-950">
      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="relative overflow-hidden rounded-xl cursor-pointer group"
            onClick={() => open(i)}
          >
            <Image
              src={photo}
              alt="album photo"
              width={500}
              height={500}
              className="object-cover w-full h-40 md:h-52 lg:h-56 group-hover:brightness-75 transition-all duration-300"
            />
          </motion.div>
        ))}
      </div>

      {/* FULLSCREEN VIEWER */}
      <AnimatePresence>
        {current !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-999 bg-black/70 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={close}
                className="absolute -top-10 right-0 text-white p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>

              {/* PREV */}
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 text-white rounded-full"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              {/* NEXT */}
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 text-white rounded-full"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* IMAGE */}
              <Image
                src={photos[current]}
                alt="fullscreen photo"
                width={1400}
                height={900}
                className="rounded-xl object-contain w-full max-h-[85vh] mx-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

