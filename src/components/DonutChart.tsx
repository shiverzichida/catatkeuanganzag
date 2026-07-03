"use client";

import React from "react";

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
  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Filter data yang bernilai > 0
  const activeItems = data.filter((item) => item.value > 0);

  // Hitung radius, keliling lingkaran (circumference)
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~314.16

  let accumulatedPercentage = 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg">
      <h3 className="text-sm font-semibold text-zinc-400 mb-4">{title}</h3>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-zinc-600 text-sm">
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
          <span className="mt-4">Belum ada pengeluaran bulan ini</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
          {/* SVG Donut */}
          <div className="relative w-[140px] h-[140px] flex-shrink-0">
            <svg width="140" height="140" className="transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="#27272a"
                strokeWidth={strokeWidth}
              />
              {/* Data Segments */}
              {activeItems.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDashoffset = circumference - (percentage / 100) * circumference;
                const rotationOffset = (accumulatedPercentage / 100) * circumference;
                accumulatedPercentage += percentage;

                return (
                  <circle
                    key={index}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                      transform: `rotate(${(rotationOffset / circumference) * 360}deg)`,
                      transformOrigin: "center",
                      transition: "stroke-dashoffset 0.5s ease-in-out"
                    }}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Total</span>
              <span className="text-sm font-bold text-white mt-0.5">
                {new Intl.NumberFormat("id-ID", {
                  notation: "compact",
                  compactDisplay: "short"
                }).format(total)}
              </span>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="flex-1 w-full space-y-2.5">
            {activeItems.map((item, index) => {
              const pct = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-300 font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold">{formatRupiah(item.value)}</span>
                    <span className="text-zinc-500 ml-1.5 font-medium">({pct}%)</span>
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
