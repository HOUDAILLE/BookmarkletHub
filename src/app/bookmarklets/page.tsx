"use client";

import { useState, useEffect } from 'react';
import BookmarkletCard from '../components/BookmarkletCard';
import SearchFilter from '../components/SearchFilter';

interface Bookmarklet {
  id: string;
  name: string;
  code: string;
  category: string;
  subcategory: string;
  version: string;
  license: string;
}

export default function BookmarkletsPage() {
  const [bookmarklets, setBookmarklets] = useState<Bookmarklet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    async function fetchBookmarklets() {
      try {
        setLoading(true);
        const response = await fetch('/api/bookmarklets');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookmarklets(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarklets();
  }, []);

  const filteredBookmarklets = bookmarklets.filter(bookmarklet => {
    const matchesSearch = bookmarklet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bookmarklet.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? bookmarklet.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <p>Chargement des bookmarklets...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Bookmarklets Disponibles</h1>
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={Array.from(new Set(bookmarklets.map(b => b.category)))}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredBookmarklets.map(bookmarklet => (
          <BookmarkletCard key={bookmarklet.id} bookmarklet={bookmarklet} />
        ))}
      </div>
      {filteredBookmarklets.length === 0 && !loading && !error && (
        <p className="mt-8 text-lg">Aucun bookmarklet trouvé correspondant à vos critères.</p>
      )}
    </main>
  );
}