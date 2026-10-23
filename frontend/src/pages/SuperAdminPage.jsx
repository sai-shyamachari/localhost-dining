import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  ShieldAlert,
  Building,
  Plus,
  Trash2,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  MapPin,
  Utensils,
} from 'lucide-react';

const SuperAdminPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('Downtown');
  const [cuisine, setCuisine] = useState('Contemporary, Fine Dining');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('Password123!');
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(90);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [restRes, healthRes] = await Promise.all([
        api.get('/restaurants?status=all'),
        api.get('/healthcheck'),
      ]);
      setRestaurants(restRes.data.data);
      setHealth(healthRes.data);
    } catch (err) {
      console.error('Failed to query super admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnboard = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name,
        description,
        neighborhood,
        cuisine,
        phone: phone?.trim() || undefined,
        email: email?.trim() || adminEmail?.trim() || undefined,
        adminName: adminName?.trim() || undefined,
        adminEmail: adminEmail?.trim() || undefined,
        adminPassword: adminPassword || undefined,
        slotDurationMinutes: Number(slotDurationMinutes),
      };

      await api.post('/restaurants', payload);

      setModalOpen(false);
      setName('');
      setDescription('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to onboard restaurant.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRestaurant = async (id, restName) => {
    if (!window.confirm(`Permanently remove ${restName} and all its tables and reservations?`)) return;
    try {
      await api.delete(`/restaurants/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting restaurant');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Platform Oversight
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Super Admin Level
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
            Tenant Management & Health
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global view of all onboarded restaurant tenants, admin assignments, and cluster health.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Restaurant</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Active Tenants
            </span>
            <span className="text-2xl font-bold text-white font-mono mt-0.5 block">
              {restaurants.length} Restaurants
            </span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              System Health
            </span>
            <span className="text-2xl font-bold text-emerald-400 font-mono mt-0.5 block">
              {health?.status || 'UP'} ({health?.database?.status || 'connected'})
            </span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Database Cluster
            </span>
            <span className="text-xs font-mono text-slate-300 mt-0.5 block truncate max-w-[180px]">
              {health?.database?.host || 'MongoDB Atlas'}
            </span>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden space-y-4 p-6">
        <h2 className="font-display text-xl font-bold text-white">
          Onboarded Restaurant Tenants
        </h2>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
            Fetching tenant directory...
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No restaurants found. Click 'Onboard Restaurant' to create the first tenant.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 bg-white/[0.02]">
                <tr>
                  <th className="py-3 px-4">Restaurant</th>
                  <th className="py-3 px-4">Neighborhood</th>
                  <th className="py-3 px-4">Cuisine</th>
                  <th className="py-3 px-4">Tenant Admin</th>
                  <th className="py-3 px-4">Slot</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {restaurants.map((rest) => (
                  <tr key={rest._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-semibold text-white">
                      {rest.name}
                      <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                        ID: {rest._id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-amber-300">
                        {rest.neighborhood}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {rest.cuisine?.slice(0, 2).join(', ')}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px]">
                      {rest.adminUser?.email || 'Unassigned'}
                    </td>
                    <td className="py-4 px-4 font-mono">
                      {rest.slotDurationMinutes || 90}m
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDeleteRestaurant(rest._id, rest.name)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Restaurant Tenant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboard Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl glass-panel bg-[#0d131f] border border-amber-500/20 p-6 rounded-2xl shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display text-xl font-bold text-white">
                Onboard New Restaurant Tenant
              </h3>
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

            <form onSubmit={handleOnboard} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Restaurant Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bella Vista Trattoria"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Description:
                </label>
                <textarea
                  rows={2}
                  placeholder="Atmosphere, chef background, culinary specialty..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Neighborhood:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Downtown"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Cuisine Types (comma-separated):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Italian, Pasta, Pizza"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Contact Phone:
                  </label>
                  <input
                    type="text"
                    placeholder="+1 555-019-3344"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Slot Duration (Minutes):
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="240"
                    value={slotDurationMinutes}
                    onChange={(e) => setSlotDurationMinutes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Automatic Restaurant Admin Provisioning */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <span className="font-bold text-amber-400 block">
                  Assign / Provision Restaurant Admin Account:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Admin Full Name"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs"
                  />
                  <input
                    type="email"
                    placeholder="admin@restaurant.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs"
                  />
                </div>
                <input
                  type="password"
                  placeholder="Initial Password (e.g. Password123!)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {saving ? 'Onboarding...' : 'Confirm Onboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
