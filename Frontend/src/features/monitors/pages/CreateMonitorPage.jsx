import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../dashboard/components/DashboardLayout";
import { useMonitor } from "../hooks/useMonitor";
import {
  Globe,
  ArrowLeft,
  Zap,
  CheckCircle2,
  Loader,
  AlertCircle,
} from "lucide-react";
import gsap from "gsap";
import toast from "react-hot-toast";

const CreateMonitorPage = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const { createMonitor, loading } = useMonitor();

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    method: "GET",
    interval: 30,
    expectedStatus: 200,
    timeout: 5000,
    headers: "",
    body: "",
    alertEmail: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".form-animate", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".icon-animate", {
        scale: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        delay: 0.2,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Monitor name is required";
    }

    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else if (!/^https?:\/\//.test(formData.url)) {
      newErrors.url = "URL must start with http:// or https://";
    }

    if (
      formData.alertEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.alertEmail)
    ) {
      newErrors.alertEmail = "Please enter a valid email address";
    }

    if (formData.interval < 5 || formData.interval > 3600) {
      newErrors.interval = "Interval must be between 5 and 3600 seconds";
    }

    if (formData.headers) {
      try {
        JSON.parse(formData.headers);
      } catch {
        newErrors.headers = "Headers must be a valid JSON string";
      }
    }

    if (formData.method === "POST" && formData.body) {
      try {
        JSON.parse(formData.body);
      } catch {
        newErrors.body = "Body must be a valid JSON string";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "interval" || name === "expectedStatus" || name === "timeout"
          ? parseInt(value)
          : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    try {
      await createMonitor({
        name: formData.name,
        url: formData.url,
        method: formData.method,
        interval: formData.interval,
        expectedStatus: formData.expectedStatus,
        timeout: formData.timeout,
        headers: formData.headers ? JSON.parse(formData.headers) : undefined,
        body:
          formData.method === "POST" && formData.body
            ? JSON.parse(formData.body)
            : undefined,
        alertEmail: formData.alertEmail || undefined,
      });
      navigate("/dashboard/monitors");
    } catch {
      toast.error("Failed to create monitor");
    }
  };

  const intervals = [
    { value: 15, label: "15s", description: "Very fast" },
    { value: 30, label: "30s", description: "Fast" },
    { value: 60, label: "1m", description: "Standard" },
    { value: 300, label: "5m", description: "Economical" },
  ];

  return (
    <DashboardLayout pageRef={pageRef}>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8">
          {/* Back Link */}
          <button
            onClick={() => navigate("/dashboard/monitors")}
            className="flex items-center gap-2 text-accent hover:text-primary transition-colors font-medium text-sm w-fit form-animate"
          >
            <ArrowLeft size={16} />
            Back to monitors
          </button>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#522B5B] to-[#854F6C] flex items-center justify-center text-cream shadow-xl shadow-[#522B5B]/20 icon-animate">
              <Globe size={32} />
            </div>
            <div className="space-y-1 form-animate">
              <h1 className="text-3xl font-bold text-dark tracking-tight">
                Add a new monitor
              </h1>
              <p className="text-accent/60 font-medium">
                We'll start checking your endpoint within seconds.
              </p>
            </div>
          </div>

          {/* Form Container */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/60 backdrop-blur-xl border border-rose/40 rounded-[2.5rem] p-10 shadow-2xl shadow-[#522B5B]/5 space-y-8 form-animate"
          >
            {/* Monitor Name */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-dark uppercase tracking-wider ml-1">
                Monitor Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., My API Server"
                className={`w-full bg-cream/30 border rounded-2xl py-4 px-6 text-dark focus:outline-none focus:ring-4 transition-all placeholder:text-accent/20 font-medium ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500/10"
                    : "border-rose/50 focus:border-[#522B5B]/50 focus:ring-[#522B5B]/5"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* URL Input */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-dark uppercase tracking-wider ml-1">
                Website / API URL
              </label>
              <p className="text-xs text-accent/60 font-medium ml-1">
                Include https://. We'll send an HTTP request.
              </p>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://api.your-app.com/health"
                className={`w-full bg-cream/30 border rounded-2xl py-4 px-6 text-dark focus:outline-none focus:ring-4 transition-all placeholder:text-accent/20 font-medium ${
                  errors.url
                    ? "border-red-500 focus:ring-red-500/10"
                    : "border-rose/50 focus:border-[#522B5B]/50 focus:ring-[#522B5B]/5"
                }`}
              />
              {errors.url && (
                <p className="text-red-500 text-sm font-medium">{errors.url}</p>
              )}
            </div>
            {/* Alert Email */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-dark uppercase tracking-wider ml-1">
                Alert Email{" "}
                <span className="text-accent/40 font-normal normal-case">
                  (optional)
                </span>
              </label>
              <p className="text-xs text-accent/60 font-medium ml-1">
                Where to send alerts for this monitor. Defaults to your account
                email.
              </p>
              <input
                type="email"
                name="alertEmail"
                value={formData.alertEmail}
                onChange={handleChange}
                placeholder="alerts@yourteam.com"
                className={`w-full bg-cream/30 border rounded-2xl py-4 px-6 text-dark focus:outline-none focus:ring-4 transition-all placeholder:text-accent/20 font-medium ${
                  errors.alertEmail
                    ? "border-red-500 focus:ring-red-500/10"
                    : "border-rose/50 focus:border-[#522B5B]/50 focus:ring-[#522B5B]/5"
                }`}
              />
              {errors.alertEmail && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.alertEmail}
                </p>
              )}
            </div>
            {/* Method & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-dark uppercase tracking-wider ml-1">
                  HTTP Method
                </label>
                <select
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  className="w-full bg-cream/30 border border-rose/50 rounded-2xl py-4 px-6 text-dark focus:outline-none focus:border-[#522B5B]/50 focus:ring-4 focus:ring-[#522B5B]/5 transition-all font-medium"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-bold text-dark uppercase tracking-wider ml-1">
                  Expected Status
                </label>
                <input
                  type="number"
                  name="expectedStatus"
                  value={formData.expectedStatus}
                  onChange={handleChange}
                  min="100"
                  max="599"
                  className="w-full bg-cream/30 border border-rose/50 rounded-2xl py-4 px-6 text-dark focus:outline-none focus:border-[#522B5B]/50 focus:ring-4 focus:ring-[#522B5B]/5 transition-all font-medium"
                />
              </div>
            </div>

            {/* Headers Input */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-dark uppercase tracking-wider ml-1">
                Custom Headers (JSON)
              </label>
              <textarea
                name="headers"
                value={formData.headers}
                onChange={handleChange}
                placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                rows={3}
                className={`w-full bg-cream/30 border rounded-2xl py-4 px-6 text-dark focus:outline-none focus:ring-4 transition-all placeholder:text-accent/20 font-medium font-mono text-sm ${
                  errors.headers
                    ? "border-red-500 focus:ring-red-500/10"
                    : "border-rose/50 focus:border-[#522B5B]/50 focus:ring-[#522B5B]/5"
                }`}
              />
              {errors.headers && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.headers}
                </p>
              )}
            </div>

            {/* Body Input (Only for POST) */}
            {formData.method === "POST" && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-dark uppercase tracking-wider ml-1">
                  Request Body (JSON)
                </label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  placeholder='{"key": "value"}'
                  rows={4}
                  className={`w-full bg-cream/30 border rounded-2xl py-4 px-6 text-dark focus:outline-none focus:ring-4 transition-all placeholder:text-accent/20 font-medium font-mono text-sm ${
                    errors.body
                      ? "border-red-500 focus:ring-red-500/10"
                      : "border-rose/50 focus:border-[#522B5B]/50 focus:ring-[#522B5B]/5"
                  }`}
                />
                {errors.body && (
                  <p className="text-red-500 text-sm font-medium">
                    {errors.body}
                  </p>
                )}
              </div>
            )}

            {/* Interval Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-dark uppercase tracking-wider ml-1">
                Monitoring Interval
              </label>
              <p className="text-xs text-accent/60 font-medium ml-1">
                How often we should check your endpoint.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {intervals.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, interval: item.value }))
                    }
                    className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                      formData.interval === item.value
                        ? "bg-[#522B5B] text-white border-[#522B5B] shadow-lg shadow-[#522B5B]/20"
                        : "bg-white/50 border-rose/50 text-accent hover:border-[#522B5B]/30 hover:bg-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-accent/50 uppercase">
                  Seconds
                </span>
                <input
                  type="number"
                  name="interval"
                  value={formData.interval}
                  onChange={handleChange}
                  min="5"
                  max="3600"
                  placeholder="Custom interval (e.g., 45)"
                  className={`w-full bg-cream/30 border rounded-2xl py-3 pl-6 pr-20 text-dark focus:outline-none focus:ring-4 transition-all placeholder:text-accent/30 font-medium ${
                    errors.interval
                      ? "border-red-500 focus:ring-red-500/10"
                      : "border-rose/50 focus:border-[#522B5B]/50 focus:ring-[#522B5B]/5"
                  }`}
                />
              </div>
              {errors.interval && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.interval}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-[#522B5B]/5 to-[#854F6C]/5 border border-[#522B5B]/10 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#522B5B] shadow-sm">
                <Zap size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-dark font-medium leading-relaxed">
                  PulseWatch will monitor your endpoint from{" "}
                  <span className="font-bold text-[#522B5B]">
                    multiple regions
                  </span>{" "}
                  and use AI to analyze any incidents automatically.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-[#522B5B] to-[#854F6C] text-cream font-bold rounded-2xl hover:shadow-[0_10px_30px_-5px_rgba(82,43,91,0.3)] transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    Start Monitoring
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/monitors")}
                disabled={loading}
                className="px-8 py-4 bg-white/50 border border-rose/50 text-dark font-bold rounded-2xl hover:bg-white transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateMonitorPage;
