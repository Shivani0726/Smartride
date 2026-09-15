import React, { useState, useEffect } from 'react';
import { Vehicle, FilterState, SortOption, AdvisorCriteria } from './types';
import { VEHICLES } from './data/vehicles';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { VehiclesView } from './components/VehiclesView';
import { CompareView } from './components/CompareView';
import { AdvisorView } from './components/AdvisorView';
import { FavoritesView } from './components/FavoritesView';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { ComparisonBar } from './components/ComparisonBar';
import { Footer } from './components/Footer';

const INITIAL_FILTERS: FilterState = {
  search: '',
  category: 'All Vehicles',
  brands: [],
  vehicleTypes: [],
  maxPrice: 7000000,
  minRange: 0,
  minBattery: 0,
  maxChargingMinutes: 180
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'vehicles' | 'compare' | 'advisor' | 'favorites'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Favorites state with localStorage persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smartride_favorites');
      return saved ? JSON.parse(saved) : ['tata-nexon-ev', 'hyundai-ioniq-5'];
    } catch {
      return ['tata-nexon-ev', 'hyundai-ioniq-5'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('smartride_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to persist favorites', e);
    }
  }, [favorites]);

  // Comparison state with localStorage persistence
  const [compareList, setCompareList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smartride_compare');
      return saved ? JSON.parse(saved) : ['tata-nexon-ev', 'mg-zs-ev'];
    } catch {
      return ['tata-nexon-ev', 'mg-zs-ev'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('smartride_compare', JSON.stringify(compareList));
    } catch (e) {
      console.error('Failed to persist compare list', e);
    }
  }, [compareList]);

  // Advisor pre-population criteria
  const [advisorCriteria, setAdvisorCriteria] = useState<Partial<AdvisorCriteria>>({});

  // Toggle favorite
  const handleToggleFavorite = (vehicle: Vehicle) => {
    setFavorites((prev) =>
      prev.includes(vehicle.id)
        ? prev.filter((id) => id !== vehicle.id)
        : [...prev, vehicle.id]
    );
  };

  // Toggle vehicle in comparison (maximum 3 vehicles allowed)
  const handleToggleCompare = (vehicle: Vehicle) => {
    setCompareList((prev) => {
      if (prev.includes(vehicle.id)) {
        return prev.filter((id) => id !== vehicle.id);
      }
      if (prev.length >= 3) {
        // Replace oldest or keep max 3
        return [prev[1], prev[2], vehicle.id];
      }
      return [...prev, vehicle.id];
    });
  };

  const handleRemoveFromCompare = (vehicleId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== vehicleId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const handleResetAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery('');
    setSortOption('price-asc');
  };

  // Handle "Get Recommendation" from vehicle card or modal
  const handleGetRecommendationFor = (vehicle: Vehicle) => {
    setAdvisorCriteria({
      budget: vehicle.price + 200000,
      requiredRange: vehicle.drivingRange,
      preferredType: vehicle.vehicleType
    });
    setActiveTab('advisor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompareAllFavorites = () => {
    setCompareList(favorites.slice(0, 3));
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Header / Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
        compareCount={compareList.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={() => {
          setActiveTab('vehicles');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area based on activeTab */}
      <div className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            vehicles={VEHICLES}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onSelectVehicle={setSelectedVehicle}
            onGetRecommendationFor={handleGetRecommendationFor}
            onNavigateToVehicles={(categoryOrBrand) => {
              if (categoryOrBrand) {
                if (
                  categoryOrBrand === 'Cars' ||
                  categoryOrBrand === 'Bikes' ||
                  categoryOrBrand === 'Scooters' ||
                  categoryOrBrand === 'All Vehicles'
                ) {
                  setFilters((prev) => ({ ...prev, category: categoryOrBrand as any }));
                } else {
                  setSearchQuery(categoryOrBrand);
                }
              }
              setActiveTab('vehicles');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToCompare={() => {
              setActiveTab('compare');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToAdvisor={() => {
              setActiveTab('advisor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'vehicles' && (
          <VehiclesView
            vehicles={VEHICLES}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onSelectVehicle={setSelectedVehicle}
            onGetRecommendationFor={handleGetRecommendationFor}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            sortOption={sortOption}
            setSortOption={setSortOption}
            onResetAllFilters={handleResetAllFilters}
          />
        )}

        {activeTab === 'compare' && (
          <CompareView
            vehicles={VEHICLES}
            compareIds={compareList}
            onRemoveFromCompare={handleRemoveFromCompare}
            onAddToCompare={(v) => {
              if (!compareList.includes(v.id)) {
                if (compareList.length >= 3) {
                  setCompareList([compareList[1], compareList[2], v.id]);
                } else {
                  setCompareList([...compareList, v.id]);
                }
              }
            }}
            onClearCompare={handleClearCompare}
            onSelectVehicle={setSelectedVehicle}
            onNavigateToVehicles={() => {
              setActiveTab('vehicles');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'advisor' && (
          <AdvisorView
            vehicles={VEHICLES}
            onSelectVehicle={setSelectedVehicle}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            initialCriteria={advisorCriteria}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            vehicles={VEHICLES}
            favoriteIds={favorites}
            onToggleFavorite={handleToggleFavorite}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onSelectVehicle={setSelectedVehicle}
            onGetRecommendationFor={handleGetRecommendationFor}
            onNavigateToVehicles={() => {
              setActiveTab('vehicles');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCompareAllFavorites={handleCompareAllFavorites}
          />
        )}
      </div>

      {/* Floating Sticky Comparison Bar when 1+ vehicles selected and not on compare page */}
      {activeTab !== 'compare' && (
        <ComparisonBar
          compareIds={compareList}
          vehicles={VEHICLES}
          onRemoveFromCompare={handleRemoveFromCompare}
          onNavigateToCompare={() => {
            setActiveTab('compare');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onClearCompare={handleClearCompare}
        />
      )}

      {/* Vehicle Detail Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        isFavorite={selectedVehicle ? favorites.includes(selectedVehicle.id) : false}
        onToggleFavorite={handleToggleFavorite}
        isInCompare={selectedVehicle ? compareList.includes(selectedVehicle.id) : false}
        onToggleCompare={handleToggleCompare}
        onGetRecommendation={handleGetRecommendationFor}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
