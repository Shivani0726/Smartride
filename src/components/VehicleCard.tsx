import React, { useState } from 'react';
import { Heart, Scale, BatteryCharging, Gauge, Zap, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { Vehicle } from '../types';
import { formatLakhs } from '../utils/formatters';

interface VehicleCardProps {
  vehicle: Vehicle;
  isFavorite: boolean;
  onToggleFavorite: (vehicle: Vehicle) => void;
  isInCompare: boolean;
  onToggleCompare: (vehicle: Vehicle) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onGetRecommendationFor?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isFavorite,
  onToggleFavorite,
  isInCompare,
  onToggleCompare,
  onSelectVehicle,
  onGetRecommendationFor
}) => {
  const [imageError, setImageError] = useState(false);

  // Fallback high-contrast EV photography if direct Wikimedia CDN faces connection limits
  const fallbackUrl =
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80';

  const getTagBadge = () => {
    switch (vehicle.tag) {
      case 'Featured':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Popular':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'New Arrival':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div
      id={`vehicle-card-${vehicle.id}`}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-16/10 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelectVehicle(vehicle)}>
        <img
          src={imageError ? fallbackUrl : vehicle.vehicleImage}
          alt={vehicle.name}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20 pointer-events-none" />

        {/* Tag Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-xs shadow-xs ${getTagBadge()}`}>
            {vehicle.tag}
          </span>
          <span className="text-xs font-bold px-2 py-0.8 rounded-full bg-emerald-950/80 text-emerald-300 backdrop-blur-xs border border-emerald-400/30">
            {vehicle.category}
          </span>
          <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.8 rounded-full bg-slate-900/75 text-white backdrop-blur-xs border border-white/20">
            {vehicle.vehicleType}
          </span>
        </div>

        {/* Action Buttons in top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            id={`fav-btn-${vehicle.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(vehicle);
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xs ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                : 'bg-white/85 text-slate-700 hover:bg-white hover:text-rose-600'
            }`}
          >
            <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-rose-600' : ''}`} />
          </button>

          <button
            id={`compare-btn-${vehicle.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(vehicle);
            }}
            title={isInCompare ? 'Remove from comparison' : 'Add to compare'}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xs ${
              isInCompare
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-white/85 text-slate-700 hover:bg-white hover:text-emerald-700'
            }`}
          >
            <Scale className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Price Tag Overlay on bottom of photo */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between pointer-events-none text-white">
          <div>
            <span className="text-xl font-extrabold font-display drop-shadow-md tracking-tight">
              {vehicle.priceDisplay}
            </span>
            <span className="text-xs text-slate-200 ml-1.5 drop-shadow-xs font-medium">
              ({formatLakhs(vehicle.price)})
            </span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15 text-xs font-medium text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span className="font-bold text-white">{vehicle.rating}</span>
            <span className="text-slate-300 text-[11px]">({vehicle.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Name */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                {vehicle.brand}
              </span>
              <h3
                onClick={() => onSelectVehicle(vehicle)}
                className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
              >
                {vehicle.name}
              </h3>
            </div>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {vehicle.description}
          </p>

          {/* Spec Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 mb-3 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
                <Zap className="w-3 h-3 text-emerald-600" />
                Range
              </div>
              <span className="text-xs font-bold text-slate-800">
                {vehicle.drivingRangeDisplay}
              </span>
            </div>

            <div className="border-x border-slate-200/60">
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
                <BatteryCharging className="w-3 h-3 text-teal-600" />
                Battery
              </div>
              <span className="text-xs font-bold text-slate-800">
                {vehicle.batteryCapacityDisplay}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
                <Gauge className="w-3 h-3 text-cyan-600" />
                Top Speed
              </div>
              <span className="text-xs font-bold text-slate-800">
                {vehicle.topSpeedDisplay}
              </span>
            </div>
          </div>

          {/* Key Feature highlights */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {vehicle.keyFeatures.slice(0, 2).map((feature, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/70 truncate max-w-full"
              >
                ✓ {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <button
            id={`view-details-btn-${vehicle.id}`}
            onClick={() => onSelectVehicle(vehicle)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onGetRecommendationFor && (
            <button
              id={`advisor-rec-btn-${vehicle.id}`}
              onClick={() => onGetRecommendationFor(vehicle)}
              className="py-2 px-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors flex items-center gap-1"
              title="Find similar smart recommendations"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Advise</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
