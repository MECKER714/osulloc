/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SettingsState } from "../types";
import { X, Cpu, Volume2, RotateCw, Monitor } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  onSettingsChange: (newSettings: SettingsState) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const toggleSetting = (key: keyof SettingsState) => {
    // Play subtle click sound if sound setting is present
    if (settings.sound) {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.frequency.value = 800;
        gain.gain.setValueAtTime(0.05, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.08);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.1);
      } catch (e) {
        // ignore audio context failures
      }
    }

    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl transform scale-100 transition-transform duration-300 border border-[#004b41]/10"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-display text-2xl font-bold text-[#00322b]">
            환경설정
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors cursor-pointer text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles list */}
        <div className="flex flex-col gap-6">
          {/* Gyroscope */}
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-emerald-700" />
              <div className="flex flex-col">
                <span className="text-body-md font-semibold text-stone-800">자이로스코프 센서</span>
                <span className="text-xs text-stone-400 font-body">모바일 회전 연동 시뮬레이션</span>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.gyroscope}
                onChange={() => toggleSetting("gyroscope")}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Sound Effect */}
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-emerald-700" />
              <div className="flex flex-col">
                <span className="text-body-md font-semibold text-stone-800">사운드 효과</span>
                <span className="text-xs text-stone-400 font-body">동작 및 피드백 음향 토글</span>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.sound}
                onChange={() => toggleSetting("sound")}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Auto Rotation */}
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-3">
              <RotateCw className="w-5 h-5 text-emerald-700 animate-spin-slow" />
              <div className="flex flex-col">
                <span className="text-body-md font-semibold text-stone-800">자동 회전</span>
                <span className="text-xs text-stone-400 font-body">경관 자동 순환 흐름</span>
              </div>
            </div>
            <label className="switch">
              <input
                id="auto-rotate-toggle"
                type="checkbox"
                checked={settings.autoRotate}
                onChange={() => toggleSetting("autoRotate")}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* High Quality */}
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-emerald-700" />
              <div className="flex flex-col">
                <span className="text-body-md font-semibold text-stone-800">화질 우선 모드</span>
                <span className="text-xs text-stone-400 font-body">고해상도 텍스처 렌더링</span>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.highQuality}
                onChange={() => toggleSetting("highQuality")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full mt-8 bg-[#004b41] hover:bg-[#00322b] py-4 rounded-full text-white font-bold tracking-widest uppercase text-xs shadow-md transition-all cursor-pointer"
        >
          저장 후 닫기
        </button>
      </div>
    </div>
  );
}
