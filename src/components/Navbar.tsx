import React, { useState } from 'react';
import { Car, Heart, SlidersHorizontal, Sparkles, Scale, Search, Menu, X, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'vehicles' | 'compare' | 'advisor' | 'favorites';
  setActiveTab: (tab: 'home' | 'vehicles' | 'compare' | 'advisor' | 'favorites') => void;
  favoritesCount: number;
  compareCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  compareCount,
  searchQuery,
  setSearchQuery,
  onSearchSubmit
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'vehicles' | 'compare' | 'advisor' | 'favorites') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveTab('vehicles');
      if (onSearchSubmit) onSearchSubmit();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold font-display tracking-tight text-slate-900">
                  Smart<span className="text-emerald-600">Ride</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
                  EV India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Smart Vehicle Marketplace
              </p>
            </div>
          </button>

          {/* Quick Search in Navbar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="navbar-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'vehicles') {
                    setActiveTab('vehicles');
                  }
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search Nexon, Punch, MG, Ioniq..."
                className="w-full pl-9.5 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 rounded-lg border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold">
            <button
              id="nav-home-btn"
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                activeTab === 'home'
                  ? 'text-emerald-700 bg-emerald-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            <button
              id="nav-vehicles-btn"
              onClick={() => handleNavClick('vehicles')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'vehicles'
                  ? 'text-emerald-700 bg-emerald-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4" />
              Vehicles
            </button>

            <button
              id="nav-compare-btn"
              onClick={() => handleNavClick('compare')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'compare'
                  ? 'text-emerald-700 bg-emerald-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-4 h-4" />
              Compare
              {compareCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs bg-emerald-600 text-white font-bold">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              id="nav-advisor-btn"
              onClick={() => handleNavClick('advisor')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'advisor'
                  ? 'text-emerald-700 bg-emerald-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Advisor
            </button>

            <button
              id="nav-favorites-btn"
              onClick={() => handleNavClick('favorites')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'favorites'
                  ? 'text-emerald-700 bg-emerald-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              Favorites
              {favoritesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs bg-rose-600 text-white font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-fav-quick-btn"
              onClick={() => handleNavClick('favorites')}
              className="p-2 text-slate-600 hover:text-slate-900 relative rounded-lg"
              title="Favorites"
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'vehicles') {
                  setActiveTab('vehicles');
                }
              }}
              placeholder="Search Nexon, MG, BYD..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 text-slate-800 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-2.5 rounded-lg text-left text-sm font-semibold flex items-center gap-2 ${
                activeTab === 'home' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-600" />
              Home
            </button>

            <button
              onClick={() => handleNavClick('vehicles')}
              className={`p-2.5 rounded-lg text-left text-sm font-semibold flex items-center gap-2 ${
                activeTab === 'vehicles' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4 text-emerald-600" />
              Vehicles
            </button>

            <button
              onClick={() => handleNavClick('compare')}
              className={`p-2.5 rounded-lg text-left text-sm font-semibold flex items-center justify-between ${
                activeTab === 'compare' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-600" />
                Compare
              </span>
              {compareCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs bg-emerald-600 text-white font-bold">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('advisor')}
              className={`p-2.5 rounded-lg text-left text-sm font-semibold flex items-center gap-2 ${
                activeTab === 'advisor' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              EV Advisor
            </button>

            <button
              onClick={() => handleNavClick('favorites')}
              className={`col-span-2 p-2.5 rounded-lg text-left text-sm font-semibold flex items-center justify-between ${
                activeTab === 'favorites' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Saved Favorites
              </span>
              {favoritesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-rose-600 text-white font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
