import React, { useState, useId } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  BatteryCharging,
  Clock,
  Heart,
  Scale,
  Award
} from 'lucide-react';
import { AdvisorCriteria, AdvisorRecommendation, Vehicle, VehicleCategory } from '../types';
import { calculateRecommendations } from '../utils/advisorEngine';
import { ALL_VEHICLE_TYPES } from '../data/vehicles';
import { formatINR, formatLakhs } from '../utils/formatters';

interface AdvisorViewProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  favorites: string[];
  onToggleFavorite: (vehicle: Vehicle) => void;
  compareList: string[];
  onToggleCompare: (vehicle: Vehicle) => void;
  initialCriteria?: Partial<AdvisorCriteria>;
}

export const AdvisorView: React.FC<AdvisorViewProps> = ({
  vehicles,
  onSelectVehicle,
  favorites,
  onToggleFavorite,
  compareList,
  onToggleCompare,
  initialCriteria
}) => {
  const budgetSliderId = useId();
  const dailySliderId = useId();

  // Criteria state with realistic Indian defaults
  const [criteria, setCriteria] = useState<AdvisorCriteria>({
    budget: initialCriteria?.budget || 2000000,
    dailyDistance: initialCriteria?.dailyDistance || 40,
    requiredRange: initialCriteria?.requiredRange || 200,
    preferredCategory: initialCriteria?.preferredCategory || 'any',
    preferredType: initialCriteria?.preferredType || 'any',
    chargingPreference: initialCriteria?.chargingPreference || 'any'
  });

  const [hasSubmitted, setHasSubmitted] = useState(true);

  // Compute recommendations
  const recommendations = calculateRecommendations(criteria, vehicles);
  const topMatch = recommendations[0];
  const otherMatches = recommendations.slice(1, 4);

  const budgetPresets = [
    { label: '₹1.5 Lakh', value: 150000 },
    { label: '₹3 Lakh', value: 300000 },
    { label: '₹12 Lakh', value: 1200000 },
    { label: '₹20 Lakh', value: 2000000 },
    { label: '₹35 Lakh', value: 3500000 },
    { label: '₹70 Lakh', value: 7000000 }
  ];

  const categoryOptions: { id: 'any' | VehicleCategory; label: string }[] = [
    { id: 'any', label: 'All Categories' },
    { id: 'Cars', label: 'Cars' },
    { id: 'Bikes', label: 'Bikes' },
    { id: 'Scooters', label: 'Scooters' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Advisor Header */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Smart Vehicle Advisor
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
          Find Your Perfect Electric Match
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tell us about your budget, daily travel habits, and charging routine. Our intelligent recommendation algorithm analyzes real-world Indian EV specs to match you with ideal vehicles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Questionnaire Form (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Your Requirements
            </h2>
            <span className="text-xs text-slate-400 font-medium">Step 1 of 1</span>
          </div>

          {/* 1. Category Selection */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              1. Vehicle Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {categoryOptions.map((cat) => {
                const isSelected = (criteria.preferredCategory || 'any') === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    id={`advisor-cat-${cat.id.toLowerCase()}`}
                    onClick={() => setCriteria({ ...criteria, preferredCategory: cat.id })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Budget */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor={budgetSliderId} className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Maximum Budget (₹)
              </label>
              <span className="text-sm font-extrabold text-emerald-700 font-display">
                {formatLakhs(criteria.budget)}
              </span>
            </div>
            <input
              id={budgetSliderId}
              type="range"
              min="100000"
              max="7000000"
              step="50000"
              value={criteria.budget}
              onChange={(e) =>
                setCriteria({ ...criteria, budget: Number(e.target.value) })
              }
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-2">
              {budgetPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setCriteria({ ...criteria, budget: preset.value })}
                  className={`py-1 px-1.5 rounded-lg text-[11px] font-semibold border transition-all text-center cursor-pointer ${
                    criteria.budget === preset.value
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Daily Driving Distance */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor={dailySliderId} className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Daily Commute Distance
              </label>
              <span className="text-sm font-extrabold text-teal-700 font-display">
                {criteria.dailyDistance} km / day
              </span>
            </div>
            <input
              id={dailySliderId}
              type="range"
              min="10"
              max="150"
              step="5"
              value={criteria.dailyDistance}
              onChange={(e) =>
                setCriteria({ ...criteria, dailyDistance: Number(e.target.value) })
              }
              className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>10 km (City Run)</span>
              <span>45 km (Office Commute)</span>
              <span>150 km (Intercity)</span>
            </div>
          </div>

          {/* 4. Required Driving Range */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              4. Minimum Desired Range
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[100, 200, 350, 500].map((rng) => (
                <button
                  key={rng}
                  type="button"
                  id={`advisor-range-${rng}`}
                  onClick={() => setCriteria({ ...criteria, requiredRange: rng })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    criteria.requiredRange === rng
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {rng}+ km
                </button>
              ))}
            </div>
          </div>

          {/* 5. Preferred Vehicle Type */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              5. Preferred Body / Vehicle Type
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                id="advisor-type-any"
                onClick={() => setCriteria({ ...criteria, preferredType: 'any' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                  criteria.preferredType === 'any'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-500'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ✓ Any Type
              </button>
              {ALL_VEHICLE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  id={`advisor-type-${type.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setCriteria({ ...criteria, preferredType: type })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left truncate cursor-pointer ${
                    criteria.preferredType === type
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-500'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Charging Preference */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              6. Charging Preference
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                id="advisor-charge-home"
                onClick={() => setCriteria({ ...criteria, chargingPreference: 'home' })}
                className={`p-3 rounded-xl text-xs text-left border transition-all flex items-center justify-between ${
                  criteria.chargingPreference === 'home'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className="font-bold block">Primarily Home Charging</span>
                  <span className="text-[11px] text-slate-500">
                    Overnight wallbox AC charging at home or apartment
                  </span>
                </div>
                {criteria.chargingPreference === 'home' && (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </button>

              <button
                type="button"
                id="advisor-charge-public"
                onClick={() =>
                  setCriteria({ ...criteria, chargingPreference: 'public_fast' })
                }
                className={`p-3 rounded-xl text-xs text-left border transition-all flex items-center justify-between ${
                  criteria.chargingPreference === 'public_fast'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className="font-bold block">Fast DC Public Charging</span>
                  <span className="text-[11px] text-slate-500">
                    Highways, rapid commercial chargers & quick turnarounds
                  </span>
                </div>
                {criteria.chargingPreference === 'public_fast' && (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </button>

              <button
                type="button"
                id="advisor-charge-any"
                onClick={() => setCriteria({ ...criteria, chargingPreference: 'any' })}
                className={`p-3 rounded-xl text-xs text-left border transition-all flex items-center justify-between ${
                  criteria.chargingPreference === 'any'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className="font-bold block">Flexible / Both</span>
                  <span className="text-[11px] text-slate-500">
                    Balanced city driving with occasional highway trips
                  </span>
                </div>
                {criteria.chargingPreference === 'any' && (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations Output Section (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Recommended for You
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Personalized Analysis
            </span>
          </div>

          {/* Top Recommendation Hero Card */}
          {topMatch && (
            <div
              id={`top-recommendation-${topMatch.vehicle.id}`}
              className="bg-white rounded-3xl border-2 border-emerald-400 overflow-hidden shadow-lg"
            >
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 sm:p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                    <Award className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-100 block">
                      #1 Top Match for You
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold font-display">
                      {topMatch.vehicle.name}
                    </h3>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-white border border-white/20">
                    <span>{topMatch.matchScore}% Match</span>
                  </div>
                  <span className="text-[11px] text-emerald-100 block mt-0.5">
                    {topMatch.verdict}
                  </span>
                </div>
              </div>

              {/* Photo & Quick Details */}
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center mb-5">
                  <div className="sm:col-span-5 relative rounded-2xl overflow-hidden aspect-16/10 bg-slate-100 border border-slate-200">
                    <img
                      src={topMatch.vehicle.vehicleImage}
                      alt={topMatch.vehicle.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
                      {topMatch.vehicle.vehicleType}
                    </span>
                  </div>

                  <div className="sm:col-span-7">
                    <div className="flex items-baseline justify-between mb-2">
                      <div>
                        <span className="text-xs text-slate-400 font-medium block">Price</span>
                        <span className="text-2xl font-extrabold font-display text-slate-900">
                          {topMatch.vehicle.priceDisplay}
                        </span>
                        <span className="text-xs text-slate-500 ml-1 font-medium">
                          ({formatLakhs(topMatch.vehicle.price)})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-medium block">Range</span>
                        <span className="text-lg font-bold text-emerald-700 font-display">
                          {topMatch.vehicle.drivingRangeDisplay}
                        </span>
                      </div>
                    </div>

                    {/* Spec tags */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 mb-3">
                      <div className="text-slate-600">
                        <span className="text-slate-400 block text-[10px]">Battery Pack</span>
                        <span className="font-bold text-slate-800">
                          {topMatch.vehicle.batteryCapacityDisplay}
                        </span>
                      </div>
                      <div className="text-slate-600">
                        <span className="text-slate-400 block text-[10px]">DC Fast Charging</span>
                        <span className="font-bold text-slate-800">
                          {topMatch.vehicle.chargingTime}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {topMatch.vehicle.description}
                    </p>
                  </div>
                </div>

                {/* "Why This Matches You" Explanations */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 mb-5">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Why this matches your exact requirements:
                  </h4>
                  <ul className="space-y-1.5">
                    {topMatch.matchReasons.map((reason, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-emerald-950 font-medium flex items-start gap-2"
                      >
                        <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    id={`advisor-view-details-${topMatch.vehicle.id}`}
                    onClick={() => onSelectVehicle(topMatch.vehicle)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    View Full Specifications
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onToggleFavorite(topMatch.vehicle)}
                    className={`py-2.5 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      favorites.includes(topMatch.vehicle.id)
                        ? 'bg-rose-50 border-rose-300 text-rose-600'
                        : 'border-slate-300 hover:border-rose-300 text-slate-700'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(topMatch.vehicle.id)
                          ? 'fill-rose-600 text-rose-600'
                          : ''
                      }`}
                    />
                    <span>{favorites.includes(topMatch.vehicle.id) ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={() => onToggleCompare(topMatch.vehicle)}
                    className={`py-2.5 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      compareList.includes(topMatch.vehicle.id)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-300 hover:border-emerald-500 text-slate-700'
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>{compareList.includes(topMatch.vehicle.id) ? 'Compared' : 'Compare'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alternative Recommendations */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
              Alternative Strong Matches
            </h3>
            <div className="space-y-3">
              {otherMatches.map((rec, index) => (
                <div
                  key={rec.vehicle.id}
                  id={`alt-rec-${rec.vehicle.id}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-4 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={rec.vehicle.vehicleImage}
                      alt={rec.vehicle.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-13 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">
                          {rec.vehicle.brand}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                          {rec.matchScore}% Match
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {rec.vehicle.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span className="font-extrabold text-slate-900 font-display">
                          {rec.vehicle.priceDisplay}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-700">
                          {rec.vehicle.drivingRangeDisplay}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {rec.matchReasons[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => onSelectVehicle(rec.vehicle)}
                      className="flex-1 sm:flex-initial py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onToggleCompare(rec.vehicle)}
                      className={`p-2 rounded-lg border text-xs transition-colors ${
                        compareList.includes(rec.vehicle.id)
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      title="Compare"
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleFavorite(rec.vehicle)}
                      className={`p-2 rounded-lg border text-xs transition-colors ${
                        favorites.includes(rec.vehicle.id)
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      title="Save to Favorites"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          favorites.includes(rec.vehicle.id) ? 'fill-rose-600' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
