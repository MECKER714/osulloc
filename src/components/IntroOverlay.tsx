/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";

interface IntroOverlayProps {
  onStartClick: () => void;
  isDismissed: boolean;
  onDismissComplete: () => void;
}

export default function IntroOverlay({
  onStartClick,
  isDismissed,
  onDismissComplete,
}: IntroOverlayProps) {
  const [progress, setProgress] = useState<number>(0);
  const [loadingComplete, setLoadingComplete] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true);

  // loading simulation
  useEffect(() => {
    const start = Date.now();
    const duration = 1800; // 1.8 seconds loading

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const ratio = Math.min(elapsed / duration, 1.0);
      setProgress(ratio * 100);

      if (ratio >= 1.0) {
        clearInterval(interval);
        setLoadingComplete(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Handle fade out dismissal
  useEffect(() => {
    if (isDismissed) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismissComplete();
      }, 1000); // 1s sync with ease-out transition
      return () => clearTimeout(timer);
    }
  }, [isDismissed, onDismissComplete]);

  if (!visible) return null;

  return (
    <div
      id="intro-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 75, 65, 0.72), rgba(0, 75, 65, 0.72)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsEjtu6ZIUIL1q3-lqAnLrxzkUwN2N04pFCrFYcEgXdkL-DKR9cozLDOD7qOu6w_x5g9erRMiC9JlIyRwvz53nQPQGR34ocsiF4fVBolVz3y5H_TFrUOZca2NyON6hDHGVyqUXHlCRyOELuVR6az1IzYRPbwDy5LYlTAgiQ4RIwcLJtyBCkk0m8BCxq4l0N5dn71Mn0FiW1Zog7hfIMw5NDi0sCbYnllRuwjWFxZtfbD6HYzONFi4i5u9QNG6R68zA-qLZLHhzoCc')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 transition-all duration-1000 ease-out ${
        isDismissed ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex flex-col items-center gap-12 max-w-sm w-full text-center">
        {/* Elegant OSULLOC Brand Logo */}
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <img
            alt="OSULLOC"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-2GggL45hJQFHeF1tTLzPDGNvTt3yjf1NPag0YiBwoUiGsVp5Y3C8soh6USjcPYDFjy0HGEAowTWgsoJ5wipFKPwd0J_tWajtqP_MR7U7C6uXdeu5nLrBZRPdGFlnKmToHgMD4xGcuhK_hRC-mxoZij-IVBwKvJFFKOrPUl-yGs2kXd-9Y7TlcLD5Yc73XW527anUTnd0EnWIKvlGI6_3m0M0AUu2JyVZsC5rmuMarpOK3v-d_xSwGkFxE89qb0VIdqz3C577z-8"
            className="w-48 h-auto object-contain brightness-0 invert"
          />
          <span className="text-white/80 tracking-[0.25em] font-display text-base font-bold mt-2">
            오설록
          </span>
        </div>

        <div className="w-full flex flex-col items-center gap-8 min-h-[90px]">
          {/* Progress Bar Loader */}
          {!loadingComplete ? (
            <div 
              id="progress-container"
              className="w-full h-[3px] bg-white/20 relative overflow-hidden rounded-full"
            >
              <div
                id="progress-fill"
                style={{ width: `${progress}%` }}
                className="absolute inset-y-0 left-0 bg-white transition-all duration-75 ease"
              />
            </div>
          ) : (
            /* Start Button: Visible after load completes */
            <button
              id="start-btn"
              onClick={onStartClick}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white text-[#00322b] px-12 py-4 rounded-full font-display text-sm font-bold uppercase tracking-[0.2em] hover:bg-emerald-50 active:scale-95 transition-all shadow-2xl cursor-pointer"
            >
              시작하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
