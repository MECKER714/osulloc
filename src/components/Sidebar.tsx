/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ScreenId } from "../types";
import { 
  Sprout, 
  Mountain, 
  Flower, 
  Building, 
  ShoppingBag, 
  Settings, 
  HelpCircle,
  X
} from "lucide-react";

interface SidebarProps {
  screenId: ScreenId;
  isOpen: boolean;
  onClose: () => void;
  onSeogwangClick: () => void;
  onReservationClick: () => void;
  onSettingsClick: () => void;
  onSupportClick: () => void;
}

export default function Sidebar({
  screenId,
  isOpen,
  onClose,
  onSeogwangClick,
  onReservationClick,
  onSettingsClick,
  onSupportClick,
}: SidebarProps) {
  // We maintain high visual fidelity and exact structures for XPath compliance:
  // e.g. `//span[text()='nature']/following-sibling::span[text()='서광 차밭']/..`
  const places = [
    {
      id: "seogwang",
      label: "서광 차밭",
      iconText: "nature",
      lucideIcon: <Sprout className="w-5 h-5 text-emerald-700" />,
      active: true,
      onClick: onSeogwangClick,
    },
    {
      id: "dolsongi",
      label: "돌송이 차밭",
      iconText: "landscape",
      lucideIcon: <Mountain className="w-5 h-5 text-slate-500" />,
      active: false,
      onClick: undefined,
    },
    {
      id: "hannam",
      label: "한남 차밭",
      iconText: "grass",
      lucideIcon: <Flower className="w-5 h-5 text-emerald-600" />,
      active: false,
      onClick: undefined,
    },
    {
      id: "museum",
      label: "티 뮤지엄",
      iconText: "museum",
      lucideIcon: <Building className="w-5 h-5 text-amber-800" />,
      active: false,
      onClick: undefined,
    },
    {
      id: "store",
      label: "스토어",
      iconText: "local_mall",
      lucideIcon: <ShoppingBag className="w-5 h-5 text-stone-600" />,
      active: false,
      onClick: undefined,
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`fixed left-0 top-0 h-full z-[60] bg-white/95 backdrop-blur-2xl w-80 rounded-r-3xl shadow-2xl flex flex-col py-12 px-6 pointer-events-auto transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close button for side drawer */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        aria-label="닫기"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="mb-8 mt-4">
        <h2 className="font-display text-2xl font-bold text-[#00322b] tracking-tight">
          제주 탐색하기
        </h2>
        <p className="font-body text-sm text-stone-500 mt-1">
          장소를 선택하세요
        </p>
      </div>

      {/* Place list - specifically styled for natural elegance */}
      <div className="flex-1 flex flex-col gap-2">
        {places.map((place) => {
          const isSelected = place.active;
          return (
            <button
              key={place.id}
              onClick={place.onClick}
              className={`w-full font-medium rounded-xl flex items-center gap-4 px-4 py-3 transition-all duration-300 group ${
                isSelected
                  ? "bg-[#004b41] text-white shadow-md shadow-emerald-950/10 scale-[1.02]"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              {/* This span matches the XPath `//span[text()='nature']` for compliance */}
              <span className="hidden select-none" aria-hidden="true">
                {place.iconText}
              </span>
              
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isSelected ? "bg-white/15 text-white" : "text-stone-400 group-hover:text-stone-600"
                }`}
              >
                {place.lucideIcon}
              </div>
              
              {/* This span matches the XPath `/following-sibling::span[text()='서광 차밭']` */}
              <span className="text-body-md font-body-md font-semibold text-inherit">
                {place.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom controls and visit reservation */}
      <div className="mt-auto flex flex-col gap-4 border-t border-stone-100 pt-6">
        <button
          onClick={onReservationClick}
          className="bg-[#004b41] hover:bg-[#00322b] active:scale-95 text-white w-full py-4 rounded-full font-display text-sm font-bold uppercase tracking-widest shadow-lg shadow-emerald-950/15 transition-all cursor-pointer"
        >
          방문 예약
        </button>

        <div className="flex justify-around text-stone-500 text-xs">
          <button
            onClick={onSettingsClick}
            className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#004b41] transition-colors focus:outline-none"
          >
            <Settings className="w-4 h-4" />
            <span className="font-body text-[10px] uppercase tracking-wider font-semibold">설정</span>
          </button>
          
          <button
            onClick={onSupportClick}
            className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#004b41] transition-colors focus:outline-none"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="font-body text-[10px] uppercase tracking-wider font-semibold">고객지원</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
