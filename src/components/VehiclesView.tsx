import React, { useState } from 'react';
import { Search, ArrowUpDown, X, SlidersHorizontal, AlertCircle, RotateCcw, LayoutGrid, Car, Bike, Zap } from 'lucide-react';
import { CategoryFilter, FilterState, SortOption, Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import { FilterSidebar } from './FilterSidebar';
import { formatLakhs } from '../utils/formatters';

interface VehiclesViewProps {
  vehicles: Vehicle[];
  favorites: string[];
  onToggleFavorite: (vehicle: Vehicle) => void;
  compareList: string[];
  onToggleCompare: (vehicle: Vehicle) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onGetRecommendationFor: (vehicle: Vehicle) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  onResetAllFilters: () => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  vehicles,
  favorites,
  onToggleFavorite,
  compareList,
  onToggleCompare,
  onSelectVehicle,
  onGetRecommendationFor,
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  sortOption,
  setSortOption,
  onResetAllFilters
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Category counts
  const carCount = vehicles.filter((v) => v.category === 'Cars').length;
  const bikeCount = vehicles.filter((v) => v.category === 'Bikes').length;
  const scooterCount = vehicles.filter((v) => v.category === 'Scooters').length;

  const categoryTabs: { id: CategoryFilter; label: string; icon: React.FC<{ className?: string }>; count: number }[] = [
    { id: 'All Vehicles', label: 'All Vehicles', icon: LayoutGrid, count: vehicles.length },
    { id: 'Cars', label: 'Cars', icon: Car, count: carCount },
    { id: 'Bikes', label: 'Bikes', icon: Bike, count: bikeCount },
    { id: 'Scooters', label: 'Scooters', icon: Zap, count: scooterCount }
  ];

  // Filter Logic: works reactively with search query and all filters together
  const filteredVehicles = vehicles.filter((v) => {
    // 0. Category Filter
    if (filters.category && filters.category !== 'All Vehicles' && v.category !== filters.category) {
      return false;
    }

    // 1. Search (partial names, case insensitive, checks name, brand, vehicleType, category, and keyFeatures)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = v.name.toLowerCase().includes(q);
      const matchBrand = v.brand.toLowerCase().includes(q);
      const matchCategory = v.category.toLowerCase().includes(q);
      const matchType = v.vehicleType.toLowerCase().includes(q);
      const matchEV = q === 'ev' && (v.name.toLowerCase().includes('ev') || true);
      const matchFeatures = v.keyFeatures.some((f) => f.toLowerCase().includes(q));

      if (!matchName && !matchBrand && !matchCategory && !matchType && !matchEV && !matchFeatures) {
        return false;
      }
    }

    // 2. Brand Filter
    if (filters.brands.length > 0 && !filters.brands.includes(v.brand)) {
      return false;
    }

    // 3. Vehicle Type Filter
    if (filters.vehicleTypes.length > 0 && !filters.vehicleTypes.includes(v.vehicleType)) {
      return false;
    }

    // 4. Price Filter
    if (v.price > filters.maxPrice) {
      return false;
    }

    // 5. Min Range Filter
    if (filters.minRange > 0 && v.drivingRange < filters.minRange) {
      return false;
    }

    // 6. Min Battery Filter
    if (filters.minBattery > 0 && v.batteryCapacity < filters.minBattery) {
      return false;
    }

    // 7. Max Charging Time Filter
    if (filters.maxChargingMinutes < 180 && v.fastChargingMinutes > filters.maxChargingMinutes) {
      return false;
    }

    return true;
  });

  // Sort Logic
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'range-desc':
        return b.drivingRange - a.drivingRange;
      case 'rating-desc':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Active filter count
  const activePills: { label: string; onRemove: () => void }[] = [];
  if (filters.category && filters.category !== 'All Vehicles') {
    activePills.push({
      label: `Category: ${filters.category}`,
      onRemove: () => setFilters((prev) => ({ ...prev, category: 'All Vehicles' }))
    });
  }
  if (searchQuery.trim()) {
    activePills.push({
      label: `"${searchQuery.trim()}"`,
      onRemove: () => setSearchQuery('')
    });
  }
  filters.brands.forEach((brand) => {
    activePills.push({
      label: brand,
      onRemove: () =>
        setFilters({ ...filters, brands: filters.brands.filter((b) => b !== brand) })
    });
  });
  filters.vehicleTypes.forEach((type) => {
    activePills.push({
      label: type,
      onRemove: () =>
        setFilters({
          ...filters,
          vehicleTypes: filters.vehicleTypes.filter((t) => t !== type)
        })
    });
  });
  if (filters.maxPrice < 7000000) {
    activePills.push({
      label: `Max ${formatLakhs(filters.maxPrice)}`,
      onRemove: () => setFilters({ ...filters, maxPrice: 7000000 })
    });
  }
  if (filters.minRange > 0) {
    activePills.push({
      label: `Min ${filters.minRange} km`,
      onRemove: () => setFilters({ ...filters, minRange: 0 })
    });
  }
  if (filters.minBattery > 0) {
    activePills.push({
      label: `Min ${filters.minBattery} kWh`,
      onRemove: () => setFilters({ ...filters, minBattery: 0 })
    });
  }
  if (filters.maxChargingMinutes < 180) {
    activePills.push({
      label: 'Fast DC ≤ 60m',
      onRemove: () => setFilters({ ...filters, maxChargingMinutes: 180 })
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              All Vehicles Marketplace
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Showing {sortedVehicles.length} of {vehicles.length} Indian smart & electric cars, bikes, and scooters
            </p>
          </div>

          {/* Search bar & Filter Trigger */}
          <div className="flex items-center gap-2">
            <button
              id="mobile-filter-drawer-btn"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden py-2 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Filters {activePills.length > 0 && `(${activePills.length})`}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="sort-select" className="hidden sm:inline text-slate-500">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-transparent text-slate-900 font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="range-desc">Range: Highest First</option>
                <option value="rating-desc">Rating: Highest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter: All Vehicles | Cars | Bikes | Scooters */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-fit">
          {categoryTabs.map((cat) => {
            const isSelected = filters.category === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                id={`category-filter-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-slate-300/80 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    isSelected ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-300/70 text-slate-700'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dedicated In-page Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="page-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by vehicle name (Nexon, Ola, Revolt, Ather, Chetak), brand, or features..."
            className="w-full pl-11 pr-24 py-3 bg-white text-sm text-slate-900 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition-all focus:outline-hidden"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 py-1 px-2.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Active Filter Pills Bar */}
        {activePills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
            <span className="text-xs text-slate-400 font-medium">Active filters:</span>
            {activePills.map((pill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold"
              >
                {pill.label}
                <button
                  onClick={pill.onRemove}
                  className="hover:text-rose-600 transition-colors focus:outline-hidden cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              id="clear-all-active-pills-btn"
              onClick={onResetAllFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline underline-offset-2 ml-1 cursor-pointer"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Filter (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-22">
          <FilterSidebar
            filters={filters}
            onChangeFilters={setFilters}
            onResetFilters={onResetAllFilters}
            totalResults={sortedVehicles.length}
          />
        </aside>

        {/* Mobile Filter Drawer / Collapsible */}
        {mobileFiltersOpen && (
          <div className="lg:hidden col-span-1 mb-4">
            <FilterSidebar
              filters={filters}
              onChangeFilters={setFilters}
              onResetFilters={onResetAllFilters}
              totalResults={sortedVehicles.length}
            />
          </div>
        )}

        {/* Right Grid of Vehicles */}
        <main className="lg:col-span-3">
          {sortedVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {sortedVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isFavorite={favorites.includes(vehicle.id)}
                  onToggleFavorite={onToggleFavorite}
                  isInCompare={compareList.includes(vehicle.id)}
                  onToggleCompare={onToggleCompare}
                  onSelectVehicle={onSelectVehicle}
                  onGetRecommendationFor={onGetRecommendationFor}
                />
              ))}
            </div>
          ) : (
            /* "No vehicles found" State as required */
            <div
              id="no-vehicles-found-state"
              className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center max-w-xl mx-auto shadow-xs"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                No vehicles found
              </h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                No electric models matched your current search &quot;
                <span className="font-semibold text-slate-800">{searchQuery || filters.category}</span>&quot; or
                filter criteria. Try relaxing your filters or resetting them.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  id="no-results-reset-btn"
                  onClick={onResetAllFilters}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset All Filters & Search
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
