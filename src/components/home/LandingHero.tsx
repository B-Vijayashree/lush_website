import React from 'react';
import { 
  Sprout, 
  PenTool, 
  Eye, 
  Leaf, 
  ArrowRight, 
  Layers, 
  ShieldAlert, 
  Droplets, 
  SunMedium, 
  PiggyBank,
  CheckCircle2,
  Play
} from 'lucide-react';
import { SAMPLE_GARDENS } from '../../data/sampleGardens';
import { useGardenStore } from '../../store/gardenStore';

interface LandingHeroProps {
  onStartDesigning: () => void;
  onExplorePlants: () => void;
  onOpenSample: (gardenId: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartDesigning,
  onExplorePlants,
  onOpenSample,
}) => {
  return (
    <div className="flex flex-col w-full bg-[#f8f9f6] text-slate-800">
      {/* Hero Main Section */}
      <section className="relative pt-12 pb-16 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Smart Landscape Garden Planner</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-emerald-950 tracking-tight leading-[1.15]">
                Design. Customize. Visualize.
              </h1>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-800 font-serif">
                Your perfect garden, your way.
              </p>
            </div>

            <p className="text-slate-600 text-base leading-relaxed max-w-xl">
              Create your dream garden before actually building it. Choose your land dimensions, drag and drop from a library of 60+ botanically accurate species, prevent future tree crowding with mature canopy collision detection, and experience your design in interactive real-time 3D.
            </p>

            {/* Feature Highlights matching reference layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Easy Design</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Plan your dream garden with simple drag & drop tools.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Smart Customization</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Choose plants, features, and styles you love.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Realistic Visualization</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">See your garden in 360° interactive 3D before you dig.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Sustainable Choices</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Protect against mature crowding and high water waste.</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <button
                onClick={onStartDesigning}
                className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white rounded-2xl text-sm font-bold shadow-elevated hover:scale-[1.02] transition flex items-center gap-2"
              >
                <span>Start Designing Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExplorePlants}
                className="px-6 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold shadow-sm transition"
              >
                Explore Plant Library
              </button>
            </div>
          </div>

          {/* Right Column: Realistic Garden Preview Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-950/10 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 p-1">
              <div className="relative rounded-[22px] overflow-hidden bg-slate-900 aspect-[4/3] flex flex-col justify-between p-6 text-white">
                {/* Simulated Garden View Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/40 to-slate-950/90 z-10" />

                <div className="relative z-20 flex justify-between items-start">
                  <div className="bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-Time 3D Engine Synchronized</span>
                  </div>

                  <span className="bg-emerald-600/80 backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    Interactive Preview
                  </span>
                </div>

                <div className="relative z-20 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">Modern Villa Patio & Zen Garden</h3>
                    <p className="text-xs text-emerald-200">
                      12m × 9m • Teak Deck • Stepping Stones • Lily Pond • Japanese Maple
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onOpenSample('sample-villa-zen')}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Open Sample Design</span>
                    </button>
                    <button
                      onClick={onStartDesigning}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold text-xs rounded-xl transition"
                    >
                      Custom Garden Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Spacing Badge */}
            <div className="absolute -bottom-5 -left-5 z-30 bg-white p-3.5 rounded-2xl shadow-elevated border border-slate-200 flex items-center gap-3 max-w-xs">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <ShieldAlert className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Future Growth Collision
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Prevents planting trees too close based on mature canopy width.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Your Garden in 6 Simple Steps Section */}
      <section className="py-16 px-6 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              The LUSH Process
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Plan your garden in 6 simple steps
            </h2>
            <p className="text-sm text-slate-600">
              From choosing your plot dimensions to visualizing mature 3D foliage and printing your nursery schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200/70 hover:border-emerald-700/30 hover:shadow-soft transition group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition-transform">
                1
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Set Your Space</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your exact garden length and width in meters or feet. LUSH automatically scales the canvas with real-world proportions.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200/70 hover:border-emerald-700/30 hover:shadow-soft transition group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition-transform">
                2
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Choose & Customize</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse 60+ categorized trees, flowering shrubs, vegetables, herbs, and hardscape elements like stepping stones, decks, and ponds.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200/70 hover:border-emerald-700/30 hover:shadow-soft transition group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition-transform">
                3
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Drag, Drop & Rotate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Position items anywhere on the interactive 2D canvas with mouse or touch. Rotate plants to find the optimal orientation.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200/70 hover:border-emerald-700/30 hover:shadow-soft transition group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition-transform">
                4
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Check Future Growth</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant collision detection flags when trees are placed too close for their expected mature canopy and root spread.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200/70 hover:border-emerald-700/30 hover:shadow-soft transition group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition-transform">
                5
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Visualize in Real-Time 3D</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Experience full 360-degree orbit rotation, camera presets, day and sunset lighting, and inspect plants directly in 3D.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200/70 hover:border-emerald-700/30 hover:shadow-soft transition group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition-transform">
                6
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Save & Share</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Save designs in "My Gardens", export high-resolution 2D plans, and print complete nursery bills of materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Value Cards matching reference footer */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Eco-friendly</span>
              <span className="text-[11px] text-slate-500">Sustainable choices</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Water-Wise</span>
              <span className="text-[11px] text-slate-500">Smart irrigation tips</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
              <SunMedium className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Sun & Shade</span>
              <span className="text-[11px] text-slate-500">Optimal exposure</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 shrink-0">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Budget Friendly</span>
              <span className="text-[11px] text-slate-500">Design your way</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
