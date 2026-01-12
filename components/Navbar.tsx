"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Video,
  BookOpen,
  Menu,
  UserRound,
  Images,
  X,
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PhoneAuth from "@/components/PhoneAuth";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // ❗ Routes sur lesquelles la navbar ne doit pas apparaître
  const hiddenRoutes = [
    "/dashboard",
    "/auth/login",
    "/auth/register"
  ];

  const shouldHide =
    hiddenRoutes.includes(pathname) ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/order");

  // 🟢 Tous les hooks doivent être avant le return conditionnel
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const navLinks = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/a-propos", label: "A propos", icon: UserRound },
    { href: "/formations", label: "Formations", icon: Video },
    { href: "/books", label: "Livres", icon: BookOpen },
    { href: "/album", label: "Album", icon: Images },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // 👇 Safe : aucun hook après ceci
  if (shouldHide) return null;

  return (
    <>
      {/* Version Desktop */}
      <nav
        className={`fixed left-1/2 transform -translate-x-1/2 
        max-w-7xl w-full mx-auto transition-all duration-500 ease-in-out 
        z-50 hidden lg:block ${isScrolled ? "top-1" : "top-2"}`}
      >
        <div
          className={`mx-6 bg-zinc-950/80 backdrop-blur-xl border border-white/5 
          rounded-2xl transition-all duration-300 ease-in-out px-2
          ${isScrolled ? "shadow-2xl shadow-black/50" : "shadow-lg"}`}
        >
          <div className="flex items-center justify-between px-6 py-3">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center text-2xl font-bold text-white hover:opacity-80 transition-opacity duration-200"
            >
              <Image
                src="/CBM.png"
                width={45}
                height={45}
                alt="CBM-Logo"
                className="rounded-lg"
              />
            </Link>

            {/* Liens */}
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActiveLink(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-xl
                    font-medium transition-all duration-300 text-base lg:text-lg tracking-wide
                    ${isActive
                        ? "text-amber-500 bg-amber-500/10"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <Icon size={18} className={isActive ? "text-amber-500" : "text-zinc-500 group-hover:text-white"} />
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Authentication Desktop */}
            <div className="flex items-center pl-6 border-l border-white/5">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-zinc-900 border border-white/10 text-white px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-all shadow-lg hover:shadow-amber-500/10 group"
                  >
                    <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-base md:text-lg font-medium">Mon compte</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-zinc-950 rounded-2xl shadow-xl shadow-black/50 border border-white/10 py-2 z-10 overflow-hidden ring-1 ring-white/5">

                      <Link
                        href="/my-books"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition text-zinc-300 hover:text-white"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <BookOpen className="w-4 h-4 text-amber-500" />
                        Mes Livres
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition text-red-400 hover:text-red-300"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white text-black px-6 py-2.5 rounded-full hover:bg-amber-500 hover:text-white transition-all font-semibold text-sm shadow-lg shadow-white/5 hover:shadow-amber-500/30"
                >
                  Connexion
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Version Mobile */}
      <nav
        className={`fixed left-1/2 transform -translate-x-1/2 
        max-w-7xl w-full mx-auto transition-all duration-300 ease-in-out 
        z-50 lg:hidden ${isScrolled ? "top-2" : "top-4"}`}
      >
        <div
          className="mx-4 bg-zinc-950/90 backdrop-blur-xl border border-white/10 
          rounded-2xl transition-all duration-300 ease-in-out shadow-2xl shadow-black/50"
        >
          <div className="flex items-center justify-between px-5 py-4">

            {/* Logo Mobile */}
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/CBM.png"
                width={35}
                height={35}
                alt="CBM-Logo"
                className="rounded-md"
              />
            </Link>

            {/* Hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="text-zinc-400 p-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menu mobile */}
          <div
            className={`px-4 transition-all duration-300 ease-in-out overflow-hidden
            ${isMobileMenuOpen ? "max-h-[500px] opacity-100 pb-4" : "max-h-0 opacity-0"}`}
          >
            <div className="border-t border-white/5 pt-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActiveLink(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl 
                    font-medium transition-all duration-200 text-sm 
                    ${isActive
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/10"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={18} className={isActive ? "text-amber-500" : "text-zinc-500"} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Auth Mobile */}
              <div className="border-t border-white/10 pt-2 mt-2">
                {user ? (
                  <>
                    <Link
                      href="/my-books"
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen size={18} className="mr-3" />
                      Mes Livres
                    </Link>

                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-white/5"
                    >
                      <LogOut size={18} />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-lg bg-gradient-to-r from-yellow-600 to-amber-600 text-white hover:from-yellow-500 hover:to-amber-500 shadow-lg"
                  >
                    <User size={18} />
                    Connexion
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Auth Modal */}
      <PhoneAuth
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}
