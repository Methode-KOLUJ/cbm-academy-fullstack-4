'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Product {
    _id: string;
    title: string;
    slug?: string;
}

export default function CleanupPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/products')
            .then((res) => res.json())
            .then((data) => {
                // Filter specifically for the "Free Downloads" placeholder
                const target = data.filter((p: Product) =>
                    p.title === "Téléchargements Gratuits" || p.slug === "free-downloads-global"
                );
                setProducts(target);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (productId: string) => {
        if (!confirm('Attention : En supprimant ceci, vous perdrez le compteur total des téléchargements gratuits. Êtes-vous sûr ?')) return;

        try {
            const res = await fetch('/api/admin/products', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            });

            if (res.ok) {
                setProducts(products.filter((p) => p._id !== productId));
                alert('Produit supprimé avec succès.');
            } else {
                const data = await res.json();
                alert(data.error || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Erreur serveur');
        }
    };

    if (loading) return <div className="p-8 text-white">Chargement...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-red-500 mb-8">Zone de Nettoyage</h1>

            <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-red-50">
                    <p className="text-red-800">
                        Cette page affiche uniquement les éléments techniques comme "Téléchargements Gratuits".
                    </p>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-gray-600 font-medium">Titre</th>
                            <th className="px-6 py-4 text-gray-600 font-medium">Slug</th>
                            <th className="px-6 py-4 text-gray-600 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <motion.tr
                                key={product._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <td className="px-6 py-4 font-bold text-gray-900">{product.title}</td>
                                <td className="px-6 py-4 text-gray-500 font-mono text-sm">{product.slug}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition shadow-md"
                                    >
                                        Supprimer définitivement
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                    Aucun élément "Téléchargements Gratuits" trouvé. Votre base est propre.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
