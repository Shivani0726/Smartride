import React from 'react';
import {
  Search,
  Zap,
  Sparkles,
  ShieldCheck,
  Scale,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  BatteryCharging,
  Car,
  Bike,
  LayoutGrid
} from 'lucide-react';
import { Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import { ALL_BRANDS, ALL_VEHICLE_TYPES } from '../data/vehicles';
import { formatLakhs } from '../utils/formatters';

interface HomeViewProps {
  vehicles: Vehicle[];
  favorites: string[];
  onToggleFavorite: (vehicle: Vehicle) => void;
  compareList: string[];
  onToggleCompare: (vehicle: Vehicle) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onGetRecommendationFor: (vehicle: Vehicle) => void;
  onNavigateToVehicles: (categoryOrBrand?: string) => void;
  onNavigateToCompare: () => void;
  onNavigateToAdvisor: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  vehicles,
  favorites,
  onToggleFavorite,
  compareList,
  onToggleCompare,
  onSelectVehicle,
  onGetRecommendationFor,
  onNavigateToVehicles,
  onNavigateToCompare,
  onNavigateToAdvisor,
  searchQuery,
  setSearchQuery
}) => {
  // Segment vehicles into requested groups
  const featuredVehicles = vehicles.filter((v) => v.tag === 'Featured');
  const popularVehicles = vehicles.filter((v) => v.tag === 'Popular');
  const newArrivals = vehicles.filter((v) => v.tag === 'New Arrival');

  const handleQuickSearch = (keyword: string) => {
    setSearchQuery(keyword);
    onNavigateToVehicles();
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToVehicles();
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-20 sm:py-24">
        {/* Subtle background gradient and patterns */}
        <div className="absolute inset-0 bg-radial-[at_top_right] from-emerald-900/40 via-slate-900 to-slate-950 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-6 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              India’s Smart Electric Vehicle Marketplace
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-tight">
              Drive the Future with <span className="text-emerald-400">SmartRide</span>.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Discover real Indian electric models, compare real-world driving ranges and battery capacities, and find the perfect EV for your daily commute.
            </p>

            {/* Prominent Search Bar */}
            <form
              onSubmit={handleHeroSearchSubmit}
              className="mt-8 relative max-w-2xl flex flex-col sm:flex-row gap-2 bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl"
            >
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-300 absolute left-4" />
                <input
                  id="hero-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Nexon, Punch, MG ZS EV, BYD, Kia..."
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-slate-400 text-sm font-medium focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                id="hero-search-submit-btn"
                className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Search Vehicles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick search tags */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Trending searches:</span>
              {['Nexon EV', 'Ola S1', 'Revolt RV400', 'Ather 450X', 'Punch EV', 'Ultraviolette', 'Under ₹2L'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => {
                      if (term === 'Under ₹2L') {
                        onNavigateToVehicles();
                      } else {
                        handleQuickSearch(term);
                      }
                    }}
                    className="py-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                )
              )}
            </div>

            {/* Market Highlights metrics */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <span className="text-2xl font-extrabold font-display text-white block">
                  ₹1.18 Lakh
                </span>
                <span className="text-xs text-slate-400">Starting EV Price</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold font-display text-emerald-400 block">
                  708 km
                </span>
                <span className="text-xs text-slate-400">Max Driving Range</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold font-display text-white block">
                  15 Models
                </span>
                <span className="text-xs text-slate-400">Cars, Bikes & Scooters</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold font-display text-teal-400 block">
                  100%
                </span>
                <span className="text-xs text-slate-400">Free Smart Advisor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BROWSE BY CATEGORY (Cars, Bikes, Scooters, All Vehicles) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5" />
              Vehicle Categories
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Explore by Vehicle Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find the right electric vehicle category tailored to your commute, style, and budget
            </p>
          </div>
          <button
            onClick={() => onNavigateToVehicles('All Vehicles')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 mt-2 sm:mt-0 cursor-pointer"
          >
            Browse All Categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* All Vehicles Card */}
          <div
            id="home-category-card-all"
            onClick={() => onNavigateToVehicles('All Vehicles')}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all border border-slate-700 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display">All Vehicles</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Cars, high-performance bikes & smart urban scooters together.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>{vehicles.length} Models Available</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Electric Cars Card */}
          <div
            id="home-category-card-cars"
            onClick={() => onNavigateToVehicles('Cars')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900">Electric Cars</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Tata Nexon, Punch EV, MG Comet, Kia EV6, Ioniq 5 & more.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>{vehicles.filter((v) => v.category === 'Cars').length} Models Available</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Electric Bikes Card */}
          <div
            id="home-category-card-bikes"
            onClick={() => onNavigateToVehicles('Bikes')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Bike className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900">Electric Bikes</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Revolt RV400, Ultraviolette F77 Mach 2, Oben Rorr & street racers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>{vehicles.filter((v) => v.category === 'Bikes').length} Models Available</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Electric Scooters Card */}
          <div
            id="home-category-card-scooters"
            onClick={() => onNavigateToVehicles('Scooters')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900">Electric Scooters</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ola S1 Pro, Ather 450X, TVS iQube, Bajaj Chetak & daily commuters.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>{vehicles.filter((v) => v.category === 'Scooters').length} Models Available</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. BROWSE BY BRAND & VEHICLE TYPE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Popular Electric Brands
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a brand to view their flagship electric lineups in India
            </p>
          </div>
          <button
            onClick={() => onNavigateToVehicles()}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 mt-2 sm:mt-0"
          >
            View All Brands <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ALL_BRANDS.map((brand) => (
            <button
              key={brand}
              id={`home-brand-pill-${brand.toLowerCase()}`}
              onClick={() => {
                setSearchQuery(brand);
                onNavigateToVehicles();
              }}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-center transition-all group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center mx-auto mb-2 text-slate-700 group-hover:text-emerald-700 font-bold transition-colors">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-slate-900 block group-hover:text-emerald-900">
                {brand}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {vehicles.filter((v) => v.brand === brand).length} Models
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FEATURED VEHICLES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <Award className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Featured Vehicles
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Handpicked electric leaders known for breakthrough range, luxury, and technology
            </p>
          </div>

          <button
            onClick={() => onNavigateToVehicles()}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            Explore All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.map((vehicle) => (
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
      </section>

      {/* 4. SMART VEHICLE ADVISOR PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 blur-2xl pointer-events-none" />

          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-bold mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              Free Recommendation Engine
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              Confused About Which EV to Buy? Let the Smart Advisor Decide.
            </h2>

            <p className="text-sm text-slate-200 mt-2 leading-relaxed">
              Match your daily commuting distance, maximum budget in Indian Rupees, and charging setup to discover the best electric car tailored precisely to your lifestyle.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                id="home-open-advisor-cta"
                onClick={onNavigateToAdvisor}
                className="py-3 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Launch Smart Vehicle Advisor</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateToCompare}
                className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-colors flex items-center gap-2"
              >
                <Scale className="w-4 h-4" />
                <span>Compare Vehicles</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR VEHICLES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Popular Vehicles
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              The highest-volume electric cars preferred by Indian commuters and families
            </p>
          </div>

          <button
            onClick={() => onNavigateToVehicles()}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View More <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularVehicles.map((vehicle) => (
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
      </section>

      {/* 6. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                <Clock className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                New Arrivals
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Freshly launched next-generation electric platforms and updated battery chemistries
            </p>
          </div>

          <button
            onClick={() => onNavigateToVehicles()}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {newArrivals.map((vehicle) => (
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
      </section>
    </div>
  );
};
