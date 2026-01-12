"use client";

import { useState, useEffect, useRef, cloneElement, isValidElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Youtube, Linkedin, ChevronUp } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Liste des routes où le footer ne doit PAS apparaître
  const hiddenRoutes = [
    "/my-books",
    "/books"
  ];

  // Masquer le footer pour /order, /admin et toutes leurs sous-routes
  const shouldHide =
    hiddenRoutes.includes(pathname) ||
    pathname.startsWith("/order") ||
    pathname.startsWith("/admin");

  if (shouldHide) return null;

  const socialLinks = [
    {
      id: "facebook",
      icon: <Facebook className="w-6 h-6" />,
      links: [
        { name: "Coach Big Mike", url: "https://web.facebook.com/Coachbigmikecongo" },
        { name: "Motivation na Lingala", url: "https://web.facebook.com/search/top?q=motivation%20na%20lingala" },
        { name: "Motivation na Swahili", url: "https://web.facebook.com/Motivationnaswahili" },
      ]
    },
    {
      id: "instagram",
      icon: <Instagram className="w-6 h-6" />,
      links: [
        { name: "Coach Big Mike", url: "https://www.instagram.com/coachbigmikecongo/" },
        { name: "Academy ya Masolo", url: "https://www.instagram.com/academy_ya_masolo_ya_likolo/" },
        { name: "Motivation na Lingala", url: "https://www.instagram.com/motivationnalingala/" },
        { name: "Motivation na Swahili", url: "https://www.instagram.com/motivationnaswahili/" },
      ]
    },
    {
      id: "youtube",
      href: "https://www.youtube.com/@coachbigmikecongo",
      icon: <Youtube className="w-6 h-6" />
    },
    {
      id: "linkedin",
      href: "https://linkedin.com",
      icon: <Linkedin className="w-6 h-6" />
    }
  ];

  return (

    <footer className="relative mt-0.5 md:mt-1 mb-0.5 md:mb-1 max-w-7xl mx-auto rounded-md bg-zinc-950 border-t border-white/5">
      {/* Background Effects Container */}
      <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
        <div className="absolute inset-0 opacity-20 bg-[url('https://res.cloudinary.com/dismkznnn/image/upload/v1764111111/noise-dark_tigk1l.png')] bg-repeat"></div>
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-yellow-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 pt-16 pb-8 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* 1. Brand & Description */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              {/* Check Navbar for correct path, usually /CBM.png */}
              <img src="/CBM.png" alt="CBM Academy Logo" className="h-16 w-auto rounded-xl" />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed">
              La plateforme de référence pour l'entrepreneuriat et le développement personnel. Révélez votre potentiel avec CBM Academy.
            </p>
          </div>

          {/* 2. Navigation */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Liens utiles</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-zinc-400 hover:text-amber-500 transition-colors text-sm">Accueil</Link></li>
              <li><Link href="/a-propos" className="text-zinc-400 hover:text-amber-500 transition-colors text-sm">À propos</Link></li>
              <li><Link href="/formations" className="text-zinc-400 hover:text-amber-500 transition-colors text-sm">Formations</Link></li>
              <li><Link href="/books" className="text-zinc-400 hover:text-amber-500 transition-colors text-sm">Livres</Link></li>
            </ul>
          </div>

          {/* 3. Contact */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                </span>
                <a href="mailto:info@coachbigmikeacademy.com" className="hover:text-amber-500 transition-colors">info@coachbigmikeacademy.com</a>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </span>
                <a href="tel:+243821750038" className="hover:text-amber-500 transition-colors">+243 821 750 038</a>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                </span>
                <span>Lubumbashi, RDC</span>
              </li>
            </ul>
          </div>

          {/* 4. Socials */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Suivez-nous</h4>
            <div className="flex flex-wrap gap-4" ref={dropdownRef}>
              {socialLinks.map((item) => (
                <div key={item.id} className="relative">
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {openDropdown === item.id && item.links && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-xl backdrop-blur-md z-50 p-1"
                      >
                        {/* Petit connecteur (triangle) */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-900 border-r border-b border-white/10 rotate-45 z-0"></div>

                        <div className="relative z-10 flex flex-col gap-1">
                          {item.links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left rounded-lg"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span className="truncate">{link.name}</span>
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Icon Button bubble style */}
                  {item.links ? (
                    <motion.button
                      onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative p-3 rounded-full transition-all duration-300 border ${openDropdown === item.id ? "border-amber-500 text-amber-500 bg-amber-500/10" : "border-white/10 text-zinc-400 hover:text-white hover:border-white/30 bg-white/5"}`}
                    >
                      {item.icon}
                    </motion.button>
                  ) : (
                    <motion.a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="block p-3 rounded-full transition-all duration-300 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 bg-white/5"
                    >
                      {item.icon}
                    </motion.a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} Coach Big Mike Academy — Tous droits réservés.
          </p>

          <p className="text-zinc-500 text-xs flex items-center gap-1">
            Développé avec <span className="text-red-500">❤</span> par{" "}
            <Link
              href="https://www.kolujdev.tech"
              target="_blank"
              className="text-zinc-300 hover:text-amber-500 transition-colors font-medium"
            >
              KOLUJ_DEV
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
