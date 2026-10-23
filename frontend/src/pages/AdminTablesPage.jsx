import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  Grid,
  Plus,
  Trash2,
  Check,
  X,
  Users,
  MapPin,
  AlertCircle,
} from 'lucide-react';

const AdminTablesPage = () => {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId;

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // New table form state
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [location, setLocation] = useState('main_floor');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchTables = async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      const res = await api.get(`/restaurants/${restaurantId}/tables`);
      setTables(res.data.data);
    } catch (err) {
      console.error('Failed to load tables:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [restaurantId]);

  const handleAddTable = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post(`/restaurants/${restaurantId}/tables`, {
        tableNumber,
        capacity: Number(capacity),
        location,
      });
      setModalOpen(false);
      setTableNumber('');
      setCapacity(4);
      setLocation('main_floor');
      fetchTables();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add table.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (table) => {
    try {
      await api.patch(`/restaurants/${restaurantId}/tables/${table._id}`, {
        isActive: !table.isActive,
      });
      fetchTables();
    } catch (err) {
      console.error('Failed to update table:', err);
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;
    try {
      await api.delete(`/restaurants/${restaurantId}/tables/${tableId}`);
      fetchTables();
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete table with active bookings.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
            Inventory & Floor Setup
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Table Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure physical table inventory and seat limits for live concurrency allocation.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Table</span>
        </button>
      </div>

      {/* Tables Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-44 rounded-2xl glass-panel animate-pulse"></div>
          ))}
        </div>
      ) : tables.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-white/10 space-y-3">
          <Grid className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="font-display text-xl font-bold text-white">No Tables Configured</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click 'Add Table' above to create table inventory for this restaurant.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table) => (
            <div
              key={table._id}
              className={`glass-panel p-5 rounded-2xl border transition-all ${
                table.isActive
                  ? 'border-white/10 hover:border-amber-500/40'
                  : 'border-white/5 opacity-60 bg-slate-950/40'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-lg font-bold text-white bg-slate-900 border border-white/10 px-3 py-1 rounded-xl">
                  {table.tableNumber}
                </span>

                <button
                  onClick={() => handleToggleActive(table)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                    table.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20'
                  }`}
                >
                  {table.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Max Capacity: <strong className="text-white">{table.capacity} Guests</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="capitalize">
                    Zone: {table.location?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => handleDeleteTable(table._id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Table"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Table Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel bg-[#0d131f] border border-amber-500/20 p-6 rounded-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display text-xl font-bold text-white">Add New Table</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddTable} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Table Number or Label:
                </label>
                <input
                  type="text"
                  placeholder="e.g. T7, Patio-1, Bar-3"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Seating Capacity (Guests):
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Floor Zone / Location:
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
                >
                  <option value="main_floor">Main Floor</option>
                  <option value="patio">Outdoor Patio</option>
                  <option value="bar">Bar Counter</option>
                  <option value="private_room">Private Dining Room</option>
                  <option value="balcony">Balcony / Rooftop</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Add Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTablesPage;
