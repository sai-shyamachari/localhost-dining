import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import {
  Calendar,
  Clock,
  Users,
  Search,
  CheckCircle,
  Coffee,
  XCircle,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Utensils,
  MapPin,
  Camera,
  UploadCloud,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { getRestaurantImagesWithFallback } from '../utils/defaultImages';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId;

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(getTodayString);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurantInfo, setRestaurantInfo] = useState(null);

  // Photo upload states
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!selectedFile || !restaurantId) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      await api.post(`/restaurants/${restaurantId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadSuccess('Photo uploaded successfully to Cloudinary!');
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchFloorFeed(); // refreshes restaurantInfo.images
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.response?.data?.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const fetchFloorFeed = async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      const [feedRes, restRes] = await Promise.all([
        api.get(`/reservations/restaurant/${restaurantId}?date=${date}`),
        api.get(`/restaurants/${restaurantId}`),
      ]);
      setReservations(feedRes.data.data);
      setRestaurantInfo(restRes.data.data);
    } catch (err) {
      console.error('Failed to load floor feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloorFeed();
  }, [date, restaurantId]);

  const handleUpdateStatus = async (reservationId, newStatus) => {
    try {
      await api.patch(`/reservations/${reservationId}/status`, {
        status: newStatus,
      });
      fetchFloorFeed();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(err.response?.data?.message || 'Error updating reservation status');
    }
  };

  // Metrics
  const totalBookings = reservations.length;
  const totalGuests = reservations.reduce((acc, curr) => acc + (curr.partySize || 0), 0);
  const currentlySeated = reservations.filter((r) => r.status === 'seated').length;
  const confirmed = reservations.filter((r) => r.status === 'confirmed').length;

  const filteredReservations = reservations.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      const name = r.guestName?.toLowerCase() || '';
      const email = r.guestEmail?.toLowerCase() || '';
      const table = r.tableId?.tableNumber?.toLowerCase() || '';
      return name.includes(search) || email.includes(search) || table.includes(search);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Venue info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Tenant Floor Feed
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Admin Console
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
            {restaurantInfo?.name || 'Restaurant Floor Feed'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {restaurantInfo?.neighborhood} — Strict Tenant Data Isolation Active
          </p>
        </div>

        {/* Date Selector and Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass-panel px-3.5 py-2 rounded-xl border border-white/10">
            <Calendar className="w-4 h-4 text-amber-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={fetchFloorFeed}
            className="p-2.5 rounded-xl glass-panel border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Refresh Feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setPhotoModalOpen(true)}
            className="flex items-center gap-2 glass-panel px-3.5 py-2.5 rounded-xl border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-500/20 text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-amber-500/10"
            title="Upload and manage restaurant photos"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Manage Photos</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Day Bookings
          </span>
          <span className="text-3xl font-bold text-white mt-1 block font-mono">
            {totalBookings}
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Expected Guests
          </span>
          <span className="text-3xl font-bold text-amber-400 mt-1 block font-mono">
            {totalGuests}
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Currently Seated
          </span>
          <span className="text-3xl font-bold text-sky-400 mt-1 block font-mono">
            {currentlySeated}
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Confirmed Slots
          </span>
          <span className="text-3xl font-bold text-emerald-400 mt-1 block font-mono">
            {confirmed}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guest or table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { key: 'all', label: 'All' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'seated', label: 'Seated' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' },
            { key: 'no-show', label: 'No-Show' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floor Feed Table / Cards */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 animate-pulse">
          Loading floor schedule...
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="py-16 text-center glass-panel rounded-3xl border border-white/10 space-y-2 text-slate-400">
          <Utensils className="w-8 h-8 text-amber-400/50 mx-auto" />
          <h3 className="font-display text-xl font-bold text-white">No floor bookings found</h3>
          <p className="text-xs">No reservations scheduled for {date} with the active filters.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="divide-y divide-white/5">
            {filteredReservations.map((res) => (
              <div
                key={res._id}
                className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Time & Table identifier */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center font-mono">
                    <span className="text-amber-400 font-bold text-sm leading-none">
                      {res.startTime}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 leading-none">
                      {res.endTime}
                    </span>
                  </div>

                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                      Table {res.tableId?.tableNumber || 'Auto'}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-1 capitalize">
                      {res.tableId?.location?.replace('_', ' ') || 'Main Floor'} ({res.tableId?.capacity || 2} seats)
                    </span>
                  </div>
                </div>

                {/* Guest Details */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-white">
                      {res.guestName || res.userId?.name || 'Walk-in Guest'}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Users className="w-3 h-3 text-amber-400" />
                      {res.partySize} Guests
                    </span>
                    <StatusBadge status={res.status} />
                  </div>

                  <div className="text-xs text-slate-400 flex flex-wrap gap-4">
                    {res.guestPhone && <span>Phone: {res.guestPhone}</span>}
                    {res.guestEmail && <span>Email: {res.guestEmail}</span>}
                  </div>

                  {res.specialRequests && (
                    <p className="text-xs text-amber-300/90 italic">
                      Special Note: "{res.specialRequests}"
                    </p>
                  )}
                </div>

                {/* Status Transitions */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                  {res.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(res._id, 'seated')}
                      className="px-3.5 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Seat Guest
                    </button>
                  )}

                  {res.status === 'seated' && (
                    <button
                      onClick={() => handleUpdateStatus(res._id, 'completed')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Completed
                    </button>
                  )}

                  {['confirmed', 'pending'].includes(res.status) && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(res._id, 'no-show')}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 text-xs font-semibold cursor-pointer"
                      >
                        No-Show
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(res._id, 'cancelled')}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Management Modal */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl glass-panel bg-[#0d131f] border border-amber-500/30 p-6 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-400" />
                  Restaurant Photo Gallery & Cloudinary Upload
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload venue photography to Cloudinary. The newest upload becomes your primary showcase photo.
                </p>
              </div>
              <button
                onClick={() => {
                  setPhotoModalOpen(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setUploadError(null);
                  setUploadSuccess(null);
                }}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {/* Upload Box Form */}
            <form onSubmit={handleUploadPhoto} className="space-y-4">
              <div className="border-2 border-dashed border-white/15 hover:border-amber-500/50 rounded-2xl p-6 text-center transition-colors bg-white/[0.02]">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Upload Preview"
                      className="w-full h-48 object-cover rounded-xl border border-amber-500/30 mx-auto"
                    />
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-xs text-slate-300 font-medium">
                        Selected: {selectedFile?.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer space-y-2 block">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white block">
                      Click to browse or drop a photo here
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Supports JPG, PNG, WEBP, AVIF (Max 10MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {uploading ? 'Uploading to Cloudinary...' : 'Upload Photo'}
                </button>
              </div>
            </form>

            {/* Current Active Gallery */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                Current Gallery & Fallback Photos:
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {getRestaurantImagesWithFallback(restaurantInfo).map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative h-28 rounded-xl overflow-hidden border border-white/10 group"
                  >
                    <img
                      src={imgUrl}
                      alt={`Gallery item ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      {idx === 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 shadow">
                          Primary Cover
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-slate-300">
                          Photo #{idx + 1}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
