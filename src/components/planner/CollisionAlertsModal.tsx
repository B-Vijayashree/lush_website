import React from 'react';
import { useGardenStore } from '../../store/gardenStore';
import { AlertCircle, AlertTriangle, CheckCircle2, X, ArrowRight } from 'lucide-react';

interface CollisionAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollisionAlertsModal: React.FC<CollisionAlertsModalProps> = ({ isOpen, onClose }) => {
  const { collisionResult, selectItem } = useGardenStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Future Growth & Spacing Audit
              </h3>
              <p className="text-xs text-slate-500">
                Predictive collision detection based on full mature canopy & root spread
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {collisionResult.warnings.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-emerald-950">Safe Garden Spacing</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Every plant in your garden has ample room to thrive and reach its full mature height and spread without crowding.
              </p>
            </div>
          ) : (
            collisionResult.warnings.map(warning => (
              <div
                key={warning.id}
                className={`p-4 rounded-2xl border text-xs transition ${
                  warning.severity === 'critical'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {warning.severity === 'critical' ? (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    <span className="text-sm font-bold">
                      {warning.item1Name} ↔ {warning.item2Name}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      warning.severity === 'critical'
                        ? 'bg-rose-200 text-rose-800'
                        : 'bg-amber-200 text-amber-800'
                    }`}
                  >
                    {warning.severity === 'critical' ? 'Canopy Collision' : 'Crowding Risk'}
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed mt-1">
                  {warning.message}
                </p>

                <div className="mt-3 pt-2.5 border-t border-current/10 flex items-center justify-between text-[11px] font-medium">
                  <div>
                    Current Spacing: <strong>{warning.distance} m</strong> • Recommended: <strong>{warning.recommendedDistance} m</strong>
                  </div>
                  <button
                    onClick={() => {
                      selectItem(warning.item1InstanceId);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
