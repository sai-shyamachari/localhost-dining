import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CalendarX2,
  UtensilsCrossed,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Cancel modal state
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reservations/my-bookings');
      setBookings(res.data.data);
    } catch (err) {
      console.error('Failed to load personal bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      await api.delete(`/reservations/${cancelModalBooking._id}`, {
        data: { reason: cancelReason || 'Cancelled by diner via web client' },
      });
      setCancelModalBooking(null);
      setCancelReason('');
      fetchBookings();
    } catch (err) {
      console.error('Failed to cancel reservation:', err);
    } finally {
      setCancelling(false);
    }
  };

  // Filter bookings according to activeTab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') {
      return ['confirmed', 'seated', 'pending'].includes(b.status);
    }
    if (activeTab === 'completed') {
      return b.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return b.status === 'cancelled';
    }
    return true;
  });

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
            Personal Concierge
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            My Dining Reservations
          </h1>
        </div>

        <Link
          to="/restaurants"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
        >
          Book Another Table
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
        {[
          { key: 'all', label: 'All Bookings' },
          { key: 'upcoming', label: 'Upcoming & Active' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 rounded-2xl glass-panel animate-pulse"></div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-3xl border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl font-bold text-white">
            No reservations in this view
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            You don't have any bookings matching the current filter. Ready to explore exceptional culinary rooms?
          </p>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            <span>Explore Restaurants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((res) => {
            const isCancellable = ['pending', 'confirmed'].includes(res.status);
            const restaurant = res.restaurantId;
            const table = res.tableId;

            return (
              <div
                key={res._id}
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={res.status} />
                    <span className="text-xs text-slate-400 font-mono">
                      Ref #{res._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white">
                    {restaurant?.name || 'Local Restaurant'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>{formatDate(res.reservationDate)}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>
                        {res.startTime} — {res.endTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>{res.partySize} Guests</span>
                    </div>

                    {table?.tableNumber && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-300">
                        <span>Table {table.tableNumber}</span>
                      </div>
                    )}
                  </div>

                  {res.specialRequests && (
                    <p className="text-xs text-slate-400 italic">
                      Note: "{res.specialRequests}"
                    </p>
                  )}

                  {res.cancellationReason && (
                    <p className="text-xs text-rose-400">
                      Cancelled Reason: {res.cancellationReason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                  {restaurant?._id && (
                    <Link
                      to={`/restaurants/${restaurant._id}`}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      View Venue
                    </Link>
                  )}

                  {isCancellable && (
                    <button
                      onClick={() => setCancelModalBooking(res)}
                      className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20 transition-colors cursor-pointer"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel bg-[#0d131f] border border-rose-500/30 p-6 rounded-2xl shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold text-white">
                Cancel Reservation?
              </h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to release your table at{' '}
                <strong className="text-white">
                  {cancelModalBooking.restaurantId?.name}
                </strong>{' '}
                for {formatDate(cancelModalBooking.reservationDate)} at{' '}
                {cancelModalBooking.startTime}?
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reason for cancellation (optional):
              </label>
              <input
                type="text"
                placeholder="e.g., Change of schedule"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Keep Reservation
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                {cancelling ? 'Releasing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
