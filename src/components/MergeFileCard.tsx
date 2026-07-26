import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, Trash2, FileText } from 'lucide-react';

interface MergeFileCardProps {
  key?: React.Key;
  idx: number;
  originalNum: number;
  name: string;
  size: number;
  thumbnailUrl?: string;
  onMove: (fromIdx: number, toIdx: number) => void;
}

export function MergeFileCard({
  idx,
  originalNum,
  name,
  size,
  thumbnailUrl,
  onMove,
}: MergeFileCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', idx.toString());
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    
    // Create a ghost image or handle drag state style
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.4';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fromIndexStr = e.dataTransfer.getData('text/plain');
    if (fromIndexStr !== '') {
      const fromIndex = parseInt(fromIndexStr, 10);
      if (fromIndex !== idx) {
        onMove(fromIndex, idx);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} بايت`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} كيلوبايت`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} ميجابايت`;
  };

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`bg-[#1c1c20] border border-[#23232a] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm select-none cursor-grab active:cursor-grabbing transition-all ${
        isDragging
          ? 'ring-4 ring-[#388bfd]/30 scale-[0.98] border-[#388bfd]/50 bg-[#22222a] z-50'
          : 'hover:border-[#388bfd]/30 hover:bg-[#1f1f25]'
      }`}
    >
      {/* Left Handle icon */}
      <div className="flex items-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-grab p-1">
        <Menu className="w-5 h-5 stroke-[2]" />
      </div>

      {/* Middle info */}
      <div className="min-w-0 flex-1 text-right pr-1">
        <h4 className="text-sm font-semibold text-white truncate dir-ltr text-right select-none">
          {name}
        </h4>
        <div className="flex items-center gap-2 justify-end mt-1">
          {/* Badge Number */}
          <motion.span
            layout="position"
            className="text-[10px] font-extrabold bg-[#2a2a35] text-zinc-300 px-2 py-0.5 rounded-md min-w-[18px] text-center border border-zinc-700"
          >
            {originalNum}
          </motion.span>
          <span className="text-[11px] text-[#8e8e93]">
            {formatFileSize(size)}
          </span>
        </div>
      </div>

      {/* Right Thumbnail */}
      <div className="flex items-center gap-3.5 shrink-0">
        {/* PDF Thumbnail */}
        <div className="w-12 h-12 rounded-xl bg-[#272730] border border-[#2e2e3a] overflow-hidden flex items-center justify-center shrink-0 shadow-inner relative group">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="PDF Thumbnail"
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <FileText className="w-5 h-5 text-[#388bfd] stroke-[1.75]" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
