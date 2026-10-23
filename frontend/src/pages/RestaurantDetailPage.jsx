import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import BookingModal from '../components/BookingModal';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ArrowLeft,
  Calendar,
  Sparkles,
  Check,
  ShieldCheck,
  Grid,
} from 'lucide-react';
import { getRestaurantImagesWithFallback } from '../utils/defaultImages';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/restaurants/${id}`);
        setRestaurant(res.data.data);
      } catch (err) {
        console.error('Failed to fetch restaurant details:', err);
        setError('Restaurant not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">{error || 'Restaurant not found'}</h2>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  const images = getRestaurantImagesWithFallback(restaurant);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <Link
        to="/restaurants"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Restaurants
      </Link>

      {/* Hero Visual Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden glass-panel border border-white/10 p-2">
        <div className="md:col-span-2 h-[340px] md:h-[460px] rounded-2xl overflow-hidden relative">
          <img
            src={images[0]}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6">
            <span className="glass-panel px-3 py-1 rounded-full text-xs font-semibold text-amber-300 inline-flex items-center gap-1.5 border border-amber-500/30 mb-3">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {restaurant.neighborhood}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
              {restaurant.name}
            </h1>
          </div>
        </div>

        <div className="hidden md:flex flex-col gap-4 h-[460px]">
          <div className="flex-1 rounded-2xl overflow-hidden">
            <img
              src={images[1] || images[0]}
              alt="Dining Room Atmosphere"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 rounded-2xl glass-panel bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Zero Double-Booking
              </span>
              <h3 className="font-display text-lg font-bold text-white">
                Live Table Concurrency
              </h3>
              <p className="text-xs text-slate-300">
                Seating is checked and allocated dynamically via Mongoose table locks.
              </p>
            </div>
            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Book This Restaurant
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Details vs Sticky Booking Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Details, Ethos, Schedule */}
        <div className="lg:col-span-2 space-y-10">
          {/* Cuisines and Metadata */}
          <div className="flex flex-wrap items-center gap-2">
            {restaurant.cuisine?.map((c, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
              >
                {c}
              </span>
            ))}
            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 text-slate-300 border border-white/5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {restaurant.slotDurationMinutes || 90} Minutes Dining Window
            </span>
          </div>

          {/* Description */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <h2 className="font-display text-2xl font-bold text-white">
              About the Dining Experience
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {restaurant.description}
            </p>

            <div className="pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
              {restaurant.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              {restaurant.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{restaurant.email}</span>
                </div>
              )}
              {restaurant.address && (
                <div className="sm:col-span-2 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    {restaurant.address.street && `${restaurant.address.street}, `}
                    {restaurant.address.city && `${restaurant.address.city}, `}
                    {restaurant.address.state} {restaurant.address.zipCode}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Operating Hours Table */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Operating Schedule
              </h2>
              <span className="text-xs text-slate-400">Reservations open in 30-min intervals</span>
            </div>

            <div className="divide-y divide-white/5 text-xs">
              {restaurant.operatingHours?.map((day, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <span className="font-medium text-slate-300">{day.dayName}</span>
                  {day.isClosed ? (
                    <span className="text-rose-400 font-semibold uppercase tracking-wider text-[11px]">
                      Closed
                    </span>
                  ) : (
                    <span className="text-white font-mono">
                      {day.openTime} — {day.closeTime}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Action Card */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 shadow-xl space-y-6 lg:sticky lg:top-28">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                Guaranteed Seating
              </span>
              <h3 className="font-display text-xl font-bold text-white">
                Reserve Your Table
              </h3>
              <p className="text-xs text-slate-400">
                Select your preferred date, party size, and instantly lock in your dining slot.
              </p>
            </div>

            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Select Date & Time</span>
            </button>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant confirmation code</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero reservation fees</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Easy cancellation up to booking time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Booking Modal */}
      <BookingModal
        restaurant={restaurant}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
};

export default RestaurantDetailPage;
