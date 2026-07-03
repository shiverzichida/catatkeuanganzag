"use client";

import React, { useState } from "react";

interface ChartItem {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: ChartItem[];
  title: string;
}

export default function DonutChart({ data, title }: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Filter data yang bernilai > 0
  const activeItems = data.filter((item) => item.value > 0);

  // Hitung radius, keliling lingkaran (circumference)
  const radius = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius; // ~314.16

  let accumulatedPercentage = 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // State values for center label
  const isHovered = hoveredIndex !== null;
  const currentLabel = isHovered ? activeItems[hoveredIndex!].name : "Total";
  const currentValue = isHovered ? activeItems[hoveredIndex!].value : total;
  const currentPct = isHovered ? ((activeItems[hoveredIndex!].value / total) * 100).toFixed(1) + "%" : "";
  const currentColor = isHovered ? activeItems[hoveredIndex!].color : "#a1a1aa";

  return (
    <div className="relative overflow-hidden bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-zinc-700/80">
      {/* Premium background glow effect */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <h3 className="text-sm font-semibold text-zinc-400 mb-6 tracking-wide uppercase">{title}</h3>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-600 text-sm">
          <svg width="140" height="140" className="transform -rotate-90">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#27272a"
              strokeWidth={strokeWidth}
            />
          </svg>
          <span className="mt-6 font-medium text-zinc-500">Belum ada pengeluaran bulan ini</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
          {/* SVG Donut */}
          <div className="relative w-[160px] h-[160px] flex-shrink-0 flex items-center justify-center">
            <svg width="160" height="160" className="transform -rotate-90">
              <defs>
                {/* Modern vibrant gradients for each category */}
                <linearGradient id="grad-LIVING" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="grad-PLAYING" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="grad-SAVING" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <linearGradient id="grad-WORKING" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#fb7185" />
                </linearGradient>
                {/* Dynamic shadow for hovered segment */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Background Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#1f1f23"
                strokeWidth={strokeWidth}
              />
              
              {/* Data Segments */}
              {activeItems.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDashoffset = circumference - (percentage / 100) * circumference;
                const rotationOffset = (accumulatedPercentage / 100) * circumference;
                accumulatedPercentage += percentage;

                const isSegmentHovered = hoveredIndex === index;
                const strokeVal = `url(#grad-${item.name})`;

                return (
                  <circle
                    key={index}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={strokeVal}
                    strokeWidth={isSegmentHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="cursor-pointer transition-all duration-300 origin-center"
                    style={{
                      transform: `rotate(${(rotationOffset / circumference) * 360}deg)`,
                      transformOrigin: "80px 80px",
                      opacity: isHovered && !isSegmentHovered ? 0.35 : 1,
                      filter: isSegmentHovered ? "url(#glow)" : "none",
                    }}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Dynamic Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span 
                className="text-[10px] font-bold uppercase tracking-widest transition-colors duration-300"
                style={{ color: currentColor }}
              >
                {currentLabel}
              </span>
              <span className="text-lg font-extrabold text-white mt-0.5 tracking-tight transition-all duration-300">
                {new Intl.NumberFormat("id-ID", {
                  notation: "compact",
                  compactDisplay: "short"
                }).format(currentValue)}
              </span>
              {isHovered ? (
                <span className="text-[11px] font-bold text-zinc-400 mt-0.5 transition-all duration-300">
                  {currentPct}
                </span>
              ) : (
                <span className="text-[9px] font-semibold text-zinc-500 mt-0.5 tracking-wide uppercase">
                  Pengeluaran
                </span>
              )}
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="flex-1 w-full space-y-3">
            {activeItems.map((item, index) => {
              const pct = ((item.value / total) * 100).toFixed(1);
              const isItemHovered = hoveredIndex === index;
              return (
                <div 
                  key={index} 
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex flex-col gap-1 p-2.5 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isItemHovered 
                      ? "bg-zinc-800/40 scale-[1.02] shadow-md shadow-black/10" 
                      : isHovered 
                        ? "opacity-40 hover:opacity-100" 
                        : "hover:bg-zinc-850/30"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-3 h-3 rounded-full shadow-inner transition-transform duration-300" 
                        style={{ 
                          background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
                          transform: isItemHovered ? "scale(1.2)" : "scale(1)"
                        }} 
                      />
                      <span className="text-zinc-300 font-semibold tracking-wide">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">{formatRupiah(item.value)}</span>
                      <span className="text-zinc-500 ml-2 font-medium">({pct}%)</span>
                    </div>
                  </div>

                  {/* Elegant custom progress indicator */}
                  <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden mt-1.5 shadow-inner">
                    <div 
                      className="h-full rounded-full transition-all duration-500 ease-out" 
                      style={{ 
                        width: `${pct}%`, 
                        background: `linear-gradient(90deg, ${item.color}dd, ${item.color})`,
                        opacity: isHovered && !isItemHovered ? 0.4 : 1
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

