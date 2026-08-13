import React from 'react';

export const MapLegend: React.FC = () => {
  const items = [
    { label: 'Low Risk (0-39)', color: '#16a34a' },
    { label: 'Moderate Risk (40-59)', color: '#d97706' },
    { label: 'High Risk (60-79)', color: '#ea580c' },
    { label: 'Critical Risk (80-100)', color: '#dc2626' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-slate-200 shadow-md text-xs space-y-1.5 z-10">
      <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">SDOH Risk Legend</p>
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <span className="text-slate-600 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
