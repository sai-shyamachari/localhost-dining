import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  X,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  MessageSquare,
} from 'lucide-react';

const BookingModal = ({ restaurant, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated, quickLogin } = useAuth();
  const navigate = useNavigate();

  const getTodayString = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const [date, setDate] = useState(getTodayString);
  const [partySize, setPartySize] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const [slotsLoading, setSlotsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isClosedDay, setIsClosedDay] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Fetch slots whenever date or partySize changes
  useEffect(() => {
    if (!isOpen || !restaurant?._id) return;

    const fetchAvailability = async () => {
      setSlotsLoading(true);
      setBookingError(null);
      setSelectedSlot(null);
      try {
        const res = await api.get(
          `/restaurants/${restaurant._id}/availability?date=${date}&partySize=${partySize}`
        );
        const data = res.data.data;
        setIsClosedDay(!data.isOpen);
        setAvailableSlots(data.availableSlots || []);
      } catch (err) {
        console.error('Failed to query availability:', err);
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchAvailability();
  }, [date, partySize, restaurant?._id, isOpen]);

  if (!isOpen) return null;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setBookingError('Please choose an available time slot.');
      return;
    }

    if (!isAuthenticated) {
      setBookingError('Please sign in or select a demo account below to confirm your booking.');
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    try {
      const payload = {
        restaurantId: restaurant._id,
        reservationDate: date,
        startTime: selectedSlot.startTime,
        partySize: Number(partySize),
        specialRequests,
        guestPhone,
        guestName: user.name,
        guestEmail: user.email,
      };

      const res = await api.post('/reservations', payload);
      setBookingSuccess(res.data.data);
      if (onSuccess) onSuccess(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to complete reservation. Concurrency check conflict.';
      setBookingError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDinerLogin = async () => {
    try {
      await quickLogin('alice');
      setBookingError(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl glass-panel bg-[#0d131f] border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400">
              Confirm Reservation
            </span>
            <h2 className="font-display text-2xl font-bold text-white">
              {restaurant?.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {bookingSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                Table Reserved Successfully!
              </h3>
              <p className="text-sm text-slate-300 max-w-sm mx-auto">
                Your reservation at <span className="text-amber-400 font-semibold">{restaurant.name}</span> for party of {partySize} on {date} at {selectedSlot?.startTime} is confirmed.
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto text-xs text-left space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Assigned Table:</span>
                  <span className="text-white font-semibold">{bookingSuccess.tableId?.tableNumber || 'Auto-allocated'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Guest Name:</span>
                  <span className="text-white font-semibold">{bookingSuccess.guestName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Confirmation Code:</span>
                  <span className="font-mono text-amber-300">{bookingSuccess._id}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/my-bookings');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  View in My Bookings
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitBooking} className="space-y-5">
              {/* Error Notice */}
              {bookingError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">{bookingError}</div>
                </div>
              )}

              {/* Date & Guests Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    min={getTodayString()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Party Size (Guests)
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Real-time Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Available Seating Times ({restaurant?.slotDurationMinutes || 90}m)
                  </span>
                  {selectedSlot && (
                    <span className="text-amber-400 font-bold">
                      Selected: {selectedSlot.startTime} - {selectedSlot.endTime}
                    </span>
                  )}
                </label>

                {slotsLoading ? (
                  <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
                    Computing live table availability...
                  </div>
                ) : isClosedDay ? (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center">
                    The restaurant is closed on this day of the week. Please choose another date.
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center">
                    No tables available for a party of {partySize} on this date. Try adjusting your guest count or date.
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1">
                    {availableSlots.map((slot, index) => {
                      const isSelected = selectedSlot?.startTime === slot.startTime;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-1 text-center rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                              : 'bg-white/5 text-slate-200 border-white/10 hover:border-amber-500/40 hover:bg-white/10'
                          }`}
                        >
                          {slot.startTime}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Contact Info & Special Notes */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    Contact Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 555-012-3456"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    Special Requests (Allergies, Seating Preference)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Birthday celebration, prefer window table, gluten-free diner"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Authentication Prompt if logged out */}
              {!isAuthenticated && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="text-xs text-amber-200">
                    <span className="font-bold">Not signed in:</span> Click below to book using demo account Alice.
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickDinerLogin}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Use Alice (Demo)
                  </button>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedSlot || slotsLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {submitting ? 'Confirming...' : 'Reserve Table'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
