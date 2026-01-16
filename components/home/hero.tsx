"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeroBox() {
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      Titre: "Mes ouvrages",
      Description:
        "Gamme variée d'ouvrage pour les amoureux de la lecture, du développement personnel et du monde de l'entreprenariat.",
      bg: "https://res.cloudinary.com/dfwaj3e6o/image/upload/v1767436161/Librairie_buvnek.jpg",
      img: "/images/profil-1.png",
      lien: "/books",
      cta: "J'achète !",
    },
    {
      Titre: "Mes formations",
      Description:
        "Apprenez davantage sur l'entreprenariat et le développement personnel grâce aux formations.",
      bg: "https://res.cloudinary.com/dfwaj3e6o/image/upload/v1767436183/visio_xnzlnl.jpg",
      img: "/images/profil-2.png",
      lien: "/formations",
      cta: "Je me forme !",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <>
      {/* Desktop / lg+ */}
      <div className="hidden lg:flex items-center justify-center w-full" style={{ minHeight: "100vh", padding: "0 1.5rem" }}>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-7xl relative"
          viewport={{ once: false }}
          style={{ height: "95vh", maxHeight: "800px" }}
        >
          {/* Base background */}
          <div className="absolute inset-0 bg-zinc-950 rounded-lg"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.bg}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              viewport={{ once: false }}
              className="absolute inset-0 rounded-lg bg-cover bg-center bg-no-repeat overflow-hidden after:absolute after:inset-0 after:bg-black/60"
              style={{ backgroundImage: `url(${slide.bg})` }}
            ></motion.div>
          </AnimatePresence>

          <div className="relative h-full z-10 rounded-lg p-12 lg:p-20 flex flex-col justify-center items-center text-center">
            <div className="max-w-6xl space-y-1 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <h1 className="mt-8 text-5xl md:text-6xl lg:text-8xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
                  {slide.Titre === "Mes ouvrages" ? (
                    <>
                      Découvrez mes <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Ouvrages</span>
                    </>
                  ) : (
                    <>
                      Formez-vous à <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">l'Excellence</span>
                    </>
                  )}
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="text-zinc-200 text-lg md:text-2xl max-w-2xl leading-relaxed font-light drop-shadow-md"
              >
                {slide.Description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="flex gap-6"
              >
                <Link
                  href={slide.lien}
                  className="group relative inline-flex items-center gap-3 px-10 py-4 mt-4 md:mt-6 bg-amber-500 text-black font-bold text-xl rounded-full overflow-hidden transition-all hover:bg-white hover:scale-105 shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
                >
                  <span className="relative z-10 uppercase tracking-wide">{slide.cta}</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Mobile / <lg */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}

        className="w-full mb-0.5 max-w-6xl mx-auto p-6 lg:hidden relative"
        style={{
          height: "100vh",
          backgroundImage: `url(${slide.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70 rounded-md"></div>
        <div className="absolute inset-0 bg-yellow-500/10 rounded-md"></div>

        <div className="relative h-full z-10 flex flex-col justify-center items-center p-6 text-center gap-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-50 leading-tight uppercase">
            {slide.Titre}
          </h1>
          <p className="text-gray-100 text-base md:text-lg">
            {slide.Description}
          </p>
          <Link
            href={slide.lien}
            className="text-base md:text-lg px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 transition rounded-full text-white font-bold shadow-lg shadow-amber-500/30"
          >
            {slide.cta}
          </Link>
        </div>
      </motion.section>
    </>
  );
}
