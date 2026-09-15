import React, { useState } from 'react';
import {
  X,
  Heart,
  Scale,
  Zap,
  BatteryCharging,
  Gauge,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Award,
  Maximize2,
  Users,
  Briefcase
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatINR, formatLakhs } from '../utils/formatters';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (vehicle: Vehicle) => void;
  isInCompare: boolean;
  onToggleCompare: (vehicle: Vehicle) => void;
  onGetRecommendation: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  isFavorite,
  onToggleFavorite,
  isInCompare,
  onToggleCompare,
  onGetRecommendation
}) => {
  const [imgError, setImgError] = useState(false);

  if (!vehicle) return null;

  const fallbackUrl =
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80';

  return (
    <div
      id="vehicle-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="vehicle-detail-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Sticky Close Button */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center transition-colors shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo Section */}
        <div className="relative w-full aspect-16/9 sm:aspect-21/9 bg-slate-900 overflow-hidden">
          <img
            src={imgError ? fallbackUrl : vehicle.vehicleImage}
            alt={vehicle.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-md">
              {vehicle.tag}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-400/40 shadow-md backdrop-blur-md">
              {vehicle.category}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-slate-900 backdrop-blur-md shadow-md">
              {vehicle.vehicleType}
            </span>
          </div>

          {/* Bottom Title & Price on image */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div>
              <span className="text-emerald-400 font-semibold text-xs tracking-wider uppercase">
                {vehicle.brand} Electric
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
                {vehicle.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{vehicle.rating}</span>
                </div>
                <span className="text-slate-300 text-xs">({vehicle.reviewCount} verified reviews)</span>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-slate-300 font-medium block">Ex-Showroom Price</span>
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-300">
                {vehicle.priceDisplay}
              </span>
              <span className="text-xs text-slate-200 block font-medium">
                ({formatLakhs(vehicle.price)})
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Primary Action Buttons Bar */}
          <div className="flex flex-wrap items-center gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <button
              id="modal-fav-toggle-btn"
              onClick={() => onToggleFavorite(vehicle)}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isFavorite
                  ? 'bg-rose-50 border border-rose-300 text-rose-700 shadow-xs'
                  : 'bg-white border border-slate-300 hover:border-rose-300 text-slate-700 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
              {isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}
            </button>

            <button
              id="modal-compare-toggle-btn"
              onClick={() => onToggleCompare(vehicle)}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isInCompare
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-300 hover:border-emerald-400 text-slate-700 hover:text-emerald-700'
              }`}
            >
              <Scale className="w-4.5 h-4.5" />
              {isInCompare ? 'In Comparison List' : 'Compare Vehicle'}
            </button>

            <button
              id="modal-advisor-btn"
              onClick={() => {
                onClose();
                onGetRecommendation(vehicle);
              }}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <Sparkles className="w-4.5 h-4.5" />
              Get Recommendation
            </button>
          </div>

          {/* Comprehensive Specifications Matrix */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Gauge className="w-4.5 h-4.5 text-emerald-600" />
              Key Performance & Technical Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Driving Range
                </span>
                <span className="text-base font-bold text-slate-900 block font-display">
                  {vehicle.drivingRangeDisplay}
                </span>
                <span className="text-[11px] text-slate-500">ARAI Certified</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-teal-600" />
                  Battery Pack
                </span>
                <span className="text-base font-bold text-slate-900 block font-display">
                  {vehicle.batteryCapacityDisplay}
                </span>
                <span className="text-[11px] text-slate-500">Lithium-ion IP67</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Fast Charging
                </span>
                <span className="text-base font-bold text-slate-900 block font-display truncate" title={vehicle.chargingTime}>
                  {vehicle.chargingTime}
                </span>
                <span className="text-[11px] text-slate-500">DC Fast Charge</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <Gauge className="w-3.5 h-3.5 text-cyan-600" />
                  Top Speed
                </span>
                <span className="text-base font-bold text-slate-900 block font-display">
                  {vehicle.topSpeedDisplay}
                </span>
                <span className="text-[11px] text-slate-500">0-100: {vehicle.acceleration0to100}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Motor & Torque
                </span>
                <span className="text-sm font-bold text-slate-900 block truncate" title={vehicle.motorPower}>
                  {vehicle.motorPower}
                </span>
                <span className="text-[11px] text-slate-500">Permanent Magnet</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  Seating
                </span>
                <span className="text-base font-bold text-slate-900 block font-display">
                  {vehicle.seatingCapacity} Passengers
                </span>
                <span className="text-[11px] text-slate-500">Ergonomic seating</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                  Boot Space
                </span>
                <span className="text-base font-bold text-slate-900 block font-display">
                  {vehicle.bootSpace}
                </span>
                <span className="text-[11px] text-slate-500">Luggage capacity</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Warranty
                </span>
                <span className="text-xs font-bold text-slate-900 block truncate" title={vehicle.warranty}>
                  {vehicle.warranty}
                </span>
                <span className="text-[11px] text-slate-500">Manufacturer Assured</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">About {vehicle.name}</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              {vehicle.description}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Key Features & Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {vehicle.keyFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
