import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ShieldCheck, Clock, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#090d14] text-slate-400 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md">
                <UtensilsCrossed className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-display text-lg font-bold text-white tracking-tight">
                LocalHost <span className="gold-gradient-text font-serif italic">Dining</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated reservations for extraordinary neighborhood dining. Powered by real-time concurrency controls and multi-tenant restaurant isolation.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All systems & MongoDB Atlas online
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore & Book
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/restaurants" className="hover:text-amber-400 transition-colors">
                  All Restaurants
                </Link>
              </li>
              <li>
                <Link to="/restaurants?neighborhood=Downtown" className="hover:text-amber-400 transition-colors">
                  Downtown Venues
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Italian" className="hover:text-amber-400 transition-colors">
                  Italian & Fine Dining
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-amber-400 transition-colors">
                  Reservation History
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Pillars */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              System Guarantee
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zero Double-Booking Guarantee</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Live 30-Min Interval Sync</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Isolated Tenant Dashboards</span>
              </li>
            </ul>
          </div>

          {/* Admin Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Management Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/admin/dashboard" className="hover:text-amber-400 transition-colors">
                  Restaurant Floor Feed
                </Link>
              </li>
              <li>
                <Link to="/admin/tables" className="hover:text-amber-400 transition-colors">
                  Table & Inventory Matrix
                </Link>
              </li>
              <li>
                <Link to="/super-admin" className="hover:text-amber-400 transition-colors">
                  Super Admin Console
                </Link>
              </li>
              <li>
                <a
                  href="/api/v1/healthcheck"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  Health Check JSON API
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LocalHost Dining Backend & UI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for culinary excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
