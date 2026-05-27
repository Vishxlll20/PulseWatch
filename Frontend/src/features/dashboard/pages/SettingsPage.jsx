import React, { useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  ChevronRight,
  LogOut,
  Mail,
  Smartphone,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const {
    user,
    forgotPassword,
    verifyOtp,
    resetPassword,
    loading,
    logoutUser,
  } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("MAIN");
  const [email, setEmail] = useState(user?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const pageRef = useRef(null);

  const handleLogoutAllDevices = async () => {
    await logoutUser();
    navigate("/login");
  };

  const handleStartReset = async () => {
    const success = await forgotPassword(email);
    if (success) setActiveView("CHANGE_PASSWORD_OTP");
  };

  const handleVerifyOtp = async () => {
    const success = await verifyOtp(otp);
    if (success) setActiveView("CHANGE_PASSWORD_RESET");
  };

  const handleResetPassword = async () => {
    const success = await resetPassword(newPassword);
    if (success) setActiveView("MAIN");
  };

  const sections = [
    {
      title: "Security",
      icon: Shield,
      items: [
        {
          label: "Change Password",
          desc: "Securely update your account password via OTP",
          action: () => setActiveView("CHANGE_PASSWORD_EMAIL"),
          icon: Lock,
        },
        {
          label: "Two-Factor Authentication",
          desc: "Add an extra layer of security",
          action: () => {},
          icon: Smartphone,
        },
      ],
    },
  ];

  return (
    <DashboardLayout pageRef={pageRef}>
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {activeView === "MAIN" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-10 sm:space-y-12"
            >
              <header className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
                  Settings
                </h1>
                <p className="text-accent font-semibold opacity-70 text-sm">
                  Manage your account preferences and security configurations.
                </p>
              </header>

              <div className="space-y-8 sm:space-y-10">
                {sections.map((section, idx) => (
                  <section key={idx} className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-10 h-10 rounded-xl bg-white border border-rose/30 flex items-center justify-center text-primary shadow-sm">
                        <section.icon size={22} />
                      </div>
                      <h2 className="text-xl font-bold text-dark">
                        {section.title}
                      </h2>
                    </div>

                    <div className="grid gap-3 sm:gap-4">
                      {section.items.map((item, i) => (
                        <button
                          key={i}
                          onClick={item.action}
                          className="flex items-center justify-between p-5 sm:p-6 bg-white border border-rose/20 rounded-2xl sm:rounded-3xl hover:shadow-xl hover:border-primary/20 transition-all duration-300 group w-full text-left"
                        >
                          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cream flex items-center justify-center text-accent group-hover:bg-primary group-hover:text-cream transition-colors flex-shrink-0">
                              <item.icon size={20} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-dark group-hover:text-primary transition-colors text-sm sm:text-base">
                                {item.label}
                              </h3>
                              <p className="text-xs text-accent font-medium opacity-60 truncate">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            size={18}
                            className="text-rose group-hover:translate-x-1 transition-transform flex-shrink-0"
                          />
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </motion.div>
          )}

          {activeView.startsWith("CHANGE_PASSWORD") && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto space-y-8 py-6 sm:py-10"
            >
              <button
                onClick={() => setActiveView("MAIN")}
                className="flex items-center gap-2 text-sm font-bold text-accent hover:text-primary transition-all group"
              >
                <ArrowLeft
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform"
                />{" "}
                Back to Settings
              </button>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-dark">
                  {activeView === "CHANGE_PASSWORD_EMAIL" && "Change Password"}
                  {activeView === "CHANGE_PASSWORD_OTP" && "Verify OTP"}
                  {activeView === "CHANGE_PASSWORD_RESET" && "Set New Password"}
                </h2>
                <p className="text-accent font-medium text-sm">
                  {activeView === "CHANGE_PASSWORD_EMAIL" &&
                    "We will send a code to your email to verify it's you."}
                  {activeView === "CHANGE_PASSWORD_OTP" &&
                    `Enter the 6-digit code sent to ${email}`}
                  {activeView === "CHANGE_PASSWORD_RESET" &&
                    "Create a new secure password for your account."}
                </p>
              </div>

              <div className="space-y-6">
                {activeView === "CHANGE_PASSWORD_EMAIL" && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-accent"
                        size={20}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-rose/30 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-medium"
                        placeholder="Email Address"
                      />
                    </div>
                    <button
                      onClick={handleStartReset}
                      disabled={loading}
                      className="w-full bg-primary text-cream font-bold py-4 rounded-2xl shadow-lg hover:bg-dark transition-all disabled:opacity-70"
                    >
                      {loading ? "Sending..." : "Send Verification Code"}
                    </button>
                  </div>
                )}

                {activeView === "CHANGE_PASSWORD_OTP" && (
                  <div className="space-y-4">
                    <div className="relative">
                      <ShieldCheck
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-accent"
                        size={20}
                      />
                      <input
                        type="text"
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-white border border-rose/30 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold tracking-[0.5em] text-center"
                        placeholder="000000"
                      />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="w-full bg-primary text-cream font-bold py-4 rounded-2xl shadow-lg hover:bg-dark transition-all disabled:opacity-70"
                    >
                      {loading ? "Verifying..." : "Verify Code"}
                    </button>
                  </div>
                )}

                {activeView === "CHANGE_PASSWORD_RESET" && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-accent"
                        size={20}
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white border border-rose/30 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-medium"
                        placeholder="New Password"
                      />
                    </div>
                    <button
                      onClick={handleResetPassword}
                      disabled={loading}
                      className="w-full bg-primary text-cream font-bold py-4 rounded-2xl shadow-lg hover:bg-dark transition-all disabled:opacity-70"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeView === "MAIN" && (
          <div className="mt-10 pt-8 sm:pt-10 border-t border-rose/20">
            <button
              onClick={handleLogoutAllDevices}
              className="flex items-center gap-3 text-red-500 font-bold hover:scale-105 transition-transform text-sm"
            >
              <LogOut size={18} />
              Sign Out from All Devices
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
