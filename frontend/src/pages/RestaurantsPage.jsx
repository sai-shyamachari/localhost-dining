import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import RestaurantCard from '../components/RestaurantCard';
import { Search, Filter, RotateCcw, UtensilsCrossed } from 'lucide-react';

const RestaurantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from URL search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [neighborhood, setNeighborhood] = useState(searchParams.get('neighborhood') || '');
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '');

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (neighborhood) params.append('neighborhood', neighborhood);
      if (cuisine) params.append('cuisine', cuisine);

      const res = await api.get(`/restaurants?${params.toString()}`);
      setRestaurants(res.data.data);
    } catch (err) {
      console.error('Failed to query restaurants:', err);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [searchParams]);

  const handleApplyFilter = (e) => {
    if (e) e.preventDefault();
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (neighborhood) params.neighborhood = neighborhood;
    if (cuisine) params.cuisine = cuisine;

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearch('');
    setNeighborhood('');
    setCuisine('');
    setSearchParams({});
  };

  const neighborhoods = ['Downtown', 'Midtown', 'Uptown', 'West Village', 'SoHo'];
  const cuisines = ['Italian', 'Japanese', 'French', 'Asian', 'European', 'Pizza'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Neighborhood Dining Guide
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">
          Explore Curated Venues
        </h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Browse authentic dining rooms, discover operating hours, and secure real-time bookings.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
        <form onSubmit={handleApplyFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by restaurant name, cuisine, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Neighborhood Select */}
          <div>
            <select
              value={neighborhood}
              onChange={(e) => {
                setNeighborhood(e.target.value);
                const params = Object.fromEntries(searchParams.entries());
                if (e.target.value) params.neighborhood = e.target.value;
                else delete params.neighborhood;
                setSearchParams(params);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
            >
              <option value="">All Neighborhoods</option>
              {neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Cuisine Select */}
          <div>
            <select
              value={cuisine}
              onChange={(e) => {
                setCuisine(e.target.value);
                const params = Object.fromEntries(searchParams.entries());
                if (e.target.value) params.cuisine = e.target.value;
                else delete params.cuisine;
                setSearchParams(params);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
            >
              <option value="">All Cuisines</option>
              {cuisines.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Quick Filter Buttons & Clear Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick Cuisine:</span>
            {cuisines.slice(0, 5).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCuisine(c === cuisine ? '' : c);
                  const params = Object.fromEntries(searchParams.entries());
                  if (c === cuisine) delete params.cuisine;
                  else params.cuisine = c;
                  setSearchParams(params);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  cuisine === c
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {(search || neighborhood || cuisine) && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{restaurants.length}</strong> available dining destinations
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-white/5 animate-pulse"></div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl border border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">
              No matching restaurants found
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              We couldn't find any dining locations matching your current search parameters. Try clearing your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
