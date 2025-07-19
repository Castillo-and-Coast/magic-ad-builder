import React, { useRef, useState } from "react";

interface PreviewStepProps {
  file: File;
}

function wordCount(str: string) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export default function PreviewStep({ file }: PreviewStepProps) {
  const [focal, setFocal] = useState({ x: 50, y: 50 }); // percent
  const imgRef = useRef<HTMLImageElement>(null);
  const [dragging, setDragging] = useState(false);
  const [headline, setHeadline] = useState("");
  const [cta, setCta] = useState("");

  // Disney-style checklist: Story Spine
  const headlineValid = wordCount(headline) > 0 && wordCount(headline) <= 9;
  const ctaValid = wordCount(cta) > 0 && wordCount(cta) <= 3;
  const star1 = headlineValid && ctaValid;

  const handleDrag = (e: React.TouchEvent | React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    setFocal({ x: x * 100, y: y * 100 });
  };

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    setDragging(true);
    handleDrag(e);
  };
  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragging) handleDrag(e);
  };
  const handleEnd = () => setDragging(false);

  const url = URL.createObjectURL(file);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Progress bar with dynamic first star */}
      <div className="w-full flex justify-center mb-2">
        <div className="h-6 w-48 bg-gray-100 rounded-full flex items-center justify-between px-2">
          <span className={star1 ? "text-yellow-400 text-xl animate-pulse" : "text-gray-300 text-xl"}>★</span>
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-gray-300 text-xl">★</span>
          ))}
        </div>
      </div>
      <div className="relative w-full max-w-xs aspect-[8.5/11] bg-gray-50 rounded-lg overflow-hidden shadow">
        <img
          ref={imgRef}
          src={url}
          alt="Preview"
          className="w-full h-full object-contain select-none"
          draggable={false}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        {/* Draggable focal-point ring */}
        <div
          className="absolute z-10"
          style={{
            left: `calc(${focal.x}% - 20px)`,
            top: `calc(${focal.y}% - 20px)`,
            width: 40,
            height: 40,
            pointerEvents: "none",
          }}
        >
          <div className="w-10 h-10 rounded-full border-4 border-blue-400 bg-blue-200/30 shadow-inner pointer-events-none" />
        </div>
      </div>
      {/* Headline and CTA inputs */}
      <div className="w-full flex flex-col gap-2 mt-2">
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Headline (≤ 9 words)"
          value={headline}
          onChange={e => setHeadline(e.target.value)}
          maxLength={60}
        />
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Call to Action (≤ 3 words)"
          value={cta}
          onChange={e => setCta(e.target.value)}
          maxLength={20}
        />
        <div className="text-xs text-gray-500 mt-1">
          {headline && !headlineValid && <span className="text-red-500">Headline must be 1-9 words. </span>}
          {cta && !ctaValid && <span className="text-red-500">CTA must be 1-3 words.</span>}
          {star1 && <span className="text-green-600">Story Spine rule satisfied! ⭐</span>}
        </div>
      </div>
      {/* Palette suggestions placeholder */}
      <div className="w-full flex justify-center mt-2">
        <div className="bg-gray-100 rounded px-3 py-1 text-xs text-gray-500">Palette suggestions will appear here if contrast fails</div>
      </div>
    </div>
  );
}
