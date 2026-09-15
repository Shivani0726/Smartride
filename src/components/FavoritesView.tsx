import React from 'react';
import { Heart, Trash2, Scale, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import { formatINR, formatLakhs } from '../utils/formatters';

interface FavoritesViewProps {
  vehicles: Vehicle[];
  favoriteIds: string[];
  onToggleFavorite: (vehicle: Vehicle) => void;
  compareList: string[];
  onToggleCompare: (vehicle: Vehicle) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onGetRecommendationFor: (vehicle: Vehicle) => void;
  onNavigateToVehicles: () => void;
  onCompareAllFavorites: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  vehicles,
  favoriteIds,
  onToggleFavorite,
  compareList,
  onToggleCompare,
  onSelectVehicle,
  onGetRecommendationFor,
  onNavigateToVehicles,
  onCompareAllFavorites
}) => {
  const favoriteVehicles = vehicles.filter((v) => favoriteIds.includes(v.id));

  // Quick stats
  const avgPrice =
    favoriteVehicles.length > 0
      ? Math.round(
          favoriteVehicles.reduce((sum, v) => sum + v.price, 0) / favoriteVehicles.length
        )
      : 0;

  const avgRange =
    favoriteVehicles.length > 0
      ? Math.round(
          favoriteVehicles.reduce((sum, v) => sum + v.drivingRange, 0) /
            favoriteVehicles.length
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Heart className="w-5 h-5 fill-rose-600" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Saved Favorites
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {favoriteVehicles.length} {favoriteVehicles.length === 1 ? 'vehicle' : 'vehicles'} saved to your personal shortlist.
          </p>
        </div>

        {favoriteVehicles.length >= 2 && (
          <button
            id="compare-all-favs-btn"
            onClick={onCompareAllFavorites}
            className="self-start sm:self-auto py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
          >
            <Scale className="w-4 h-4" />
            Compare All Saved ({favoriteVehicles.length})
          </button>
        )}
      </div>

      {/* If Favorites are empty */}
      {favoriteVehicles.length === 0 ? (
        <div
          id="empty-favorites-state"
          className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-16 text-center max-w-xl mx-auto shadow-xs"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Your Wishlist is Empty
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Click the heart icon on any electric vehicle card to save it for quick access, comparison, and review.
          </p>

          <button
            id="fav-explore-vehicles-btn"
            onClick={onNavigateToVehicles}
            className="mt-6 py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-xs"
          >
            Explore Vehicles Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 shadow-xs">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Total Saved</span>
              <span className="text-xl font-extrabold text-slate-900 font-display">
                {favoriteVehicles.length} Models
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Average Price</span>
              <span className="text-xl font-extrabold text-slate-900 font-display">
                {formatINR(avgPrice)}
              </span>
              <span className="text-[11px] text-slate-500 block">
                ({formatLakhs(avgPrice)})
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400 font-medium block">Average Driving Range</span>
              <span className="text-xl font-extrabold text-emerald-700 font-display">
                {avgRange} km
              </span>
              <span className="text-[11px] text-slate-500 block">ARAI certified</span>
            </div>
          </div>

          {/* Grid of Favorite Vehicles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteVehicles.map((vehicle) => (
              <div key={vehicle.id} className="relative group">
                <VehicleCard
                  vehicle={vehicle}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  isInCompare={compareList.includes(vehicle.id)}
                  onToggleCompare={onToggleCompare}
                  onSelectVehicle={onSelectVehicle}
                  onGetRecommendationFor={onGetRecommendationFor}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
