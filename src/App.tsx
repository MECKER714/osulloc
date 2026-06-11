/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Eye, 
  EyeOff, 
  ZoomIn, 
  Share2, 
  RotateCcw, 
  ShoppingBag, 
  Menu, 
  Volume2, 
  Sun,
  X
} from "lucide-react";

import { 
  ScreenId, 
  TransitionType, 
  HotspotData, 
  SettingsState,
  HOTSPOTS_INTRO,
  HOTSPOTS_ADVANCED
} from "./types";

import PanoramaViewer from "./components/PanoramaViewer";
import Sidebar from "./components/Sidebar";
import IntroOverlay from "./components/IntroOverlay";
import SettingsModal from "./components/SettingsModal";
import ShareModal from "./components/ShareModal";
import InfoCard from "./components/InfoCard";

import osullocSunsetPanorama from "./assets/images/osulloc_sunset_panorama_1781190717005.jpg";

export default function App() {
  // Screens state
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("INTRO_AR");
  const [lastTransition, setLastTransition] = useState<TransitionType>("none");

  // App UI/Overlay states
  const [isIntroDismissed, setIsIntroDismissed] = useState<boolean>(false);
  const [isIntroCompleted, setIsIntroCompleted] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isUiVisible, setIsUiVisible] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<HotspotData | null>(null);

  // Time clock logic
  const [currentTime, setCurrentTime] = useState<string>("17:42");

  // Interactive states
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [isZoomSliderOpen, setIsZoomSliderOpen] = useState<boolean>(false);

  // Preferences configuration
  const [settings, setSettings] = useState<SettingsState>({
    gyroscope: false,
    sound: true,
    autoRotate: false,
    highQuality: true,
  });

  // Track clock every minute
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "2");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 10000); // 10s check
    return () => clearInterval(interval);
  }, []);

  // Play interface sounds
  const playInteractionSound = () => {
    if (!settings.sound) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.frequency.value = 1000;
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } catch (e) {
      // ignore context lock errors
    }
  };

  // Navigations Transitions
  const triggerScreenTransition = (target: ScreenId, transition: TransitionType) => {
    playInteractionSound();
    setLastTransition(transition);
    
    if (target === "INTRO_AR") {
      // Re-trigger intro overlay and defaults
      setIsIntroDismissed(false);
      setIsIntroCompleted(false);
      setZoomScale(1.0);
      setIsZoomSliderOpen(false);
      setIsSidebarOpen(false);
      setActiveHotspot(null);
    } else if (target === "ADVANCED_AR") {
      // Fully load state and show side tray open by default to assist interaction
      setIsSidebarOpen(true);
    }
    
    setCurrentScreen(target);
  };

  // Reset scale and translation
  const handleResetPanorama = () => {
    playInteractionSound();
    setZoomScale(1.0);
    setResetTrigger((prev) => prev + 1);
    setActiveHotspot(null);
  };

  const handleHotspotClick = (hotspot: HotspotData) => {
    playInteractionSound();
    if (currentScreen === "ADVANCED_AR") {
      setActiveHotspot(hotspot);
    }
  };

  // Animation layout configs mapping
  const transitionVariants = {
    initial: (type: TransitionType) => {
      if (type === "push") return { x: "100vw", opacity: 0 };
      if (type === "push_back") return { x: "-100vw", opacity: 0 };
      if (type === "slide_up") return { y: "100vh", opacity: 0 };
      return { opacity: 0 }; // none / fallback
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 30,
        mass: 0.8,
      },
    },
    exit: (type: TransitionType) => {
      if (type === "push") return { x: "-100vw", opacity: 0, transition: { duration: 0.45 } };
      if (type === "push_back") return { x: "100vw", opacity: 0, transition: { duration: 0.45 } };
      if (type === "slide_up") return { y: "-100vh", opacity: 0, transition: { duration: 0.45 } };
      return { opacity: 0, transition: { duration: 0 } }; // none
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-emerald-950 font-sans select-none text-stone-900 leading-normal">
      
      {/* 360 viewer container (Always active in background, dynamic based on screens) */}
      <AnimatePresence mode="wait">
        {currentScreen === "INTRO_AR" ? (
          <motion.div
            key="intro-viewer-parent"
            custom={lastTransition}
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <PanoramaViewer
              screenId="INTRO_AR"
              backgroundUrl={osullocSunsetPanorama}
              widthPercent={200}
              hotspots={HOTSPOTS_INTRO}
              currentScale={1.0}
              autoRotate={false}
              isIntroScreenDone={isIntroCompleted}
            />
          </motion.div>
        ) : (
          <motion.div
            key="advanced-viewer-parent"
            custom={lastTransition}
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <PanoramaViewer
              screenId="ADVANCED_AR"
              backgroundUrl={osullocSunsetPanorama}
              widthPercent={300}
              hotspots={HOTSPOTS_ADVANCED}
              currentScale={zoomScale}
              onScaleChange={setZoomScale}
              autoRotate={settings.autoRotate}
              onHotspotClick={handleHotspotClick}
              activeHotspotId={activeHotspot?.id}
              resetTrigger={resetTrigger}
              isIntroScreenDone={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen 1 Loader Overlay */}
      {currentScreen === "INTRO_AR" && !isIntroCompleted && (
        <IntroOverlay
          onStartClick={() => {
            setIsIntroDismissed(true);
          }}
          isDismissed={isIntroDismissed}
          onDismissComplete={() => {
            setIsIntroCompleted(true);
            // After loader completes, trigger push transition to Screen 2
            triggerScreenTransition("ADVANCED_AR", "push");
          }}
        />
      )}

      {/* Primary Overlays: UI Layers */}
      <AnimatePresence>
        {isUiVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-between"
          >
            {/* Top Navigation Bar */}
            <nav className="top-0 w-full flex justify-between items-center px-6 md:px-16 py-4 bg-gradient-to-b from-black/25 via-black/5 to-transparent backdrop-blur-[2px]">
              {/* Logo Parent: triggers Screen 1 push_back transitions on Screen 2 */}
              <div 
                onClick={() => {
                  if (currentScreen === "ADVANCED_AR") {
                    triggerScreenTransition("INTRO_AR", "push_back");
                  }
                }}
                className={`flex items-center gap-2 pointer-events-auto cursor-pointer p-1 rounded-lg hover:opacity-85 transition-opacity`}
              >
                <img
                  alt="OSULLOC"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-2GggL45hJQFHeF1tTLzPDGNvTt3yjf1NPag0YiBwoUiGsVp5Y3C8soh6USjcPYDFjy0HGEAowTWgsoJ5wipFKPwd0J_tWajtqP_MR7U7C6uXdeu5nLrBZRPdGFlnKmToHgMD4xGcuhK_hRC-mxoZij-IVBwKvJFFKOrPUl-yGs2kXd-9Y7TlcLD5Yc73XW527anUTnd0EnWIKvlGI6_3m0M0AUu2JyVZsC5rmuMarpOK3v-d_xSwGkFxE89qb0VIdqz3C577z-8"
                  className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
                />
              </div>

              {/* Central Links */}
              <div className="hidden md:flex items-center gap-8 pointer-events-auto">
                <span className="text-white font-bold border-b-2 border-white/80 pb-1 cursor-default tracking-wide text-sm font-display">
                  헤리티지
                </span>
                <span className="text-white/70 hover:text-white transition-colors cursor-pointer text-sm font-display">
                  차밭
                </span>
                <span className="text-white/70 hover:text-white transition-colors cursor-pointer text-sm font-display">
                  경험
                </span>
              </div>

              {/* Functional Actions */}
              <div className="flex items-center gap-6 pointer-events-auto">
                {/* 구매하기: transitions to Screen 2 (push transition) */}
                <button
                  onClick={() => {
                    if (currentScreen === "INTRO_AR") {
                      // Simulates quick start
                      setIsIntroDismissed(true);
                      setIsIntroCompleted(true);
                      triggerScreenTransition("ADVANCED_AR", "push");
                    } else {
                      playInteractionSound();
                      setIsShareOpen(true); // fallbacks
                    }
                  }}
                  className="bg-[#004b41] hover:bg-emerald-900 active:scale-95 text-white border border-[#7dbaad]/20 px-6 py-2.5 rounded-full font-display text-xs font-bold uppercase tracking-widest shadow-lg transition-all cursor-pointer"
                >
                  구매하기
                </button>

                <div className="flex gap-2 text-white">
                  <button 
                    onClick={playInteractionSound}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      playInteractionSound();
                      setIsSidebarOpen((prev) => !prev);
                    }}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
                  >
                    <Menu className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </nav>

            {/* Central Stage elements: Weather & Time status */}
            <div className="mt-4 px-6 md:px-16 flex justify-start">
              <div className="pointer-events-auto glass-card px-5 py-3 rounded-2xl flex items-center gap-4 text-emerald-950 shadow-md">
                <div className="flex flex-col">
                  <span className="font-display text-[10px] text-emerald-800 font-bold uppercase tracking-wider opacity-85">실시간 제주</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Sun className="w-4 h-4 text-amber-600 fill-amber-500 animate-pulse" />
                    <span className="font-display text-lg font-extrabold">24°C</span>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-emerald-900/10 mx-1" />
                <div className="flex flex-col">
                  <span className="font-display text-[10px] text-emerald-800 font-bold uppercase tracking-wider opacity-85">서광리</span>
                  <span id="currentTime" className="font-display text-lg font-extrabold mt-0.5">{currentTime}</span>
                </div>
              </div>
            </div>

            {/* Bottom Section Layout Panel */}
            <div className="mt-auto p-6 md:p-16 flex flex-col md:flex-row justify-between items-end gap-6">
              
              {/* Bottom Details (Show details when NO hotspot info is active or show InfoCard) */}
              <div className="flex-1 max-w-lg">
                <AnimatePresence mode="wait">
                  {activeHotspot ? (
                    <motion.div
                      key="active-info"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                    >
                      <InfoCard
                        hotspot={activeHotspot}
                        onClose={() => setActiveHotspot(null)}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default-info"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="glass-card p-6 md:p-8 rounded-3xl"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#004b41]/10 flex items-center justify-center text-[#004b41]">
                          <span className="font-display text-xl font-bold">360</span>
                        </div>
                        <div>
                          <h1 className="font-display text-3xl font-extrabold text-[#00322b] leading-tight">서광</h1>
                          <p className="font-body text-sm font-semibold text-emerald-800 mt-0.5">대한민국 최고의 유기농 녹차밭</p>
                        </div>
                      </div>
                      <p className="font-body text-body-md text-[#3f4946] leading-relaxed mb-6">
                        제주도의 비옥한 화산 토양과 청정 해풍이 자아내는 서광 차밭은 세계에서 가장 훌륭한 고품질 유기농 녹차가 피어나는 자연 안식처이자 오설록의 심장부입니다.
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="bg-emerald-50 text-[#004b41] font-body text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest shadow-sm">유기농 인증</span>
                        <span className="bg-emerald-50 text-[#004b41] font-body text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest shadow-sm">화산 토양</span>
                        <span className="bg-emerald-50 text-[#004b41] font-body text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest shadow-sm">수작업 채엽</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Interactions Floating Toolbar Panel */}
              <div className="flex flex-col md:flex-row gap-4 items-center pointer-events-auto z-50">
                {/* Visibility/UI Layer Toggle Button */}
                <button
                  id="visibility-toggle"
                  onClick={() => {
                    playInteractionSound();
                    setIsUiVisible(false);
                  }}
                  className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-[#00322b] shadow-lg hover:bg-white/40 active:scale-95 transition-all cursor-pointer group"
                  aria-label="UI 감추기"
                >
                  <EyeOff className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>

                {/* Vertical Range Zoom Slider Container */}
                <div className="relative">
                  {/* Zoom controller popup */}
                  <AnimatePresence>
                    {isZoomSliderOpen && currentScreen === "ADVANCED_AR" && (
                      <motion.div
                        id="zoom-controls"
                        initial={{ opacity: 0, scale: 0.85, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 15 }}
                        className="absolute bottom-16 left-1/2 -translate-x-1/2 w-14 h-48 bg-white/95 backdrop-blur-md rounded-full py-5 px-2 flex flex-col items-center justify-between shadow-xl border border-emerald-150 z-[100] scale-100"
                      >
                        <span className="font-display font-black text-[#004b41] text-xs">+</span>
                        <div className="h-28 w-1 flex items-center justify-center relative">
                          <input
                            type="range"
                            min="1.0"
                            max="3.0"
                            step="0.05"
                            value={zoomScale}
                            onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                            className="h-28 w-1 -rotate-90 origin-center absolute cursor-row-resize"
                            style={{ width: "100px" }}
                          />
                        </div>
                        <span className="font-display font-black text-[#004b41] text-xs">-</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => {
                      playInteractionSound();
                      if (currentScreen === "ADVANCED_AR") {
                        setIsZoomSliderOpen((prev) => !prev);
                      } else {
                        // In Intro screen, simple zoom preset toggling
                        setZoomScale((prev) => (prev === 1.5 ? 1.0 : 1.5));
                      }
                    }}
                    className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-[#00322b] shadow-lg hover:bg-white/40 active:scale-95 transition-all cursor-pointer group"
                    aria-label="화면 줌인"
                  >
                    <ZoomIn className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Share Button Overlay Toggle */}
                <button
                  onClick={() => {
                    playInteractionSound();
                    setIsShareOpen(true);
                  }}
                  className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-[#00322b] shadow-lg hover:bg-white/40 active:scale-95 transition-all cursor-pointer group"
                  aria-label="소셜 공유"
                >
                  <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>

                {/* Camera / Central Position Reset Trigger */}
                <button
                  id="reset-view"
                  onClick={handleResetPanorama}
                  className="w-14 h-14 rounded-full bg-[#004b41] text-white flex items-center justify-center shadow-2xl hover:bg-emerald-900 active:scale-95 transition-all cursor-pointer group"
                  aria-label="중앙 초기화"
                >
                  <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500 ease" />
                </button>
              </div>
            </div>

            {/* Simple centered small layout copyright info */}
            <footer className="w-full pb-4 flex justify-center opacity-45 select-none font-display text-[11px] text-[#00322b]">
              <span>© 2026 OSULLOC. 제주의 전통 티 헤리티지 360.</span>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Invisible Reset button / Back To UI button when UI is toggled invisible */}
      {!isUiVisible && (
        <button
          onClick={() => {
            playInteractionSound();
            setIsUiVisible(true);
          }}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-2xl text-[#004b41] flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300"
          aria-label="UI 다시 보기"
        >
          <Eye className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Left Navigation Sidebar Drawer Drawer */}
      <Sidebar
        screenId={currentScreen}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSeogwangClick={() => {
          // Element (xpath: `//span[text()='nature']/following-sibling::span[text()='서광 차밭']/..`) → ADVANCED_AR (none transition)
          triggerScreenTransition("ADVANCED_AR", "none");
          setIsSidebarOpen(false);
        }}
        onReservationClick={() => {
          // Element (xpath: `//button[contains(text(), '방문 예약')]`) → INTRO_AR (slide_up transition)
          triggerScreenTransition("INTRO_AR", "slide_up");
          setIsSidebarOpen(false);
        }}
        onSettingsClick={() => {
          playInteractionSound();
          setIsSettingsOpen(true);
        }}
        onSupportClick={() => {
          playInteractionSound();
          setIsHelpOpen(true);
        }}
      />

      {/* Modals Dialog Components */}
      {/* Settings Panel */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* Share panel */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Modern FAQ / Help / Customer Support Modal */}
      <AnimatePresence>
        {isHelpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[105] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative text-left">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-50 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-display text-2xl font-bold text-[#00322b] mb-4">
                고객지원
              </h3>
              <div className="flex flex-col gap-4 font-body text-sm text-stone-600 mb-6">
                <div>
                  <h4 className="font-semibold text-stone-800">1. AR 360 뷰어는 어떻게 조작하나요?</h4>
                  <p className="mt-1">화면을 마우스로 드래그(또는 스마트 기기에서 터치 스와이프)하여 제주 서광리 차밭을 천천히 둘러보실 수 있습니다.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-800">2. 주요 관람 스팟에 대한 상세 정보는 어떻게 보나요?</h4>
                  <p className="mt-1">화면에 표시된 반투명 펄스형 핫스팟 아이콘을 클릭하시면 해당 위치의 자세한 식물학적, 역사적 스토리를 알려드립니다.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-800">3. 가상 줌인 기능은 어떻게 사용되나요?</h4>
                  <p className="mt-1">우측 돋보기 아이콘을 누르면 세로형 밀도가 포함된 정밀 슬라이더를 통해 차밭의 싱그러운 찻잎을 최대 3배까지 확대하실 수 있습니다.</p>
                </div>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-full bg-[#004b41] hover:bg-[#00322b] text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                확인
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
