import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowUpRight, Utensils } from 'lucide-react';
import { getRestaurantImagesWithFallback } from '../utils/defaultImages';

const RestaurantCard = ({ restaurant }) => {
  const images = getRestaurantImagesWithFallback(restaurant);
  const coverImage = images[0];

  return (
    <div className="group glass-panel rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/40">
      {/* Cover Image & Badges */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

        {/* Neighborhood Pill */}
        <div className="absolute top-4 left-4">
          <span className="glass-panel px-3 py-1 rounded-full text-xs font-semibold text-amber-300 flex items-center gap-1.5 backdrop-blur-md border border-amber-500/30">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {restaurant.neighborhood}
          </span>
        </div>

        {/* Slot Duration */}
        <div className="absolute top-4 right-4">
          <span className="glass-panel px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-200 flex items-center gap-1 backdrop-blur-md">
            <Clock className="w-3 h-3 text-amber-400" />
            {restaurant.slotDurationMinutes || 90}m Slot
          </span>
        </div>

        {/* Cuisine Tags on bottom of image */}
        <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
          {restaurant.cuisine?.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/60 text-slate-200 border border-white/10 backdrop-blur-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
            {restaurant.name}
          </h3>
          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-amber-500" />
            <span>Table Reservations</span>
          </div>

          <Link
            to={`/restaurants/${restaurant._id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-0.5 transition-all"
          >
            <span>Reserve Table</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
