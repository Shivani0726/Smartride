import React from 'react';
import { Zap, Heart, Shield, Award, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'vehicles' | 'compare' | 'advisor' | 'favorites') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="text-lg font-bold font-display text-white">
                Smart<span className="text-emerald-400">Ride</span>
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-emerald-950 text-emerald-300 border border-emerald-800">
                EV India
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              SmartRide is India’s dedicated smart & electric vehicle marketplace. Compare real-world driving ranges, certified battery packs, charging curves, and calculate personalized recommendations.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> ARAI Tested Specs
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Pan-India Ex-Showroom ₹
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Marketplace Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Marketplace Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vehicles')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  All Electric Vehicles (8 Models)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('compare')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Vehicle Comparison Tool
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('advisor')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Smart EV Advisor Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('favorites')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Saved Favorites
                </button>
              </li>
            </ul>
          </div>

          {/* Real Models Directory */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Supported EV Models
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Tata Nexon EV • Tata Punch EV</li>
              <li>MG Comet EV • MG ZS EV</li>
              <li>Mahindra XUV400 EV</li>
              <li>Hyundai Ioniq 5 • Kia EV6</li>
              <li>BYD Atto 3</li>
            </ul>
            <div className="mt-4 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-[11px] text-slate-400">
              ⚡ Demonstration ready for SIH Hackathon. All features functional without paid APIs.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} SmartRide EV Marketplace. Built with realistic Indian vehicle data in ₹ (INR).
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            Powered by local smart recommendation algorithms & client state.
          </div>
        </div>
      </div>
    </footer>
  );
};
