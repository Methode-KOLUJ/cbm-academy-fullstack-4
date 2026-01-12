'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Product {
  _id: string;
  title: string;
  price: number;
  slug?: string;
  downloadCount?: number;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [freeDownloads, setFreeDownloads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, statsRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/free-stats')
        ]);

        const productsData = await productsRes.json();
        const statsData = await statsRes.json();

        setProducts(productsData);
        setFreeDownloads(statsData.count || 0);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPaidDownloads = products.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);
  const totalDownloads = totalPaidDownloads + freeDownloads;

  if (loading) return <div className="p-8">Loading...</div>;

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

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
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the product');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Produits</h2>
        <Link
          href="/admin/upload"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Ajouter un produit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Nombre des Téléchargements</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{totalDownloads}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-gray-600 font-medium">Titres</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Prix</th>
              <th className="px-6 py-4 text-gray-600 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <motion.tr
                key={product._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-900">{product.title}</td>
                <td className="px-6 py-4 text-gray-600">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No products found. Start by adding one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
