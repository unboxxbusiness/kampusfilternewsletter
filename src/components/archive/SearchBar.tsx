"use client";

import React, { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (results: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export default function SearchBar({ onSearch, setLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      onSearch([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        onSearch(data);
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <input
      type="text"
      placeholder="Search opportunities, careers, decisions..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      className="w-full max-w-xl border-b border-gray-300 bg-transparent py-3 focus:border-black outline-none transition text-lg"
    />
  );
}
