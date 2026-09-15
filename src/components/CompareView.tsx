import React, { useState } from 'react';
import {
  Scale,
  Plus,
  Trash2,
  Check,
  X,
  Trophy,
  Zap,
  BatteryCharging,
  Clock,
  Gauge,
  Star,
  ArrowRight
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatINR, formatLakhs } from '../utils/formatters';

interface CompareViewProps {
  vehicles: Vehicle[];
  compareIds: string[];
  onRemoveFromCompare: (vehicleId: string) => void;
  onAddToCompare: (vehicle: Vehicle) => void;
  onClearCompare: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onNavigateToVehicles: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  vehicles,
  compareIds,
  onRemoveFromCompare,
  onAddToCompare,
  onClearCompare,
  onSelectVehicle,
  onNavigateToVehicles
}) => {
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);

  const selectedVehicles = compareIds
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is Vehicle => v !== undefined);

  // Unselected vehicles available to add
  const availableToAdd = vehicles.filter((v) => !compareIds.includes(v.id));

  // Differences & Best-in-spec calculations
  const minPrice =
    selectedVehicles.length > 0
      ? Math.min(...selectedVehicles.map((v) => v.price))
      : 0;
  const maxRange =
    selectedVehicles.length > 0
      ? Math.max(...selectedVehicles.map((v) => v.drivingRange))
      : 0;
  const maxBattery =
    selectedVehicles.length > 0
      ? Math.max(...selectedVehicles.map((v) => v.batteryCapacity))
      : 0;
  const minChargingTime =
    selectedVehicles.length > 0
      ? Math.min(...selectedVehicles.map((v) => v.fastChargingMinutes))
      : 0;
  const maxTopSpeed =
    selectedVehicles.length > 0
      ? Math.max(...selectedVehicles.map((v) => v.topSpeed))
      : 0;
  const maxRating =
    selectedVehicles.length > 0
      ? Math.max(...selectedVehicles.map((v) => v.rating))
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Scale className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Vehicle Comparison
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Compare 2 or 3 smart electric vehicles side-by-side with real-world Indian specs and highlighted advantages.
          </p>
        </div>

        {selectedVehicles.length > 0 && (
          <button
            id="clear-comparison-btn"
            onClick={onClearCompare}
            className="self-start sm:self-auto py-2 px-3.5 rounded-xl border border-slate-300 hover:border-rose-300 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Comparison
          </button>
        )}
      </div>

      {/* If 0 vehicles selected */}
      {selectedVehicles.length === 0 && (
        <div
          id="empty-comparison-state"
          className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-xs"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            No Vehicles Selected for Comparison
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Select 2 or 3 electric vehicles to view a comprehensive side-by-side breakdown of prices, battery capacities, certified ranges, and features.
          </p>

          <div className="mt-8">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Quick Pick 2 Vehicles to Start:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-6">
              {vehicles.slice(0, 4).map((v) => (
                <button
                  key={v.id}
                  id={`quick-add-compare-${v.id}`}
                  onClick={() => onAddToCompare(v)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all group"
                >
                  <span className="text-[11px] font-bold text-emerald-700 block uppercase">
                    {v.brand}
                  </span>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 line-clamp-1">
                    {v.name}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {v.priceDisplay}
                  </span>
                </button>
              ))}
            </div>

            <button
              id="browse-vehicles-cta-btn"
              onClick={onNavigateToVehicles}
              className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-sm font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              Browse All Vehicles
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Comparison Workspace (1, 2, or 3 vehicles) */}
      {selectedVehicles.length > 0 && (
        <div className="space-y-6">
          {/* Active selection slots row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((slotIdx) => {
              const vehicle = selectedVehicles[slotIdx];

              if (vehicle) {
                return (
                  <div
                    key={vehicle.id}
                    id={`compare-slot-${vehicle.id}`}
                    className="bg-white rounded-2xl border-2 border-emerald-200 p-4 relative shadow-xs flex flex-col justify-between"
                  >
                    <button
                      onClick={() => onRemoveFromCompare(vehicle.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove vehicle"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={vehicle.vehicleImage}
                        alt={vehicle.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">
                          {vehicle.brand}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {vehicle.name}
                        </h3>
                        <span className="text-xs font-extrabold text-slate-800 font-display">
                          {vehicle.priceDisplay}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectVehicle(vehicle)}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold text-center transition-colors"
                    >
                      View Full Details
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={`empty-slot-${slotIdx}`}
                  className="bg-slate-50/80 rounded-2xl border-2 border-dashed border-slate-200 p-4 flex flex-col items-center justify-center text-center min-h-[120px]"
                >
                  <Plus className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-bold text-slate-600">
                    Slot {slotIdx + 1} Available
                  </span>
                  <span className="text-[11px] text-slate-400 mb-2">
                    {slotIdx === 1 ? 'Add second vehicle' : 'Add third vehicle'}
                  </span>
                  <button
                    id={`add-vehicle-slot-btn-${slotIdx}`}
                    onClick={() => setPickerSlotIndex(slotIdx)}
                    className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors"
                  >
                    + Choose Vehicle
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Slot Picker Modal/Overlay if user clicked Choose Vehicle */}
          {pickerSlotIndex !== null && (
            <div
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
              onClick={() => setPickerSlotIndex(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-lg w-full p-5 border border-slate-200 shadow-xl max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Select Vehicle for Comparison
                  </h3>
                  <button
                    onClick={() => setPickerSlotIndex(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {availableToAdd.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        onAddToCompare(v);
                        setPickerSlotIndex(null);
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={v.vehicleImage}
                          alt={v.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-10 object-cover rounded-lg border border-slate-200"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-emerald-700 uppercase">
                            {v.brand}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{v.name}</h4>
                          <span className="text-[11px] text-slate-500">{v.vehicleType}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-slate-900 font-display block">
                          {v.priceDisplay}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          {v.drivingRangeDisplay}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {selectedVehicles.length >= 2 ? (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm font-display">
                  <Trophy className="w-4.5 h-4.5 text-amber-400" />
                  <span>Key Specifications & Advantage Comparison</span>
                </div>
                <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                  Green highlights indicate best-in-class value among selections
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="p-3 sm:p-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider w-1/4">
                        Specification
                      </th>
                      {selectedVehicles.map((v) => (
                        <th key={v.id} className="p-3 sm:p-4 font-bold text-slate-900 w-1/4">
                          <span className="text-[10px] uppercase font-semibold text-emerald-600 block">
                            {v.brand}
                          </span>
                          <span className="text-sm font-extrabold font-display">{v.name}</span>
                        </th>
                      ))}
                      {selectedVehicles.length === 2 && (
                        <th className="p-3 sm:p-4 font-medium text-slate-400 text-center w-1/4 border-l border-dashed border-slate-200">
                          Slot 3 Open
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {/* 1. Price */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 sm:p-4 font-bold text-slate-700 bg-slate-50/30">
                        Price (₹ INR)
                      </td>
                      {selectedVehicles.map((v) => {
                        const isBest = v.price === minPrice;
                        return (
                          <td key={v.id} className="p-3 sm:p-4">
                            <span className="font-extrabold text-base text-slate-900 font-display block">
                              {v.priceDisplay}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              ({formatLakhs(v.price)})
                            </span>
                            {isBest && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                                Most Affordable
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {selectedVehicles.length === 2 && <td className="p-3 sm:p-4 bg-slate-50/30" />}
                    </tr>

                    {/* 2. Range */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 sm:p-4 font-bold text-slate-700 bg-slate-50/30 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        Driving Range
                      </td>
                      {selectedVehicles.map((v) => {
                        const isBest = v.drivingRange === maxRange;
                        return (
                          <td key={v.id} className="p-3 sm:p-4">
                            <span className="font-bold text-slate-900 block font-display">
                              {v.drivingRangeDisplay}
                            </span>
                            <span className="text-[11px] text-slate-400">ARAI Certified</span>
                            {isBest && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                                Highest Range
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {selectedVehicles.length === 2 && <td className="p-3 sm:p-4 bg-slate-50/30" />}
                    </tr>

                    {/* 3. Battery Capacity */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 sm:p-4 font-bold text-slate-700 bg-slate-50/30 flex items-center gap-1.5">
                        <BatteryCharging className="w-3.5 h-3.5 text-teal-600" />
                        Battery Capacity
                      </td>
                      {selectedVehicles.map((v) => {
                        const isBest = v.batteryCapacity === maxBattery;
                        return (
                          <td key={v.id} className="p-3 sm:p-4">
                            <span className="font-bold text-slate-900 block font-display">
                              {v.batteryCapacityDisplay}
                            </span>
                            {isBest && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-200">
                                Largest Battery
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {selectedVehicles.length === 2 && <td className="p-3 sm:p-4 bg-slate-50/30" />}
                    </tr>

                    {/* 4. Charging Time */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 sm:p-4 font-bold text-slate-700 bg-slate-50/30 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        Charging Time
                      </td>
                      {selectedVehicles.map((v) => {
                        const isBest = v.fastChargingMinutes === minChargingTime;
                        return (
                          <td key={v.id} className="p-3 sm:p-4">
                            <span className="font-bold text-slate-900 block">
                              {v.chargingTime}
                            </span>
                            {isBest && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                                Fastest DC Charge
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {selectedVehicles.length === 2 && <td className="p-3 sm:p-4 bg-slate-50/30" />}
                    </tr>

                    {/* 5. Top Speed & 0-100 */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 sm:p-4 font-bold text-slate-700 bg-slate-50/30 flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-cyan-600" />
                        Top Speed / 0-100
                      </td>
                      {selectedVehicles.map((v) => {
                        const isBest = v.topSpeed === maxTopSpeed;
                        return (
                          <td key={v.id} className="p-3 sm:p-4">
                            <span className="font-bold text-slate-900 block">
                              {v.topSpeedDisplay}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              0-100: {v.acceleration0to100}
                            </span>
                            {isBest && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full border border-cyan-200">
                                Fastest Speed
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {selectedVehicles.length === 2 && <td className="p-3 sm:p-4 bg-slate-50/30" />}
                    </tr>

                    {/* 6. User Rating */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 sm:p-4 font-bold text-slate-700 bg-slate-50/30 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        Rating
                      </td>
                      {selectedVehicles.map((v) => {
                        const isBest = v.rating === maxRating;
                        return (
                          <td key={v.id} className="p-3 sm:p-4">
                            <div className="flex items-center gap-1 font-bold text-slate-900">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span>{v.rating}</span>
                              <span className="text-slate-400 text-xs font-normal">
                                ({v.reviewCount})
                              </span>
                            </div>
                            {isBest && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                                Highest Rated
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {selectedVehicles.length === 2 && <td className="p-3 sm:p-4 bg-slate-50/30" />}
                    </tr>

                    {/* 6.5 Category */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 sm:p-4 font-bold text-slate-700 bg-slate-50/30">
                        Category
                      </td>
                      {selectedVehicles.map((v) => (
                        <td key={v.id} className="p-3 sm:p-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                            {v.category}
                          </span>
                        </td>
                      ))}
                      {selectedVehicles.length === 2 && <td className="p-3 sm:p-4 bg-slate-50/30" />}
                    </tr>

                    {/* 7. Vehicle Body Type */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 sm:p-4 font-bold text-slate-700 bg-slate-50/30">
                        Body Type
                      </td>
                      {selectedVehicles.map((v) => (
                        <td key={v.id} className="p-3 sm:p-4 font-semibold text-slate-800">
                          {v.vehicleType}
                        </td>
                      ))}
                      {selectedVehicles.length === 2 && <td className="p-3 sm:p-4 bg-slate-50/30" />}
                    </tr>

                    {/* 8. Motor & Torque */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 sm:p-4 font-bold text-slate-700 bg-slate-50/30">
                        Motor & Torque
                      </td>
                      {selectedVehicles.map((v) => (
                        <td key={v.id} className="p-3 sm:p-4 font-medium text-slate-700">
                          {v.motorPower}
                        </td>
                      ))}
                      {selectedVehicles.length === 2 && <td className="p-3 sm:p-4 bg-slate-50/30" />}
                    </tr>

                    {/* 9. Boot Space */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 sm:p-4 font-bold text-slate-700 bg-slate-50/30">
                        Boot Space
                      </td>
                      {selectedVehicles.map((v) => (
                        <td key={v.id} className="p-3 sm:p-4 font-medium text-slate-700">
                          {v.bootSpace}
                        </td>
                      ))}
                      {selectedVehicles.length === 2 && <td className="p-3 sm:p-4 bg-slate-50/30" />}
                    </tr>

                    {/* 10. Key Features Comparison */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 sm:p-4 font-bold text-slate-700 bg-slate-50/30 align-top">
                        Key Features
                      </td>
                      {selectedVehicles.map((v) => (
                        <td key={v.id} className="p-3 sm:p-4 align-top">
                          <ul className="space-y-1.5">
                            {v.keyFeatures.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                      {selectedVehicles.length === 2 && <td className="p-3 sm:p-4 bg-slate-50/30" />}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-900">
              <p className="font-bold text-sm">
                Select at least one more vehicle to generate the side-by-side comparison.
              </p>
              <button
                onClick={() => setPickerSlotIndex(1)}
                className="mt-3 py-1.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
              >
                + Add Second Vehicle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
