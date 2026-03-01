import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Zap,
  Target,
  Music,
  Activity,
  ChevronDown,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const secondSectionRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // GSAP Animations
    const ctx = gsap.context(() => {
      // Title Sequence (First Screen)
      const tl = gsap.timeline();

      tl.from(".college-name", {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          titleRef.current,
          {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
          },
          "-=0.5",
        )
        .from(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8",
        )
        .from(
          ".scroll-indicator",
          {
            opacity: 0,
            y: -10,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          },
          "-=0.5",
        );

      // Second Screen Animations (ScrollTrigger)
      // Note: We use a separate ScrollTrigger for each group to allow them to animate in as they scroll into view

      gsap.from(".feature-pill", {
        scrollTrigger: {
          trigger: secondSectionRef.current,
          start: "top 60%", // Start animation when top of section hits 60% of viewport
          toggleActions: "play none none reverse",
        },
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.7)",
      });

      gsap.from(".countdown-container", {
        scrollTrigger: {
          trigger: secondSectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".cta-container", {
        scrollTrigger: {
          trigger: secondSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const targetDate = new Date("March 7, 2026 00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <Activity size={18} />, text: "5K Run" },
    { icon: <Zap size={18} />, text: "Flashmob" },
    { icon: <Target size={18} />, text: "Technical Events" },
    { icon: <Music size={18} />, text: "Non-Technical Events" },
  ];

  return (
    <div
      ref={heroRef}
      className="relative bg-slate-900"
      data-testid="hero-section"
    >
      {/* Sticky Background Video */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0 select-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105"
        >
          <source
            src="https://cdn.pixabay.com/video/2024/11/12/240968_large.mp4"
            type="video/mp4"
          />
          {/* <source
            src="https://www.pexels.com/download/video/3253859/"
            type="video/mp4"
          /> */}
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/80 via-[#030712]/60 to-[#030712] pointer-events-none"></div>

        {/* Decorative Orbs inside the sticky container so they float nicely */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Top/Bottom Fade */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#030712] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#030712] to-transparent"></div>
      </div>

      {/* Content Container - Relative so it scrolls over the sticky background */}
      <div className="relative z-10 -mt-[100vh]">
        {/* Screen 1: Title and Branding */}
        <section className="min-h-screen flex flex-col items-center justify-center container mx-auto px-6 md:px-12 text-center">
          {/* College Name Badge */}
          <div className="college-name inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-900/30 backdrop-blur-md mb-8 hover:bg-indigo-900/50 transition-all cursor-default">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-indigo-200 text-sm font-medium tracking-wider uppercase">
              CVRCOE Presents
            </span>
          </div>

          {/* Main Title */}
          <div ref={titleRef} className="mb-10 flex flex-col items-center">
            <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none">
              <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] block mb-2 sm:mb-4">
                CIENCIA
              </span>
              <span className="gradient-text drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                2K26
              </span>
            </h1>
          </div>

          <p
            ref={subtitleRef}
            className="text-xl sm:text-2xl md:text-3xl text-slate-300 mb-10 font-body font-light max-w-3xl mx-auto leading-relaxed"
            data-testid="hero-subtitle"
          >
            A National Level Technical Symposium <br />
            <span className="text-indigo-400 font-medium">
              Where Innovation Meets Celebration
            </span>
          </p>

          {/* Scroll Indicator */}
          <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown size={24} className="animate-bounce" />
          </div>
        </section>

        {/* Screen 2: Countdown and Actions */}
        <section
          ref={secondSectionRef}
          className="min-h-screen flex flex-col items-center justify-center container mx-auto px-6 md:px-12 text-center"
        >
          {/* Glassmorphism Countdown */}
          <div className="countdown-container glass-effect rounded-3xl p-8 md:p-10 max-w-5xl mx-auto mb-16 border border-white/5 shadow-2xl shadow-indigo-500/10 w-full md:w-auto">
            <h3 className="text-2xl font-heading text-white mb-8">
              Festival Begins In
            </h3>
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-white/10"
              data-testid="countdown-timer"
            >
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center justify-center p-2 min-w-[100px]"
                >
                  <div className="text-5xl md:text-6xl lg:text-7xl font-black font-mono text-white mb-2 tracking-tighter tabular-nums text-glow-primary">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs md:text-sm text-indigo-200 font-body uppercase tracking-[0.2em]">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="cta-container flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-indigo-400" />
                <span className="font-mono text-sm">March 7-14, 2026</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-cyan-400" />
                <span className="font-mono text-sm">CVRCOE</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hero;
