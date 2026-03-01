import React, { useEffect, useState } from "react";

const loadingTexts = ["INITIALIZING", "LOADING ASSETS", "CONNECTING", "READY"];

const Preloader = ({ onFinish }) => {
  const [stage, setStage] = useState(0); // 0: Initial, 1: Loaded, 2: Fading
  const [displayText, setDisplayText] = useState(loadingTexts[0]);

  useEffect(() => {
    // Stage 1: Text cycling
    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % loadingTexts.length;
      setDisplayText(loadingTexts[textIndex]);
    }, 500);

    // Stage 2: Finish loading after 2.5s
    const loadTimer = setTimeout(() => {
      clearInterval(textInterval);
      setDisplayText("READY");
      setStage(1);

      // Stage 3: Start exit animation
      setTimeout(() => {
        setStage(2);
        // Stage 4: Remove component
        setTimeout(onFinish, 800);
      }, 500);
    }, 2500);

    return () => {
      clearInterval(textInterval);
      clearTimeout(loadTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-[#020617] transition-all duration-800 ease-smooth-out
        ${stage === 2 ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"}
      `}
    >
      {/* Premium Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ambient Glow Orbs - Behind Grid */}
        <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] top-0 left-0 animate-pulse delay-700"></div>
        <div className="absolute w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] bottom-0 right-0 animate-pulse delay-500"></div>

        {/* Grid Pattern - Increased Visibility */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 0%, transparent 80%)",
          }}
        ></div>

        {/* Vignette Overlay - On Top */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)] opacity-80 z-10"></div>
      </div>

      <div className="relative flex flex-col items-center z-10">
        {/* Logo Container with Reveal Effect */}
        <div
          className={`relative mb-8 transition-transform duration-700 ${stage === 2 ? "scale-110 blur-sm" : "scale-100"}`}
        >
          <div className="relative overflow-hidden p-4 group cursor-pointer">
            <img
              src="/logo.png?v=2"
              alt="Ciencia 2K26"
              className="w-48 md:w-64 object-contain drop-shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-500 ease-out group-hover:scale-110 group-hover:drop-shadow-[0_0_50px_rgba(34,211,238,0.8)]"
            />
            {/* Shimmer Overlay on Logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-loader-shimmer pointer-events-none"></div>
          </div>
        </div>

        {/* Premium Progress Bar */}
        <div className="w-64 h-[2px] bg-slate-800/50 rounded-full overflow-hidden relative mb-4">
          {/* Glowing leading edge */}
          <div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-indigo-500 blur-[1px] animate-loader-slide"></div>
          {/* Solid line */}
          <div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-300 to-indigo-400 animate-loader-slide"></div>
        </div>

        {/* Minimal Tech Text */}
        <div className="h-6 overflow-hidden flex flex-col items-center">
          <span className="text-slate-500 font-mono text-[10px] tracking-[0.4em] uppercase animate-pulse cursor-default transition-all duration-300 hover:text-cyan-400 hover:tracking-[0.6em] hover:text-glow-secondary">
            {displayText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
