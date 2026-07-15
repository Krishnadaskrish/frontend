import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  LayoutGrid,
  Users,
  Lock,
  LifeBuoy,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";

const NavItem = ({ icon: Icon, label, active, onClick, badge, disabled }) => (
  <button
    onClick={disabled ? undefined : onClick}
    className={[
      "group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors cursor-pointer",
      active
        ? "bg-moss-500/15 text-moss-300"
        : disabled
          ? "text-white cursor-not-allowed"
          : "text-white hover:bg-white/5 hover:text-white",
    ].join(" ")}
  >
    <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${active ? "text-moss-400" : ""}`} />
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className="rounded-full bg-moss-500/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-moss-300">
        {badge}
      </span>
    )}
  </button>
);

export const Layout = ({ children, pageTitle, pageSubtitle, headerAction }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();

  const SidebarContent = (
    <div className="flex h-full flex-col bg-forest-500">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-moss-500 shadow-soft">
          <ShieldCheck className="h-5 w-5 text-forest-950" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-display text-[15px] font-extrabold leading-none text-white">Access Console</p>
          {/* <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white">
            Access Console
          </p> */}
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto rounded-lg p-1 text-forest-400 hover:text-white lg:hidden cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Workspace pill (visual, matches reference layout) */}
      <div className="mx-4 mb-5 flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-moss-500/20 text-[10px] font-extrabold text-white">
          {user.role === "Admin" ? "A" : "U"}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold text-white">
            {user.role === "Admin" ? "Admin Workspace" : "Member Workspace"}
          </p>
          <p className="truncate text-[10px] text-white">{user.email}</p>
        </div>
      </div>

      {/* Search (visual) */}
      {/* <div className="mx-4 mb-6 flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-white">
        <Search className="h-3.5 w-3.5" />
        <span className="text-xs">Search...</span>
        <span className="ml-auto text-[10px] font-bold text-white">⌘K</span>
      </div> */}

      {/* Navigation */}
      <div className="flex-1 space-y-6 overflow-y-auto px-4">
        <div>
          {/* <p className="mb-2 px-3.5 text-[10px] font-extrabold uppercase tracking-widest text-white">
            Navigation
          </p> */}
          <div className="space-y-1">
            <NavItem
              icon={LayoutGrid}
              label="Dashboard"
              active={location.pathname === "/dashboard"}
              onClick={() => navigate("/dashboard")}
            />
            {user.permissions.includes("users:read") && (
              <NavItem
                icon={Users}
                label="Users"
                active={location.pathname === "/users"}
                onClick={() => navigate("/users")}
              />
            )}
            {(user.permissions.includes("roles:read") || user.permissions.includes("roles:assign")) && (
              <NavItem
                icon={Lock}
                label="Roles & Access"
                active={location.pathname === "/admin"}
                onClick={() => navigate("/admin")}
              />
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 px-3.5 text-[10px] font-extrabold uppercase tracking-widest text-forest-500">
            Workspace
          </p>
          {/* <div className="space-y-1">
            <NavItem icon={Settings} label="Settings" disabled badge="Soon" />
            <NavItem icon={LifeBuoy} label="Support" disabled badge="Soon" />
          </div> */}
        </div>
      </div>

      {/* User account footer */}
      <div className="mx-4 mb-4 mt-4 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-moss-500/20 text-xs font-extrabold text-moss-300">
          {initials || "U"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-white">
            {user.first_name} {user.last_name || ""}
          </p>
          <p className="truncate text-[10px] text-white">{user.role}</p>
        </div>
        <button
          onClick={logout}
          title="Log out"
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white hover:bg-white/5 hover:text-white cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] lg:block">{SidebarContent}</aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[260px]">{SidebarContent}</aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-[260px]">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-sand-200 bg-sand-50/90 px-5 py-4 backdrop-blur sm:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-sand-200 bg-white p-2 text-forest-700 lg:hidden cursor-pointer"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="font-display truncate text-xl font-extrabold text-forest-950 sm:text-2xl">
              {pageTitle}
            </h1>
            {pageSubtitle && (
              <p className="mt-0.5 truncate text-xs font-medium text-forest-500">{pageSubtitle}</p>
            )}
          </div>
          <button className="hidden h-9 w-9 items-center justify-center rounded-xl border border-sand-200 bg-white text-forest-600 hover:text-white sm:flex cursor-pointer">
            <Bell className="h-4 w-4" />
          </button>
          {headerAction}
        </header>

        {/* Page content */}
        <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
