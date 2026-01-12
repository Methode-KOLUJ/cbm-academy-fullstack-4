"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto my-24 lg:my-40 px-6 md:px-12">
      {/* Background texture */}
      <div className="fixed inset-0 opacity-20 bg-[url('https://res.cloudinary.com/dismkznnn/image/upload/v1764111111/noise-dark_tigk1l.png')] bg-repeat pointer-events-none -z-10"></div>

      {/* Glow lights */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/10 blur-[150px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-600/10 blur-[150px] rounded-full -z-10"></div>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        {/* LEFT: Image Sticky */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:w-5/12 lg:sticky lg:top-32"
        >
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent mix-blend-overlay z-10"></div>
            {/* Use a different image if available, otherwise reuse the high quality portrait */}
            <img
              src="https://res.cloudinary.com/dismkznnn/image/upload/v1767374754/IMG-20251215-WA0226_glncqt.jpg"
              alt="Coach Big Mike"
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-1000"
            />
          </div>

          {/* Signature / Name below image */}
          <div className="mt-8 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-white">Coach Big Mike</h3>
            <p className="text-amber-500 text-sm tracking-widest uppercase mt-1">Fondateur de CBM Academy</p>
          </div>
        </motion.div>

        {/* RIGHT: Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="lg:w-7/12 space-y-12"
        >
          <div>
            <span className="text-amber-500 font-medium tracking-wider text-sm uppercase mb-4 block">Biographie</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Le guide de votre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">Épanouissement</span>
            </h1>
          </div>

          <div className="space-y-8 text-lg text-zinc-300 leading-relaxed font-light text-justify hyphens-auto">
            <p>
              <strong className="text-white font-semibold">Coach Big Mike</strong> est un coach de vie passionné, entièrement dédié à
              l'épanouissement de la personne humaine. Bien plus qu'un simple
              coach en développement personnel et évangéliste, il est un guide
              dévoué, animé par une profonde passion pour aider chaque individu à
              devenir plus fort chaque jour, révélant ainsi son
              potentiel, s'épanouissant spirituellement et construisant une vie
              alignée avec ses valeurs.
            </p>

            <div className="pl-6 border-l-2 border-amber-500/30 italic text-zinc-400">
              "Mon approche holistique allie développement personnel, foi et engagement social pour offrir un chemin unique vers une existence plus riche."
            </div>

            <p>
              Passionné de gym, de voyages et de découvertes, il
              nourrit son esprit d'ouverture et transmet cette énergie positive à
              ceux qu'il accompagne.
            </p>

            <p>
              Engagé dans l'entrepreneuriat depuis des années, il forme et
              accompagne les jeunes aspirant à se lancer dans cette grande
              aventure. Grâce à des outils et formations gratuits sur les bases de l'entrepreneuriat, le marketing et le développement personnel, il rend
              l'apprentissage accessible et motivant.
            </p>

            <p>
              À travers ses séances de coaching, ses conférences et ses actions sur le terrain, Coach
              Big Mike s'engage à créer un monde où chacun se sent aimé, valorisé
              et capable de faire la différence.
            </p>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h4 className="text-white font-semibold mb-6">Me contacter pour une intervention</h4>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:info@coachbigmikeacademy.com"
                className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-lg shadow-white/5"
              >
                M'envoyer un email
              </a>
              <a
                href="tel:+243821750038"
                className="px-8 py-3 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all duration-300"
              >
                +243 821 750 038
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
