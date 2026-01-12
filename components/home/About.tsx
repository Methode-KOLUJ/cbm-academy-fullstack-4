"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section className="relative max-w-7xl mx-auto my-24 lg:my-32">
      {/* Decorative subtle background element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      <div className="px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* LEFT: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex-1 space-y-8 lg:pr-8"
        >
          <div className="space-y-4">
            <span className="text-amber-500 font-semibold tracking-wider text-sm uppercase">À propos</span>
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
            >
              L'architecte de votre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">succès personnel</span>
            </motion.h2>
          </div>

          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light text-justify hyphens-auto">
            Coach en développement personnel, motivateur, entrepreneur, auteur et formateur passionné, j’aide chaque jour des milliers
            de personnes à développer leur potentiel, à entreprendre avec impact et à créer
            une vie alignée avec leurs valeurs.
            <br /><br />
            Mon approche combine pédagogie moderne, stratégie, discipline mentale
            et créativité pour transformer des idées en projets concrets.
          </p>

          <Link
            href="/a-propos"
            className="group inline-flex items-center gap-3 text-white font-medium hover:text-amber-400 transition-colors mt-4"
          >
            <span className="border-b border-white/30 group-hover:border-amber-400 pb-0.5 transition-colors">Découvrir mon parcours</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* RIGHT: Image Composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex-1 w-full max-w-[500px] lg:max-w-none relative"
        >
          {/* Minimalist Image Container */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl shadow-black/50">
            <Image
              src="https://res.cloudinary.com/dismkznnn/image/upload/v1767374754/IMG-20251215-WA0226_glncqt.jpg"
              alt="Portrait Coach Big Mike"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              priority
            />
            {/* subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
          </div>

          {/* Floating Stats Card - Refined */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute -top-8 -right-4 md:-right-12 bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex items-center gap-5 max-w-[280px]"
          >
            <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
                +<Counter from={0} to={10000} />
              </div>
              <div className="text-sm text-zinc-400 font-medium">Utilisateurs actifs</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Counter({ from, to }: { from: number; to: number }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const controls = animate(count, to, { duration: 2.5, ease: "easeOut" });
    return controls.stop;
  }, [count, to]);

  return <motion.span>{rounded}</motion.span>;
}
