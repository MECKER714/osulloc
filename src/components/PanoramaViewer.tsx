/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { HotspotData, ScreenId } from "../types";

interface PanoramaViewerProps {
  screenId: ScreenId;
  backgroundUrl: string;
  widthPercent: number; // 200 or 300
  hotspots: HotspotData[];
  currentScale: number;
  onScaleChange?: (scale: number) => void;
  autoRotate: boolean;
  onHotspotClick?: (hotspot: HotspotData) => void;
  activeHotspotId?: string | null;
  resetTrigger?: number; // to listen to resets from parent
  isIntroScreenDone: boolean;
}

export default function PanoramaViewer({
  screenId,
  backgroundUrl,
  widthPercent,
  hotspots,
  currentScale,
  onScaleChange,
  autoRotate,
  onHotspotClick,
  activeHotspotId,
  resetTrigger,
  isIntroScreenDone,
}: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const [rotation, setRotation] = useState<number>(-300);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<HotspotData | null>(null);

  const dragStartX = useRef<number>(0);
  const autoRotateDir = useRef<number>(-1); // direction: -1 is right-to-left, +1 is left-to-right
  const rotationRef = useRef<number>(-300);

  // Sync ref with rotation state so animation loops can read the latest value
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  // Handle ResizeObserver to track dynamic boundaries
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Compute boundaries based on panorama strip width vs container width
  const getBounds = () => {
    const wrapWidth = containerWidth * (widthPercent / 100) * currentScale;
    const min = -(wrapWidth - containerWidth);
    const max = 0;
    return { min, max };
  };

  const clampRotation = (value: number, scale = currentScale) => {
    const wrapWidth = containerWidth * (widthPercent / 100) * scale;
    const min = -(wrapWidth - containerWidth);
    const max = 0;
    return Math.min(Math.max(value, min), max);
  };

  // Set initial scroll to center of panorama
  useEffect(() => {
    if (containerWidth) {
      const wrapWidth = containerWidth * (widthPercent / 100) * currentScale;
      const min = -(wrapWidth - containerWidth);
      setRotation(min / 2);
    }
  }, [containerWidth, widthPercent]);

  // Handle reset trigger from parent
  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger > 0) {
      const wrapWidth = containerWidth * (widthPercent / 100) * 1.0;
      const min = -(wrapWidth - containerWidth);
      setRotation(min / 2);
    }
  }, [resetTrigger]);

  // Auto rotation animation frame
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (autoRotate && !isDragging && isIntroScreenDone) {
        const delta = (time - lastTime) / 30; // speed calibration
        const bounds = getBounds();
        
        let newRot = rotationRef.current + autoRotateDir.current * (0.8 * delta);

        if (newRot <= bounds.min) {
          newRot = bounds.min;
          autoRotateDir.current = 1; // reverse to slide back
        } else if (newRot >= bounds.max) {
          newRot = bounds.max;
          autoRotateDir.current = -1; // reverse to slide forward
        }

        setRotation(newRot);
      }
      lastTime = time;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [autoRotate, isDragging, containerWidth, currentScale, widthPercent, isIntroScreenDone]);

  // Drag interaction handlers
  const handleDragStart = (clientX: number) => {
    if (screenId === "INTRO_AR" && !isIntroScreenDone) return;
    setIsDragging(true);
    dragStartX.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = (clientX - dragStartX.current) * 1.35; // slightly faster dragging for premium responsiveness
    dragStartX.current = clientX;
    setRotation((prev) => clampRotation(prev + deltaX));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Touch Support
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleDragStart(e.touches[0].clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleDragMove(e.touches[0].clientX);
    }
  };

  // Wheel Zoom support in Screen 2
  const onWheel = (e: React.WheelEvent) => {
    if (screenId !== "ADVANCED_AR" || !onScaleChange || !isIntroScreenDone) return;
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.0015;
    const nextScale = Math.min(Math.max(1.0, currentScale + zoomDelta), 3.0);
    
    // adjust rotation so zoom feels centered on cursor
    if (nextScale !== currentScale) {
      onScaleChange(nextScale);
      setRotation((prev) => clampRotation(prev, nextScale));
    }
  };

  return (
    <div
      id="viewer-container"
      ref={containerRef}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={handleDragEnd}
      onWheel={onWheel}
      className="fixed inset-0 overflow-hidden select-none bg-[#001a16] transition-all"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div
        id="panorama-wrap"
        ref={wrapRef}
        style={{
          width: `${widthPercent}%`,
          backgroundImage: `url('${backgroundUrl}')`,
          transform: `scale(${currentScale}) translateX(${rotation / currentScale}px)`,
          transition: isDragging ? "none" : "transform 0.15s cubic-bezier(0.1, 0.8, 0.3, 1)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="absolute h-full left-0 top-0 will-change-transform flex items-center justify-center transform-origin-center"
      >
        {/* Hotspots plotted relative to the absolute scrolling panorama parent */}
        {hotspots.map((hotspot) => {
          const isActive = activeHotspotId === hotspot.id;
          return (
            <div
              key={hotspot.id}
              className="hotspot group z-20"
              style={{
                top: `${hotspot.top}%`,
                left: `${hotspot.left}%`,
                position: "absolute",
              }}
              onMouseEnter={() => setHoveredHotspot(hotspot)}
              onMouseLeave={() => setHoveredHotspot(null)}
              onClick={(e) => {
                e.stopPropagation(); // avoid dragging trigger
                if (onHotspotClick) {
                  onHotspotClick(hotspot);
                }
              }}
            >
              <div className="relative w-14 h-14 flex items-center justify-center cursor-pointer">
                {/* Custom Pulsating Inner Ring */}
                <div 
                  className={`absolute hotspot-ring w-full h-full rounded-full transition-all duration-300 ${
                    isActive ? "bg-emerald-300/40" : "bg-white/40"
                  }`} 
                />
                
                {/* Core core circle */}
                <div
                  className={`absolute hotspot-dot w-4 h-4 rounded-full shadow-lg border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-400 border-white scale-125"
                      : "bg-white border-[#00322b] hover:scale-125 group-hover:bg-emerald-50"
                  }`}
                />
              </div>

              {/* Hover Tooltip - Specifically built for Screen 1 or general hover states */}
              {(screenId === "INTRO_AR" || !isIntroScreenDone) && hoveredHotspot?.id === hotspot.id && (
                <div 
                  className="absolute bottom-16 left-1/2 -translate-x-1/2 glass-card p-4 rounded-xl w-64 translate-y-0 opacity-100 transition-all duration-300 pointer-events-none z-30"
                >
                  <h3 className="font-display text-headline-lg-mobile text-[#00322b] mb-1">
                    {hotspot.title}
                  </h3>
                  <p className="font-body text-body-md text-[#3f4946] leading-tight">
                    {hotspot.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
