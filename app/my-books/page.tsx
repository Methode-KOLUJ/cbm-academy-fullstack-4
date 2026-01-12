import { Suspense } from 'react';
import { MyBooksContent } from './client';

export default function MyBooksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <MyBooksContent />
    </Suspense>
  );
}
