import React from 'react';
import { Filter, RotateCcw, Check, Sparkles, Zap, BatteryCharging, Clock, Car, Bike, LayoutGrid } from 'lucide-react';
import { CategoryFilter, FilterState, VehicleType } from '../types';
import { ALL_BRANDS, ALL_VEHICLE_TYPES } from '../data/vehicles';
import { formatLakhs } from '../utils/formatters';

interface FilterSidebarProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  totalResults
}) => {
  const toggleBrand = (brand: string) => {
    const nextBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChangeFilters({ ...filters, brands: nextBrands });
  };

  const toggleType = (type: VehicleType) => {
    const nextTypes = filters.vehicleTypes.includes(type)
      ? filters.vehicleTypes.filter((t) => t !== type)
      : [...filters.vehicleTypes, type];
    onChangeFilters({ ...filters, vehicleTypes: nextTypes });
  };

  const hasActiveFilters =
    filters.category !== 'All Vehicles' ||
    filters.brands.length > 0 ||
    filters.vehicleTypes.length > 0 ||
    filters.maxPrice < 7000000 ||
    filters.minRange > 0 ||
    filters.minBattery > 0 ||
    filters.maxChargingMinutes < 180;

  const categories: { id: CategoryFilter; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'All Vehicles', label: 'All Vehicles', icon: LayoutGrid },
    { id: 'Cars', label: 'Cars', icon: Car },
    { id: 'Bikes', label: 'Bikes', icon: Bike },
    { id: 'Scooters', label: 'Scooters', icon: Zap }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-display">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filters ({totalResults} Models)</span>
        </div>
        {hasActiveFilters && (
          <button
            id="reset-all-filters-btn"
            onClick={onResetFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5">
          Category
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                id={`sidebar-category-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onChangeFilters({ ...filters, category: cat.id })}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-500 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Max Budget
          </label>
          <span className="text-xs font-extrabold text-emerald-700 font-display">
            Up to {formatLakhs(filters.maxPrice)}
          </span>
        </div>
        <input
          id="filter-price-slider"
          type="range"
          min="100000"
          max="7000000"
          step="100000"
          value={filters.maxPrice}
          onChange={(e) =>
            onChangeFilters({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
          <span>₹1 Lakh</span>
          <span>₹25 Lakh</span>
          <span>₹70 Lakh</span>
        </div>
      </div>

      {/* 2. Brand Multi-select */}
      <div>
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5">
          Brand
        </label>
        <div className="space-y-1.5">
          {ALL_BRANDS.map((brand) => {
            const checked = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                id={`filter-brand-${brand.toLowerCase()}`}
                className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  checked
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
                      checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{brand}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Vehicle Type */}
      <div>
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5">
          Vehicle Type
        </label>
        <div className="space-y-1.5">
          {ALL_VEHICLE_TYPES.map((type) => {
            const checked = filters.vehicleTypes.includes(type);
            return (
              <label
                key={type}
                id={`filter-type-${type.replace(/\s+/g, '-').toLowerCase()}`}
                className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  checked
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
                      checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{type}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Minimum Driving Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-600" />
            Min Range
          </label>
          <span className="text-xs font-bold text-emerald-700 font-display">
            {filters.minRange > 0 ? `${filters.minRange}+ km` : 'Any'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 300, 450].map((rangeVal) => (
            <button
              key={rangeVal}
              id={`filter-range-${rangeVal}`}
              onClick={() => onChangeFilters({ ...filters, minRange: rangeVal })}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                filters.minRange === rangeVal
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {rangeVal === 0 ? 'All' : `${rangeVal}+ km`}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Battery Capacity */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
            <BatteryCharging className="w-3 h-3 text-teal-600" />
            Min Battery
          </label>
          <span className="text-xs font-bold text-teal-700 font-display">
            {filters.minBattery > 0 ? `${filters.minBattery}+ kWh` : 'Any'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 35, 50].map((batVal) => (
            <button
              key={batVal}
              id={`filter-battery-${batVal}`}
              onClick={() => onChangeFilters({ ...filters, minBattery: batVal })}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                filters.minBattery === batVal
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {batVal === 0 ? 'All' : `${batVal}+ kWh`}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Charging Time Filter */}
      <div>
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1 mb-2">
          <Clock className="w-3 h-3 text-blue-600" />
          Fast Charging Speed
        </label>
        <button
          id="filter-fast-charge-toggle"
          onClick={() =>
            onChangeFilters({
              ...filters,
              maxChargingMinutes: filters.maxChargingMinutes === 60 ? 180 : 60
            })
          }
          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-between transition-all ${
            filters.maxChargingMinutes === 60
              ? 'bg-blue-50 text-blue-800 border-blue-300'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>Fast DC (&le; 60 min)</span>
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              filters.maxChargingMinutes === 60 ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
