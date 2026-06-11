/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HotspotData } from "../types";
import { X, Navigation } from "lucide-react";

interface InfoCardProps {
  hotspot: HotspotData | null;
  onClose: () => void;
}

export default function InfoCard({ hotspot, onClose }: InfoCardProps) {
  if (!hotspot) return null;

  return (
    <div
      id="info-card"
      className="pointer-events-auto glass-card p-6 md:p-8 rounded-3xl max-w-lg shadow-xl backdrop-blur-xl transition-all duration-500 ease-out relative border border-white/20 select-none animate-in fade-in slide-in-from-bottom-6"
    >
      {/* Close button inside info card */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-900/5 hover:bg-stone-900/15 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-all cursor-pointer"
        aria-label="안내창 닫기"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Main card payload */}
      <div id="info-content">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#004b41] text-[#7dbaad] flex items-center justify-center shadow-inner">
            <Navigation className="w-6 h-6 rotate-45" />
          </div>
          <div>
            <h1 id="info-title" className="font-display text-2xl font-bold text-[#00322b] leading-tight">
              {hotspot.title}
            </h1>
            <p id="info-subtitle" className="font-body text-sm font-medium text-stone-500">
              {hotspot.subtitle}
            </p>
          </div>
        </div>

        {/* Long description text */}
        <p id="info-description" className="font-body text-body-md text-stone-700 leading-relaxed mb-6">
          {hotspot.description}
        </p>

        {/* Dynamic metadata chips */}
        <div id="info-tags" className="flex gap-2 flex-wrap">
          {hotspot.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-emerald-50 text-[#004b41] font-body text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wide shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
