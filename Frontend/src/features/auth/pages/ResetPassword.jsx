import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Lock, ChevronRight, Eye, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import authChar from '../../../assets/auth-char-2.png';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef(null);
  const blobRef = useRef(null);
  const navigate = useNavigate();
  const { resetPassword, loading, error, resetAuth } = useAuth();

  useEffect(() => {
    if (error) {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error(error);
        resetAuth();
      });
    }
  }, [error, resetAuth]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(blobRef.current, {
        scale: 1.05,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      gsap.from(containerRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 1.5,
        ease: "power4.out"
      });

      gsap.from(".animate-item", {
        opacity: 0,
        x: -30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error("Passwords do not match!");
      });
      return;
    }
    const success = await resetPassword(password);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="h-screen w-full bg-cream flex items-center justify-center relative overflow-hidden font-['Inter',sans-serif]">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div ref={containerRef} className="w-full h-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Side: Visual Focus */}
        <div className="hidden md:flex flex-col items-center justify-center relative bg-linear-to-b from-dark to-deep m-2 rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(#DFB6B2 1px, transparent 1px)`, backgroundSize: '32px 32px' }}></div>
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-10">
            <div ref={blobRef} className="relative w-full max-w-[380px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
              <img src={authChar} alt="Auth Character" className="w-full h-auto object-contain scale-110" />
            </div>
            <div className="text-center mt-12 space-y-3 animate-item">
              <h2 className="text-4xl font-bold text-cream tracking-tight">Almost Done</h2>
              <p className="text-rose max-w-[320px] mx-auto text-sm leading-relaxed font-medium">
                Create a strong password to secure your Upzy account.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col justify-center p-6 md:p-12 lg:p-20 space-y-8 overflow-y-auto">
          <div className="space-y-2 animate-item max-w-md w-full mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-dark tracking-tight">New Password</h1>
            <p className="text-accent/80 font-medium text-base">Enter your new secure password</p>
          </div>

          <form className="space-y-7 max-w-md w-full mx-auto mt-6" onSubmit={handleSubmit}>
            <div className="animate-item relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-accent z-20">
                <Lock size={18} />
              </div>
              <input 
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                className="peer w-full bg-white/40 border border-rose text-dark rounded-full py-3.5 pl-14 pr-12 outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all font-medium shadow-sm"
              />
              <label 
                htmlFor="password"
                className="absolute left-14 top-1/2 -translate-y-1/2 px-2 bg-transparent text-accent font-medium pointer-events-none transition-all duration-200 z-10
                           peer-focus:-top-2.5 peer-focus:left-6 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-secondary peer-focus:bg-cream peer-focus:uppercase peer-focus:tracking-widest
                           peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-secondary peer-[:not(:placeholder-shown)]:bg-cream peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest"
              >
                New Password
              </label>
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-accent hover:text-primary transition-colors z-20"
              >
                <Eye size={18} />
              </button>
            </div>

            <div className="animate-item relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-accent z-20">
                <ShieldCheck size={18} />
              </div>
              <input 
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
                required
                className="peer w-full bg-white/40 border border-rose text-dark rounded-full py-3.5 pl-14 pr-4 outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all font-medium shadow-sm"
              />
              <label 
                htmlFor="confirmPassword"
                className="absolute left-14 top-1/2 -translate-y-1/2 px-2 bg-transparent text-accent font-medium pointer-events-none transition-all duration-200 z-10
                           peer-focus:-top-2.5 peer-focus:left-6 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-secondary peer-focus:bg-cream peer-focus:uppercase peer-focus:tracking-widest
                           peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-secondary peer-[:not(:placeholder-shown)]:bg-cream peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest"
              >
                Confirm Password
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-black text-cream font-bold py-4 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? 'Updating...' : 'Reset Password'}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
