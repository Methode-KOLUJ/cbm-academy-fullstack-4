'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle, Library, ExternalLink } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/upload', icon: PlusCircle, label: 'Nouveau livre' },
    { href: '/admin', icon: Library, label: 'Tous les livres', exact: true },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-md flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'
        }`}
      >
        <div className="p-6 border-b whitespace-nowrap">
          <h1 className="text-2xl font-extrabold text-gray-800">DashBoard</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 whitespace-nowrap">
          {menuItems.map((item) => {
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                  isActive 
                    ? 'bg-gray-100 text-gray-900 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-gray-900' : 'text-gray-500'} />
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/books"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded transition mt-8 border-t pt-4"
          >
            <ExternalLink size={20} className="text-gray-500" />
            Voir les produits
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 bg-gray-100 overflow-hidden">
        {/* Top bar with Toggle */}
        <div className="bg-white border-b p-4 flex items-center shadow-sm">
             <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 mr-4 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
                aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
                {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            <h2 className="text-sm font-medium text-gray-500">
                Espace privé
            </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
