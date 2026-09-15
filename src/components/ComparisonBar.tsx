import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';
import { Vehicle } from '../types';

interface ComparisonBarProps {
  compareIds: string[];
  vehicles: Vehicle[];
  onRemoveFromCompare: (vehicleId: string) => void;
  onNavigateToCompare: () => void;
  onClearCompare: () => void;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({
  compareIds,
  vehicles,
  onRemoveFromCompare,
  onNavigateToCompare,
  onClearCompare
}) => {
  if (compareIds.length === 0) return null;

  const selectedVehicles = compareIds
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is Vehicle => v !== undefined);

  return (
    <div
      id="floating-comparison-bar"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[94%] bg-slate-900/95 text-white backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-3 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        <div className="hidden sm:flex items-center gap-1.5 pl-2 text-xs font-bold text-emerald-400">
          <Scale className="w-4 h-4" />
          <span>Compare ({selectedVehicles.length}/3):</span>
        </div>

        <div className="flex items-center gap-2">
          {selectedVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center gap-1.5 bg-white/10 rounded-xl pl-1 pr-2 py-1 border border-white/10 text-xs font-semibold shrink-0"
            >
              <img
                src={vehicle.vehicleImage}
                alt={vehicle.name}
                referrerPolicy="no-referrer"
                className="w-8 h-6 object-cover rounded-md"
              />
              <span className="truncate max-w-[90px] sm:max-w-[120px]">
                {vehicle.name}
              </span>
              <button
                onClick={() => onRemoveFromCompare(vehicle.id)}
                className="p-0.5 hover:bg-white/20 rounded-md text-slate-300 hover:text-white"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onClearCompare}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors"
        >
          Clear
        </button>

        <button
          id="bar-compare-now-btn"
          onClick={onNavigateToCompare}
          className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-colors"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
