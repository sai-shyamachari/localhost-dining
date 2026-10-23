import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import RestaurantCard from '../components/RestaurantCard';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Compass,
  Utensils,
  MapPin,
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/restaurants');
        setRestaurants(res.data.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next-Generation Multi-Tenant Dining Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Extraordinary Dining, <br />
            <span className="gold-gradient-text font-serif italic">Seamlessly Allocated.</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Reserve curated local tables in real time with absolute zero double-booking concurrency checks. Designed for passionate diners and modern restaurateurs.
          </p>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto glass-panel p-2.5 rounded-2xl border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center gap-2.5"
          >
            <div className="flex-1 flex items-center gap-3 px-3 w-full">
              <Search className="w-5 h-5 text-amber-400 shrink-0" />
              <input
                type="text"
                placeholder="Search cuisine, neighborhood, or venue name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Trending:</span>
            {['Downtown', 'Midtown', 'Italian', 'Japanese', 'Fine Dining'].map((tag) => (
              <Link
                key={tag}
                to={`/restaurants?search=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 border border-white/5 hover:border-amber-500/30 transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
              Curated Destinations
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Featured Local Restaurants
            </h2>
          </div>

          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 group"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-white/5 animate-pulse"></div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl text-slate-400">
            No restaurants available yet. Please run database seeder or add a restaurant via Super Admin.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* Pillars / How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 md:p-14 border border-white/10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              The LocalHost Advantage
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Built on Concurrency & Precision
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Traditional platforms experience double-booking collisions. LocalHost Dining employs real-time backend slot aggregation to ensure guaranteed seating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                1. Neighborhood Discovery
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by neighborhood, cuisine, and slot duration. Access authentic menus, photos, and exact operating schedules.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                2. Live Slot Intelligence
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Check 30-minute incremental availability computed dynamically against each venue's live table capacity matrix.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                3. Instant Table Allocation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero waiting for manual manager confirmations. Best-fit table assignment is locked instantaneously upon booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurateur CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-amber-500/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              For Restaurant Operators
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
              Manage Your Tables & Floor Feeds with Precision
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience isolated multi-tenant administration. Manage table configurations, mark seated guests in real time, and oversee your venue's capacity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/admin/dashboard"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 text-center"
            >
              Open Floor Feed
            </Link>
            <Link
              to="/super-admin"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all text-center"
            >
              Super Admin Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
