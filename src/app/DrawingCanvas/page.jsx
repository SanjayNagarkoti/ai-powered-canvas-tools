"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import to avoid hydration issues with canvas
const DrawingCanvas = dynamic(() => import('../DrawingCanvas'), {
  ssr: false // This will only render the component on client side
});

export default function DrawingCanvasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <DrawingCanvas />
    </div>
  );
} 