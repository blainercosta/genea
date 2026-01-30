"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  caption?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Foto original",
  afterAlt = "Foto restaurada",
  caption,
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full cursor-ew-resize overflow-hidden rounded-2xl bg-ih-surface-warm select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* After image (full width, underneath) */}
        <div className="absolute inset-0">
          <img
            src={afterImage}
            alt={afterAlt}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute bottom-3 right-3 rounded-full bg-genea-green px-3 py-1 text-xs font-medium text-white">
            Depois
          </div>
        </div>

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt={beforeAlt}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute bottom-3 left-3 rounded-full bg-ih-text/80 px-3 py-1 text-xs font-medium text-white">
            Antes
          </div>
        </div>

        {/* Divider line with handle */}
        <div
          className="absolute top-0 bottom-0 z-10 flex items-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute h-full w-0.5 bg-white shadow-lg" />
          <button
            className={cn(
              "absolute left-1/2 -translate-x-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-genea-green/50",
              isDragging && "scale-110"
            )}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            aria-label="Arrastar para comparar antes e depois"
          >
            <MoveHorizontal className="h-5 w-5 text-ih-text" />
          </button>
        </div>
      </div>

      {caption && (
        <p className="text-center text-sm text-ih-text-secondary italic font-medium">
          {caption}
        </p>
      )}
    </div>
  );
}
