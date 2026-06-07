import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BsLightningChargeFill,
  BsGraphUpArrow,
  BsShieldCheck,
  BsServer,
  BsActivity,
  BsCheckCircleFill,
  BsStarFill,
  BsGithub,
  BsTwitter,
} from "react-icons/bs";
import {
  MdOutlineDashboardCustomize,
  MdNotificationsActive,
  MdAutoFixHigh,
} from "react-icons/md";
import { TbWorldCheck, TbClockBolt, TbReportAnalytics } from "react-icons/tb";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { LuActivity } from "react-icons/lu";
import { RiAiGenerate } from "react-icons/ri";
import { FaRocket, FaUsers, FaServer, FaGlobe } from "react-icons/fa";
import { SiPostgresql } from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isNavVisible, setIsNavVisible] = useState(true);
  let lastScrollY = useRef(0);
  // Refs for animations
  const navRef = useRef(null);
  const heroTitleLettersRef = useRef([]);
  const heroSubRef = useRef(null);
  const scrollHintRef = useRef(null);
  const heroTagRef = useRef(null);
  const heroBtnsRef = useRef(null);

  const prob1Ref = useRef(null);
  const prob2Ref = useRef(null);
  const prob3Ref = useRef(null);
  const probHeadRef = useRef(null);

  const solHeadRef = useRef(null);
  const sol1Ref = useRef(null);
  const sol2Ref = useRef(null);
  const sol3Ref = useRef(null);

  const statsRef = useRef(null);
  const featuresRef = useRef(null);

  const howItWorksRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const trustBadgesRef = useRef(null);
  const globalReachRef = useRef(null);
  const livePreviewRef = useRef(null);
  const dashboardMockRef = useRef(null);

  const pulseIndicatorRef = useRef(null);
  const statusBadgeRef = useRef(null);
  const uptimeValueRef = useRef(null);
  const responseValueRef = useRef(null);
  const checksValueRef = useRef(null);
  const incidentValueRef = useRef(null);
  const graphLinesRef = useRef([]);
  const serviceItemsRef = useRef([]);

  const heroTitle = "PulseWatch";
  const heroLetters = heroTitle.split("");

  useEffect(() => {
    // Letter animations for "PulseWatch" - starting from visible state
    heroTitleLettersRef.current.forEach((letter, index) => {
      gsap.fromTo(
        letter,
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotation: 0,
          scale: 1,
          filter: "blur(0px)",
        },
        {
          opacity: 1,
          y: -8,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.1,
        },
      );

      gsap.to(letter, {
        textShadow: "0 0 15px rgba(10,10,10,0.4)",
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.1,
      });

      letter.addEventListener("mouseenter", () => {
        gsap.to(letter, {
          rotationY: 360,
          scale: 1.2,
          duration: 0.4,
          ease: "back.out(1.5)",
        });
      });
      letter.addEventListener("mouseleave", () => {
        gsap.to(letter, {
          rotationY: 0,
          scale: 1,
          duration: 0.3,
        });
      });
    });

    gsap.to(scrollHintRef.current, {
      y: 8,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.5,
    });

    // Problem Section - from visible state (no fade)
    gsap.fromTo(
      probHeadRef.current,
      { opacity: 1, y: 0 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: probHeadRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    [prob1Ref, prob2Ref, prob3Ref].forEach((ref, i) => {
      gsap.fromTo(
        ref.current,
        { opacity: 1, x: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    // Solution Section - from visible state
    gsap.fromTo(
      solHeadRef.current,
      { opacity: 1, y: 0 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: solHeadRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    [sol1Ref, sol2Ref, sol3Ref].forEach((ref, i) => {
      gsap.fromTo(
        ref.current,
        { opacity: 1, y: 0, scale: 1 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.2)",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    // Stats Counter - from visible state
    gsap.fromTo(
      statsRef.current,
      { opacity: 1, y: 0 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      },
    );

    // Features - from visible state
    gsap.fromTo(
      featuresRef.current,
      { opacity: 1, y: 0 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      },
    );

    // How It Works - from visible state
    gsap.fromTo(
      howItWorksRef.current,
      { opacity: 1, y: 0 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    [step1Ref, step2Ref, step3Ref].forEach((ref, i) => {
      gsap.fromTo(
        ref.current,
        { opacity: 1, scale: 1, rotationY: 0 },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.5,
          ease: "back.out(1.3)",
          delay: i * 0.12,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    // Trust Badges - from visible state
    gsap.fromTo(
      trustBadgesRef.current,
      { opacity: 1, scale: 1 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.6)",
        scrollTrigger: {
          trigger: trustBadgesRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    // Global Reach - from visible state
    gsap.fromTo(
      globalReachRef.current,
      { opacity: 1, x: 0 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: globalReachRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    // Live Preview - from visible state
    gsap.fromTo(
      livePreviewRef.current,
      { opacity: 1, y: 0 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: livePreviewRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    gsap.fromTo(
      dashboardMockRef.current,
      { opacity: 1, scale: 1, y: 0 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: dashboardMockRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );

    // System Status Animations
    if (pulseIndicatorRef.current) {
      gsap.to(pulseIndicatorRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.8,
        repeat: -1,
        ease: "power1.inOut",
      });
    }

    if (statusBadgeRef.current) {
      gsap.to(statusBadgeRef.current, {
        boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Counter Animations
    const animateValue = (element, start, end, duration, suffix = "") => {
      if (!element) return;
      const range = end - start;
      const startTime = performance.now();
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(start + range * progress);
        element.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(updateCounter);
      };
      requestAnimationFrame(updateCounter);
    };

    ScrollTrigger.create({
      trigger: dashboardMockRef.current,
      start: "top 70%",
      onEnter: (self) => {
        if (uptimeValueRef.current)
          animateValue(uptimeValueRef.current, 99.5, 99.99, 1500, "%");
        if (responseValueRef.current)
          animateValue(responseValueRef.current, 180, 127, 1500, "ms");
        if (checksValueRef.current)
          animateValue(checksValueRef.current, 30, 45, 1500, "K");
        if (incidentValueRef.current)
          animateValue(incidentValueRef.current, 5, 0, 1500, "");
        self.kill();
      },
    });

    // Graph Line Animation
    if (graphLinesRef.current.length) {
      gsap.fromTo(
        graphLinesRef.current,
        { strokeDashoffset: 500 },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: dashboardMockRef.current,
            start: "top 70%",
          },
        },
      );
    }

    if (serviceItemsRef.current.length) {
      gsap.fromTo(
        serviceItemsRef.current,
        { opacity: 1, x: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "back.out(1)",
          scrollTrigger: {
            trigger: dashboardMockRef.current,
            start: "top 70%",
          },
        },
      );
    }

    // Scroll listener for navbar visibility
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsNavVisible(false);
      } else {
        // Scrolling up
        setIsNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div
        className={`w-full text-[#0a0a0a] overflow-x-hidden relative transition-opacity duration-1000 hide-scrollbar ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundColor: "#FFF2DF",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <style>
          {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
          * { font-family: 'Poppins', sans-serif; }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes glow-pulse {
            0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
            50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.6); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes scan {
            0% { left: -10%; opacity: 0; }
            50% { opacity: 1; }
            100% { left: 110%; opacity: 0; }
          }
          @keyframes loading-bar {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-float { animation: float 2s ease-in-out infinite; }
          .animate-glow { animation: glow-pulse 1.5s ease-in-out infinite; }
          .animate-scan { width: 3px; animation: scan 2s ease-in-out infinite; }
          .animate-loading-bar { animation: loading-bar 2.5s ease-in-out infinite; }
          .animate-spin-slow { animation: spin-slow 15s linear infinite; }
          
          .hero-letter {
            display: inline-block;
            will-change: transform;
            cursor: pointer;
            transition: all 0.2s ease;
            
          }
          
          .gradient-shimmer {
            background: #3E2522;
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: shimmer 2s linear infinite;
          }
          
          .card-3d {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .card-3d:hover {
            transform: translateY(-5px) scale(1.01);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
          }
        `}
        </style>

        {/* NAV - directly visible */}
        <nav
          ref={navRef}
          className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-16 py-2 sm:py-3 opacity-95 backdrop-blur-sm rounded-2xl ml-0 sm:ml-6 md:ml-12 lg:ml-28 mr-0 sm:mr-6 md:mr-12 lg:mr-28 gap-4 sm:gap-8 md:gap-12 lg:gap-20 transition-transform duration-300"
          style={{ 
            backgroundColor: "#D3A378", 
            backdropFilter: "blur(12px)",
            transform: isNavVisible ? "translateY(0)" : "translateY(-150px)"
          }}
        >
          <div className="flex items-center gap-2 group cursor-pointer">
            <LuActivity className="text-[#0a0a0a] text-xl group-hover:scale-110 transition-transform" />
            <span className="text-xl font-black tracking-tight gradient-shimmer">
              PulseWatch
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#0a0a0a]/60 font-medium">
            <a
              href="#features"
              className="hover:text-[#0a0a0a] cursor-pointer transition-all hover:scale-120"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-[#0a0a0a] cursor-pointer transition-all hover:scale-120"
            >
              How it works
            </a>
            <a
              href="#monitoring"
              className="hover:text-[#0a0a0a] cursor-pointer transition-all hover:scale-120"
            >
              Live Demo
            </a>
            <a
              href="#docs"
              className="hover:text-[#0a0a0a] cursor-pointer transition-all hover:scale-120"
            >
              Docs
            </a>
            <a
              href="#blog"
              className="hover:text-[#0a0a0a] cursor-pointer transition-all hover:scale-120"
            >
              Blog
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-xs sm:text-sm font-medium px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#0a0a0a]/20 hover:border-[#0a0a0a]/60 transition-all hover:scale-120"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-xs sm:text-sm font-medium px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#3E2522] text-cream hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="sm:hidden">Sign up</span>
              <span className="hidden sm:inline">Sign up free</span>
            </button>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative pt-20 z-10">
          <div
            ref={heroTagRef}
            className="text-[10px] tracking-[0.2em] uppercase text-[#0a0a0a]/60 mb-8 border border-[#0a0a0a]/15 px-5 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            ✨ Website Monitoring Platform — Live ✨
          </div>

          <h1 className="text-[clamp(2.5rem,11vw,12rem)] font-black leading-none tracking-tighter mb-0 relative">
            {heroLetters.map((letter, index) => (
              <span
                key={index}
                ref={(el) => (heroTitleLettersRef.current[index] = el)}
                className="hero-letter inline-block mx-[-0.01em] gradient-shimmer"
                data-text={letter}
                style={{ display: "inline-block" }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </h1>

          <p
            ref={heroSubRef}
            className="mt-6 text-[clamp(1rem,2vw,1.35rem)] text-[#0a0a0a]/60 max-w-lg leading-relaxed"
          >
            Know the moment your website, API or server breaks —{" "}
            <span className="font-semibold bg-linear-to-r from-[#0a0a0a] to-[#5a5a5a] bg-clip-text text-transparent">
              before your users do.
            </span>
          </p>

          <div
            ref={heroBtnsRef}
            className="mt-10 flex items-center gap-4 flex-wrap justify-center"
          >
            <button
              onClick={() => navigate("/register")}
              className="bg-[#D3A376] text-black px-8 py-3.5 rounded-full text-sm font-medium hover:scale-110 active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-xl group"
            >
              <BsLightningChargeFill className="text-yellow-400 group-hover:rotate-12 transition-transform group-hover:scale-110" />
              Start Monitoring Free
            </button>
            <button className="text-sm font-medium px-8 py-3.5 rounded-full border border-[#0a0a0a]/20 hover:border-[#0a0a0a]/60 transition-all duration-200 hover:bg-[#0a0a0a]/5 hover:scale-105">
              See how it works →
            </button>
          </div>

          <div className="mt-12 flex items-center gap-6 flex-wrap justify-center">
            {[
              "No credit card",
              "3 sites free forever",
              "Setup in 2 min",
              "24/7 Monitoring",
            ].map((t, i) => (
              <div
                key={t}
                className="flex items-center gap-1.5 text-xs text-[#0a0a0a]/80 animate-float"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                <BsStarFill className="text-yellow-500 text-xs" />
                {t}
              </div>
            ))}
          </div>

          <div
            ref={scrollHintRef}
            className="absolute -bottom-16 flex flex-col items-center gap-2 cursor-pointer"
          >
            <span className="text-[10px] tracking-widest uppercase text-[#0a0a0a]/80">
              scroll to explore
            </span>
            <div className="w-6 h-10 border-2 border-[#0a0a0a]/30 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-[#0a0a0a]/50 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </section>

        {/* LIVE MONITORING PREVIEW SECTION */}
        <section id="monitoring" className="py-20 px-6 md:px-20 relative z-10">
          <div ref={livePreviewRef} className="max-w-6xl mx-auto">
            <div className="text-center mb-15">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#0a0a0a]/80 mb-3">
                Live Preview
              </p>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight gradient-shimmer">
                Real-time monitoring dashboard
              </h2>
              <p className="text-[#0a0a0a]/70 text-base max-w-2xl mx-auto mt-4">
                See your website health at a glance with beautiful graphs,
                instant alerts, and detailed analytics.
              </p>
            </div>
            {/* DEMOgraph */}
            <div
              ref={dashboardMockRef}
              className="rounded-3xl bg-linear-to-br from-[#0a0a0a]/5 to-[#0a0a0a]/2 backdrop-blur-sm border border-[#0a0a0a]/25 p-6 shadow-2xl transition-all duration-500 card-3d "
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#0a0a0a]/10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      ref={pulseIndicatorRef}
                      className="absolute w-3 h-3 rounded-full bg-green-500 opacity-75"
                    ></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 relative z-10 animate-pulse"></div>
                  </div>
                  <div
                    ref={statusBadgeRef}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 animate-glow"
                  >
                    <BsCheckCircleFill className="text-green-500 text-xs" />
                    <span className="text-sm font-semibold text-[#0a0a0a]/80">
                      🚀 System Status: All Systems Operational
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0a0a0a]/10 flex items-center justify-center hover:bg-[#0a0a0a]/20 transition-all cursor-pointer hover:scale-110">
                    <BsActivity className="text-sm" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#0a0a0a]/10 flex items-center justify-center hover:bg-[#0a0a0a]/20 transition-all cursor-pointer hover:scale-110">
                    <BsGraphUpArrow className="text-sm" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "📊 Uptime",
                    suffix: "%",
                    ref: uptimeValueRef,
                    color: "text-green-500",
                    change: "+0.02%",
                  },
                  {
                    label: "⚡ Avg Response",
                    suffix: "ms",
                    ref: responseValueRef,
                    color: "text-green-500",
                    change: "-12ms",
                  },
                  {
                    label: "🔄 Total Checks",
                    suffix: "K",
                    ref: checksValueRef,
                    color: "text-blue-500",
                    change: "+2.1K",
                  },
                  {
                    label: "✅ Incidents",
                    suffix: "",
                    ref: incidentValueRef,
                    color: "text-green-500",
                    change: "0 this week",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-cream/50 rounded-xl p-4 border border-[#0a0a0a]/8 hover:border-[#0a0a0a]/20 transition-all hover:scale-105 cursor-pointer"
                  >
                    <p className="text-xs text-[#0a0a0a]/50">{stat.label}</p>
                    <p ref={stat.ref} className="text-2xl font-bold mt-1">
                      0{stat.suffix}
                    </p>
                    <p className={`text-xs ${stat.color} mt-1`}>
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#0a0a0a]/60 flex items-center gap-2">
                    <span className="live-dot w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                    📈 Response Time (Last 24 hours)
                  </span>
                  <span className="text-xs text-[#0a0a0a]/40">ms ↓</span>
                </div>
                <div className="h-52 w-full bg-linear-to-br from-[#0a0a0a]/5 to-[#0a0a0a]/2 rounded-xl p-4 relative overflow-hidden border border-[#0a0a0a]/8">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 800 180"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="graphGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#0a0a0a"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#0a0a0a"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <polyline
                      ref={(el) => el && graphLinesRef.current.push(el)}
                      points="0,160 50,145 100,155 150,120 200,105 250,135 300,95 350,80 400,100 450,75 500,90 550,65 600,80 650,60 700,70 750,55 800,50"
                      fill="none"
                      stroke="#0a0a0a"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="500"
                      strokeDashoffset="500"
                    />
                    <polygon
                      points="0,160 50,145 100,155 150,120 200,105 250,135 300,95 350,80 400,100 450,75 500,90 550,65 600,80 650,60 700,70 750,55 800,50 800,180 0,180"
                      fill="url(#graphGradient)"
                      opacity="0.4"
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-0 w-px h-full bg-linear-to-b from-transparent via-green-500/60 to-transparent animate-scan"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: "PulseWatch.com",
                    type: "HTTP/HTTPS",
                    status: "Operational",
                    latency: "98ms",
                    icon: <HiOutlineStatusOnline className="text-green-500" />,
                  },
                  {
                    name: "API Gateway",
                    type: "REST API",
                    status: "Operational",
                    latency: "142ms",
                    icon: <BsServer className="text-blue-500" />,
                  },
                  {
                    name: "CDN Edge",
                    type: "Global",
                    status: "Operational",
                    latency: "34ms",
                    icon: <FaGlobe className="text-purple-500" />,
                  },
                  {
                    name: "Database Cluster",
                    type: "PostgreSQL",
                    status: "Operational",
                    latency: "56ms",
                    icon: <SiPostgresql className="text-blue-600" />,
                  },
                ].map((service) => (
                  <div
                    key={service.name}
                    ref={(el) => el && serviceItemsRef.current.push(el)}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#0a0a0a]/8 hover:bg-[#0a0a0a]/6 transition-all hover:scale-[1.01] cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute w-2 h-2 rounded-full bg-green-500 opacity-75 animate-ping"></div>
                        <div className="w-5 h-5 relative z-10">
                          {service.icon}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:translate-x-1 transition-transform">
                          {service.name}
                        </p>
                        <p className="text-xs text-[#0a0a0a]/40">
                          {service.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                        ● {service.status}
                      </span>
                      <span className="text-xs text-[#0a0a0a]/50 font-mono">
                        {service.latency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-green-500/10 rounded-xl border border-green-500/20 relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-green-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="flex items-center gap-2 justify-between flex-wrap relative z-10">
                  <div className="flex items-center gap-2">
                    <BsLightningChargeFill className="text-green-500 text-xs animate-pulse" />
                    <span className="text-xs font-medium text-[#0a0a0a]/70">
                      ✨ All systems healthy — No incidents in the last 24 hours
                      ✨
                    </span>
                  </div>
                  <span className="text-[12px] text-[#0a0a0a]/80 font-mono">
                    Last check: <span className="animate-pulse">Just now</span>
                  </span>
                </div>
              </div>

              <div className="mt-2 h-0.5 w-full bg-[#0a0a0a]/10 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-linear-to-r from-green-500 to-emerald-500 rounded-full animate-loading-bar"></div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 py-10 relative z-10">
          <div ref={probHeadRef} className="mb-14">
            <p className="text-[12px] tracking-[0.3em] uppercase text-[#0a0a0a]/80mb-3">
              ⚠️ The Problem
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight max-w-xl">
              You're always the last
              <br />
              to know something broke.
            </h2>
            <p className="mt-4 text-[#0a0a0a]/70text-base max-w-lg leading-relaxed">
              Every minute of downtime costs money, reputation and users. And
              most teams find out from frustrated customers — not their tools.
            </p>
          </div>
          {[
            {
              num: "01",
              icon: <TbWorldCheck className="text-red-400 text-lg" />,
              title: "Your website goes down silently.",
              desc: "Servers crash, APIs fail, SSL expires — users bounce while you're still asleep. No alert. No warning. Just lost revenue.",
            },
            {
              num: "02",
              icon: <TbClockBolt className="text-orange-400 text-lg" />,
              title: "Slow APIs kill conversions.",
              desc: "A 2-second delay costs 7% of conversions. Latency spikes eat revenue silently, every single day — and you don't even know it's happening.",
            },
            {
              num: "03",
              icon: <TbReportAnalytics className="text-blue-400 text-lg" />,
              title: "No visibility. No logs. No clue.",
              desc: "Debugging blind, long after the damage is done. Your infrastructure needs 24/7 eyes — not a post-mortem hours later.",
            },
          ].map((prob, idx) => {
            const refs = [prob1Ref, prob2Ref, prob3Ref];
            return (
              <div
                key={prob.num}
                ref={refs[idx]}
                className="border-t border-[#0a0a0a]/20 py-7 md:flex md:items-start md:gap-16 card-3d"
              >
                <div className="flex items-center gap-4 md:block md:w-28 shrink-0">
                  <span className="text-[clamp(2rem,5vw,4rem)] font-black leading-none text-[#0a0a0a]/15 tabular-nums">
                    {prob.num}
                  </span>
                </div>
                <div className="mt-3 md:mt-1">
                  <div className="flex items-center gap-2 mb-2">
                    {prob.icon}
                    <h3 className="text-[clamp(1.2rem,2.5vw,1.8rem)] font-semibold leading-snug">
                      {prob.title}
                    </h3>
                  </div>
                  <p className="text-[#0a0a0a]/60 text-base leading-relaxed max-w-lg">
                    {prob.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* SOLUTION SECTION */}
        <section
          id="features"
          className="min-h-screen flex flex-col justify-center px-6 md:px-20 py-10 relative z-10"
        >
          <h2
            ref={solHeadRef}
            className="text-[clamp(2rem,5vw,4rem)] font-bold leading-tight max-w-2xl mb-4 gradient-shimmer"
          >
            PulseWatch watches everything —{" "}
            <span className="text-[#0a0a0a]/30">so you don't have to.</span>
          </h2>
          <p className="text-[#0a0a0a]/80 text-base max-w-lg mb-14 leading-relaxed">
            One platform for uptime monitoring, latency tracking, and AI-powered
            incident reports. Built for developers and teams who can't afford
            downtime.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {[
              {
                ref: sol1Ref,
                icon: (
                  <MdNotificationsActive className="text-[#0a0a0a] text-xl" />
                ),
                title: "Real-Time Alerts",
                desc: "Instant notifications the moment your site goes down or slows — via email, Slack, or SMS. Avg alert time under 30 seconds.",
                tag: "Under 30s response",
                tagIcon: (
                  <BsLightningChargeFill className="text-yellow-500 text-xs" />
                ),
              },
              {
                ref: sol2Ref,
                icon: (
                  <MdOutlineDashboardCustomize className="text-[#0a0a0a] text-xl" />
                ),
                title: "Live Dashboards",
                desc: "Uptime graphs, latency charts, and response logs — all in one clean, real-time dashboard. Know your status at a glance.",
                tag: "Real-time metrics",
                tagIcon: <BsGraphUpArrow className="text-blue-500 text-xs" />,
              },
              {
                ref: sol3Ref,
                icon: <RiAiGenerate className="text-[#0a0a0a] text-xl" />,
                title: "AI Incident Summaries",
                desc: "When something breaks, AI tells you exactly what happened, why, and how to fix it — no guesswork, no log-diving.",
                tag: "Powered by AI",
                tagIcon: <MdAutoFixHigh className="text-purple-500 text-xs" />,
              },
            ].map((sol, idx) => (
              <div
                key={idx}
                ref={sol.ref}
                className="rounded-2xl p-8 border border-[#0a0a0a]/12 hover:border-[#0a0a0a]/25 hover:-translate-y-1 transition-all duration-200 group card-3d"
                style={{ backgroundColor: "#FFE0B2" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-[#0a0a0a]/8 group-hover:bg-[#0a0a0a]/20 transition-colors group-hover:scale-110">
                  {sol.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{sol.title}</h3>
                <p className="text-[#0a0a0a]/50 leading-relaxed text-sm mb-4">
                  {sol.desc}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#0a0a0a]/40 font-medium group-hover:gap-2 transition-all">
                  {sol.tagIcon}
                  {sol.tag}
                </div>
              </div>
            ))}
          </div>
          <div
            ref={statsRef}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-[#0a0a0a]/40 pt-12"
          >
            {[
              {
                num: "99.99%",
                label: "Uptime monitored",
                icon: <HiOutlineStatusOnline className="text-green-500" />,
              },
              {
                num: "<30s",
                label: "Alert response time",
                icon: <TbClockBolt className="text-orange-400" />,
              },
              {
                num: "50K+",
                label: "Sites monitored",
                icon: <TbWorldCheck className="text-blue-400" />,
              },
            ].map((s) => (
              <div key={s.label} className="text-center card-3d p-4 rounded-xl">
                <div className="flex justify-center mb-2 text-2xl">
                  {s.icon}
                </div>
                <p className="text-[clamp(1.5rem,4vw,3rem)] font-black tracking-tight gradient-shimmer">
                  {s.num}
                </p>
                <p className="text-[#0a0a0a]/60 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div ref={featuresRef} className="mt-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#0a0a0a]/80 mb-6">
              ✨ Everything included ✨
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon: <TbWorldCheck />, text: "HTTP / HTTPS monitoring" },
                { icon: <TbClockBolt />, text: "30-sec check intervals" },
                {
                  icon: <MdNotificationsActive />,
                  text: "Email, Slack & SMS alerts",
                },
                { icon: <BsGraphUpArrow />, text: "Latency & uptime history" },
                { icon: <RiAiGenerate />, text: "AI incident summaries" },
                {
                  icon: <MdOutlineDashboardCustomize />,
                  text: "Custom dashboards",
                },
                { icon: <BsShieldCheck />, text: "SSL cert expiry alerts" },
                { icon: <TbReportAnalytics />, text: "Weekly reports" },
                { icon: <MdAutoFixHigh />, text: "Root cause analysis" },
              ].map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#0a0a0a]/10 text-sm text-[#0a0a0a]/65 hover:border-[#0a0a0a]/25 hover:text-[#0a0a0a] transition-all duration-150 hover:scale-105 hover:bg-[#0a0a0a]/5"
                >
                  <span className="text-base text-[#0a0a0a]/50 transition-transform group-hover:scale-110">
                    {f.icon}
                  </span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="min-h-screen flex flex-col justify-center px-6 md:px-20 py-10 bg-[#F2F1ED]/30 relative z-10"
        >
          <div ref={howItWorksRef} className="text-center mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#0a0a0a]/60 mb-3">
              🚀 Simple Setup
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight gradient-shimmer">
              Get started in minutes
            </h2>
            <p className="text-[#0a0a0a]/60 text-base max-w-md mx-auto mt-4">
              No complex configuration. Just add your endpoints and we'll handle
              the rest.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                ref: step1Ref,
                icon: <FaRocket className="text-3xl text-[#0a0a0a]/70" />,
                num: "01",
                title: "Add your URLs",
                desc: "Enter your website, API endpoints, or server IPs in one click.",
              },
              {
                ref: step2Ref,
                icon: (
                  <MdNotificationsActive className="text-3xl text-[#0a0a0a]/70" />
                ),
                num: "02",
                title: "Set alert channels",
                desc: "Connect Slack, Email, SMS — get notified wherever you work.",
              },
              {
                ref: step3Ref,
                icon: <BsGraphUpArrow className="text-3xl text-[#0a0a0a]/70" />,
                num: "03",
                title: "Monitor & optimize",
                desc: "Watch real-time metrics and let AI analyze incidents.",
              },
            ].map((step) => (
              <div
                key={step.num}
                ref={step.ref}
                className="text-center p-6 rounded-2xl border border-[#0a0a0a]/10 bg-[#FFE0B2] transform-gpu hover:scale-105 transition-all duration-200 card-3d"
              >
                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#0a0a0a]/10 to-[#0a0a0a]/5 flex items-center justify-center mx-auto mb-5 animate-float">
                  {step.icon}
                </div>
                <div className="text-5xl font-black text-[#0a0a0a]/90 mb-2">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-[#0a0a0a]/80 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST BADGES
        <section className="py-20 px-6 relative z-10">
          <div ref={trustBadgesRef} className="max-w-5xl mx-auto text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#0a0a0a]/35 mb-6">
              💎 Trusted by teams worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 gap-y-8">
              {[
                "Vercel",
                "Netlify",
                "Supabase",
                "Railway",
                "Cloudflare",
                "AWS",
              ].map((brand) => (
                <div
                  key={brand}
                  className="text-[#0a0a0a]/30 font-black text-xl tracking-wide hover:text-[#0a0a0a]/60 transition-all hover:scale-105 cursor-pointer"
                >
                  {brand}
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                <FaUsers className="text-[#0a0a0a]/40 text-lg" />
                <span className="text-sm text-[#0a0a0a]/50">
                  100,000+ active users
                </span>
              </div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                <FaServer className="text-[#0a0a0a]/40 text-lg" />
                <span className="text-sm text-[#0a0a0a]/50">
                  99.999% uptime SLA
                </span>
              </div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                <FaGlobe className="text-[#0a0a0a]/40 text-lg" />
                <span className="text-sm text-[#0a0a0a]/50">
                  25+ global monitoring nodes
                </span>
              </div>
            </div>
          </div>
        </section> */}

        {/* GLOBAL REACH */}
        <section className="py-20 px-6 border-t border-[#0a0a0a]/8 relative z-10">
          <div
            ref={globalReachRef}
            className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 text-center md:text-left">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#0a0a0a]/80 mb-3">
                🌍 Global Coverage
              </p>
              <h2 className="text-[clamp(1.8rem,3vw,2.8rem)] font-bold leading-tight mb-4 gradient-shimmer">
                Monitoring from 6 continents
              </h2>
              <p className="text-[#0a0a0a]/50 leading-relaxed mb-6">
                Our distributed network checks your services from multiple
                locations worldwide, giving you real insights into global
                performance and latency.
              </p>
              <div className="flex gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <span className="font-black text-3xl gradient-shimmer">
                    25+
                  </span>
                  <p className="text-xs text-[#0a0a0a]/40">Check locations</p>
                </div>
                <div className="text-center">
                  <span className="font-black text-3xl gradient-shimmer">
                    99.999%
                  </span>
                  <p className="text-xs text-[#0a0a0a]/40">Monitoring uptime</p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-80 h-80 rounded-full bg-linear-to-br from-[#0a0a0a]/5 to-[#0a0a0a]/2 flex items-center justify-center relative">
                <div className="absolute w-40 h-40 rounded-full bg-[#0a0a0a]/15 animate-ping"></div>
                <div className="absolute w-32 h-32 rounded-full bg-[#0a0a0a]/20 animate-pulse"></div>
                <FaGlobe className="text-7xl text-[#0a0a0a]/80 animate-spin-slow" />
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 px-6 md:px-16 border-t border-[#0a0a0a]/10 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <HiOutlineStatusOnline className="text-[#0a0a0a] text-lg group-hover:scale-110 transition-transform" />
              <span className="text-lg font-black tracking-tight gradient-shimmer">
                PulseWatch
              </span>
            </div>
            <div className="text-[#0a0a0a]/80 text-xs">
              © {new Date().getFullYear()} PulseWatch Monitoring. Made with ⚡
              for developers.
            </div>
            <div className="flex items-center gap-6 text-sm text-[#0a0a0a]/70 font-medium">
              <a
                href="#terms"
                className="hover:text-[#0a0a0a] transition-all hover:scale-105"
              >
                Terms
              </a>
              <a
                href="#privacy"
                className="hover:text-[#0a0a0a] transition-all hover:scale-105"
              >
                Privacy
              </a>
              <a
                href="#twitter"
                className="hover:text-[#0a0a0a] transition-all hover:scale-105"
              >
                <BsTwitter />
              </a>
              <a
                href="#github"
                className="hover:text-[#0a0a0a] transition-all hover:scale-105"
              >
                <BsGithub />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
