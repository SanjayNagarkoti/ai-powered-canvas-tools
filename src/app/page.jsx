"use client";
import React from "react";
import { useState } from "react";
import Link from 'next/link';
import DrawingCanvas from "./DrawingCanvas";
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
function MainComponent() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const aiTools = [
    {
      id: 1,
      title: "Canvas to Code",
      description: "Transform your sketches into production-ready code",
      icon: "fa-solid fa-code",
      color: "bg-[#6366F1]",
      demo: "/canvas-to-code-demo.png",
    },
    {
      id: 2,
      title: "Image Finder & Generator",
      description: "Find similar images or generate new ones from your canvas",
      icon: "fa-solid fa-image",
      color: "bg-[#8B5CF6]",
      demo: "/image-generator-demo.png",
    },
    {
      id: 3,
      title: "Math Problem Solver",
      description: "Get step-by-step solutions for mathematical equations",
      icon: "fa-solid fa-square-root-variable",
      color: "bg-[#A855F7]",
      demo: "/math-solver-demo.png",
    },
    {
      id: 4,
      title: "Flow Diagram Generator",
      description: "Convert your sketches into professional flow diagrams",
      icon: "fa-solid fa-diagram-project",
      color: "bg-[#D946EF]",
      demo: "/flow-diagram-demo.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <nav className="backdrop-blur-lg bg-[#0F172A]/90 fixed w-full z-50 border-b border-[#6366F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <i className="fa-solid fa-brain text-3xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-transparent bg-clip-text"></i>
              <h1 className="ml-3 text-xl md:text-2xl font-bold text-white font-poppins">
                AI Canvas Tools
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 md:px-6 py-2 text-white font-roboto hover:text-[#6366F1] transition-colors text-sm md:text-base"
              >
                Login
              </button>
              <button className="px-4 md:px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white rounded-full font-roboto hover:opacity-90 transition-opacity text-sm md:text-base">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 py-12 md:py-20">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-poppins leading-tight">
                Transform Your Ideas with
                <span className="block mt-2 bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-transparent bg-clip-text">
                  AI-Powered Canvas
                </span>
              </h2>
              <p className="text-white text-lg mb-8 font-roboto max-w-2xl mx-auto lg:mx-0">
                Draw, sketch, or write naturally - our AI tools convert your
                creative input into production-ready assets instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href={<Tldraw />} className="inline-block">
                  <button className="px-8 py-3 bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white rounded-full font-roboto hover:opacity-90 transition-opacity flex items-center justify-center">
                    Start Creating
                    <i className="fa-solid fa-arrow-right ml-2"></i>
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full max-w-xl lg:max-w-none">
              <img
                src="/hero-illustration.png"
                alt="AI Canvas Tools Demo"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 py-12 md:py-20">
            {aiTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-6 hover:scale-102 transition-all cursor-pointer border border-[#6366F1] hover:border-[#A855F7] group"
                onClick={() => setSelectedTool(tool.id)}
              >
                <div
                  className={`${tool.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <i className={`${tool.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-white text-xl font-semibold mb-2 font-poppins">
                  {tool.title}
                </h3>
                <p className="text-white font-roboto mb-4 text-sm">
                  {tool.description}
                </p>
                <img
                  src={tool.demo}
                  alt={`${tool.title} demonstration`}
                  className="w-full h-32 object-cover rounded-xl mb-4"
                />
                <Link href="/DrawingCanvas" className="block w-full">
                  <button className="w-full text-white bg-[#6366F1] hover:bg-[#A855F7] px-4 py-2 rounded-xl font-roboto flex items-center justify-center transition-colors">
                    Try Now
                    <i className="fa-solid fa-arrow-right ml-2"></i>
                  </button>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center py-12 md:py-20">
            <h3 className="text-3xl font-bold text-white mb-12 font-poppins">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-[#1E293B]/50 rounded-2xl border border-[#6366F1]">
                <div className="w-16 h-16 rounded-full bg-[#6366F1] flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-transform">
                  <i className="fa-solid fa-pencil text-white text-2xl"></i>
                </div>
                <h4 className="text-white text-xl font-semibold mb-2">Draw</h4>
                <p className="text-white">
                  Sketch your idea naturally on the canvas
                </p>
              </div>
              <div className="p-6 bg-[#1E293B]/50 rounded-2xl border border-[#6366F1]">
                <div className="w-16 h-16 rounded-full bg-[#8B5CF6] flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-transform">
                  <i className="fa-solid fa-wand-magic-sparkles text-white text-2xl"></i>
                </div>
                <h4 className="text-white text-xl font-semibold mb-2">
                  Process
                </h4>
                <p className="text-white">
                  Our AI analyzes and transforms your input
                </p>
              </div>
              <div className="p-6 bg-[#1E293B]/50 rounded-2xl border border-[#6366F1]">
                <div className="w-16 h-16 rounded-full bg-[#A855F7] flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-transform">
                  <i className="fa-solid fa-rocket text-white text-2xl"></i>
                </div>
                <h4 className="text-white text-xl font-semibold mb-2">
                  Generate
                </h4>
                <p className="text-white">
                  Get production-ready output instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
    
  );
}

export default MainComponent;