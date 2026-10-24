import React, { useState, useRef, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalUrl: string;
  processedUrl: string;
  originalAlt?: string;
  processedAlt?: string;
  heightClass?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  originalUrl,
  processedUrl,
  originalAlt = 'Original image',
  processedAlt = 'Background removed image',
  heightClass = 'h-[420px] md:h-[500px]',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((p) => Math.max(0, p - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((p) => Math.min(100, p + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Image comparison before and after background removal"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full ${heightClass} select-none overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-cyan-500`}
      onPointerDown={handlePointerDown}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Background Layer: Processed image on checkerboard pattern */}
      <div className="absolute inset-0 bg-checkerboard flex items-center justify-center p-2">
        <img
          src={processedUrl}
          alt={processedAlt}
          className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-md"
        />
        <span className="absolute bottom-4 right-4 rounded-md bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-cyan-400 border border-cyan-500/30">
          Transparent Cutout
        </span>
      </div>

      {/* Foreground Layer: Original image clipped by slider position */}
      <div
        className="absolute inset-0 overflow-hidden flex items-center justify-center bg-slate-950 p-2"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={originalUrl}
          alt={originalAlt}
          className="max-h-full max-w-full object-contain pointer-events-none"
        />
        <span className="absolute bottom-4 left-4 rounded-md bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-700">
          Original Image
        </span>
      </div>

      {/* Divider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-900 border-2 border-white text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110">
          <MoveHorizontal className="w-5 h-5 text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
