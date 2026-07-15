import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, KeyRound, Users2, Lock as LockIcon } from "lucide-react";

export const Login = () => {
  const { login, error: authError } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      enqueueSnackbar("Please fill in all fields", { variant: "warning" });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await login(email, password);
      enqueueSnackbar("Welcome back!", { variant: "success" });
      // If admin, navigate to admin dashboard, else normal dashboard
      if (user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
      enqueueSnackbar(err.message || "Invalid credentials", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex min-h-screen bg-sand-50">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-forest-950 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-moss-500/10 blur-[90px]" />
        <div className="absolute -bottom-32 -left-10 h-[320px] w-[320px] rounded-full bg-moss-400/10 blur-[90px]" />

        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-moss-500">
            <ShieldCheck className="h-5 w-5 text-forest-950" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-extrabold">Access Console</span>
        </div>

        <div className="relative max-w-md space-y-8">
          <h1 className="font-display text-4xl font-extrabold leading-tight">
            Role-based access, mapped clearly.
          </h1>
          <p className="text-sm leading-relaxed text-forest-300">
            Manage users, roles, and permissions from a single console built for
            microservice teams that need precise, auditable control.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-moss-500/15 text-moss-300">
                <Users2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Centralized user directory</p>
                <p className="text-[11px] text-forest-400">Create, review, and remove profiles</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-moss-500/15 text-moss-300">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Granular permission mapping</p>
                <p className="text-[11px] text-forest-400">Assign exact scopes to every role</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-moss-500/15 text-moss-300">
                <LockIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Enforced at every route</p>
                <p className="text-[11px] text-forest-400">Protected pages honor role scopes</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-[11px] text-forest-500">© {new Date().getFullYear()}  All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile brand header */}
          <div className="flex flex-col items-center text-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-950 shadow-soft">
              <ShieldCheck className="h-6 w-6 text-moss-400" />
            </div>
            <h2 className="font-display mt-4 text-2xl font-extrabold text-forest-950">Aegis Access Console</h2>
          </div>

          <div className="hidden lg:block">
            <h2 className="font-display text-2xl font-extrabold text-forest-950">Sign in</h2>
            <p className="mt-1 text-sm text-forest-500">Enter your credentials to access your workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {(error || authError) && (
              <div className="rounded-xl border border-ember-500/30 bg-ember-100 p-3.5 text-xs font-semibold text-ember-500">
                {error || authError}
              </div>
            )}

            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-forest-600">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="h-11 w-full rounded-xl border border-sand-200 bg-white pl-10 pr-4 text-sm text-forest-900 placeholder-forest-400 outline-none transition-colors focus:border-moss-400"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-forest-600">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-sand-200 bg-white pl-10 pr-4 text-sm text-forest-900 placeholder-forest-400 outline-none transition-colors focus:border-moss-400"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="relative flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-forest-950 text-sm font-bold text-white shadow-soft transition-colors hover:bg-forest-800 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Log In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sand-200"></div>
            </div>
            <span className="relative bg-sand-50 px-3 text-[10px] font-bold uppercase tracking-widest text-forest-400">
              Demo Credentials
            </span>
          </div>

    
        </div>
      </div>
    </div>
  );
};

export default Login;
