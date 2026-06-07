import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  ChevronRight,
  Loader2,
} from "lucide-react";
import authChar from "../../../assets/auth-char-2.png";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const containerRef = useRef(null);
  const blobRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, user, error, resetAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role) {
      if (user.role === "admin") {
        navigate("/admin/monitors");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      import("react-hot-toast").then(({ default: toast }) => {
        toast.error(error);
        resetAuth();
      });
    }
  }, [error, resetAuth]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Blob floating animation
      gsap.to(blobRef.current, {
        y: -20,
        rotation: 5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Entry animations
      gsap.from(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(".animate-item", {
        opacity: 0,
        x: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.4,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="h-screen w-full bg-cream flex items-center justify-center relative overflow-hidden font-['Inter',sans-serif]">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container: Full Width */}
      <div
        ref={containerRef}
        className="w-full h-full grid grid-cols-1 md:grid-cols-2 overflow-hidden"
      >
        {/* Left Side: Visual Focus - Graphical Part */}
        <div className="hidden md:flex flex-col items-center justify-center relative bg-[#3E2522]  m-2 rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#DFB6B2 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          ></div>

          <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-10 py-16">
            <div className="flex-1 flex items-center justify-center w-full max-w-[300px]">
              <div
                ref={blobRef}
                className="relative w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
              >
                <img
                  src={authChar}
                  alt="Auth Character"
                  className="w-full h-auto object-contain scale-110"
                />
              </div>
            </div>

            <div className="text-center space-y-3 animate-item">
              <h2 className="text-4xl lg:text-5xl font-bold text-cream tracking-tight">
                PulseWatch Intelligence
              </h2>
              <p className="text-rose max-w-[380px] mx-auto text-sm lg:text-base leading-relaxed font-medium">
                Unlock the power of seamless monitoring and data-driven
                insights.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form - No Background */}
        <div className="flex flex-col justify-center p-6 md:p-12 lg:p-20 space-y-8 overflow-y-auto hide-scrollbar shadow-black">
          <div className="space-y-2 animate-item max-w-md w-full mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 mr-5 text-sm font-medium text-accent hover:text-primary transition-all"
            >
              <span className="text-xl leading-none">←</span>
              Home page
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/5 border border-secondary/10 mb-1">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
                Welcome Back
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-dark tracking-tight">
              Login
            </h1>
            <p className="text-accent/80 font-medium text-base">
              Please enter your details to continue
            </p>
          </div>

          <form
            className="space-y-3 max-w-md w-full mx-auto mt-6"
            onSubmit={handleSubmit}
          >
            <div className="animate-item relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-accent z-20">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="peer w-full bg-white/40 border border-rose text-dark rounded-full py-3.5 pl-14 pr-4 outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all font-medium shadow-sm"
              />
              <label
                htmlFor="email"
                className="absolute left-14 top-1/2 -translate-y-1/2 px-2 bg-transparent text-accent font-medium pointer-events-none transition-all duration-200 z-10
                           peer-focus:-top-2.5 peer-focus:left-6 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-secondary peer-focus:bg-cream peer-focus:uppercase peer-focus:tracking-widest
                           peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-secondary peer-[:not(:placeholder-shown)]:bg-cream peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest"
              >
                Email Address
              </label>
            </div>

            <div className="animate-item relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-accent z-20">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="peer w-full bg-white/40 border border-rose text-dark rounded-full py-3.5 pl-14 pr-12 outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all font-medium shadow-sm"
              />
              <label
                htmlFor="password"
                className="absolute left-14 top-1/2 -translate-y-1/2 px-2 bg-transparent text-accent font-medium pointer-events-none transition-all duration-200 z-10
                           peer-focus:-top-2.5 peer-focus:left-6 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-secondary peer-focus:bg-cream peer-focus:uppercase peer-focus:tracking-widest
                           peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-secondary peer-[:not(:placeholder-shown)]:bg-cream peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-accent hover:text-primary transition-colors z-20"
              >
                <Eye size={18} />
              </button>
            </div>

            <div className="flex justify-end animate-item -mt-2">
              <Link
                to="/forgot-password"
                name="forgot-password-link"
                className="text-xs font-bold text-accent hover:text-primary transition-all hover:underline underline-offset-4 decoration-2"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-black text-cream font-bold py-4 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group overflow-hidden relative disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ChevronRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="space-y-6 animate-item max-w-md w-full mx-auto">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-rose"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                <span className="bg-cream px-4 text-accent">
                  Secure Gateway
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)
              }
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-cream/50 border border-rose text-dark py-3.5 rounded-full transition-all shadow-sm group font-bold text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
                className="group-hover:scale-110 transition-transform"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 35.741 44 30.988 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)
              }
              className="w-full flex items-center ..."
            ></button>

            <p className="text-center text-accent text-sm font-medium">
              New to PulseWatch?{" "}
              <Link
                to="/register"
                className="text-primary font-bold hover:underline transition-all"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
