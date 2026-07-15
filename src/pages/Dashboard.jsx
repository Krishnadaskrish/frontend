import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import {
  ShieldCheck,
  KeyRound,
  UserCircle2,
  CheckCircle2,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const getPermissionDesc = (code) => {
    const descs = {
      "users:create": "Allows creating new user profiles and login credentials.",
      "users:read": "Allows listing and viewing user profiles and statuses.",
      "users:delete": "Allows permanently removing user profiles and credentials.",
      "roles:assign": "Allows assigning roles to users and mapping permissions to roles.",
      "roles:read": "Allows reading roles and system permissions structure.",
    };
    return descs[code] || "Custom system permission.";
  };

  const permissionCount = user.permissions?.length || 0;

  return (
    <Layout
      pageTitle="Dashboard"
      pageSubtitle={`Welcome back, ${user.first_name}`}
      headerAction={
        user.role === "Admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1.5 rounded-xl bg-forest-950 px-4 py-2.5 text-xs font-bold text-white shadow-soft transition-colors hover:bg-forest-800 cursor-pointer"
          >
            Admin Panel <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )
      }
    >
      <div className="space-y-6">
        {/* Stat cards row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-forest-950 p-5 text-white shadow-panel">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-forest-400">
                Account Role
              </span>
              <ShieldCheck className="h-4 w-4 text-moss-400" />
            </div>
            <p className="font-display mt-3 text-2xl font-extrabold">{user.role}</p>
            <p className="mt-1 text-[11px] text-forest-400">Assigned system role</p>
          </div>

          <div className="rounded-3xl border border-sand-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-forest-500">
                Permissions Granted
              </span>
              <KeyRound className="h-4 w-4 text-moss-500" />
            </div>
            <p className="font-display mt-3 text-2xl font-extrabold text-forest-950">
              {permissionCount}
            </p>
            <p className="mt-1 text-[11px] text-forest-500">Active on your profile</p>
          </div>

          <div className="rounded-3xl border border-sand-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-forest-500">
                Profile Status
              </span>
              <BadgeCheck className="h-4 w-4 text-moss-500" />
            </div>
            <p className="font-display mt-3 text-2xl font-extrabold text-forest-950">Verified</p>
            <p className="mt-1 text-[11px] text-forest-500">Session authenticated</p>
          </div>
        </div>

        {/* Profile card */}
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-sand-200 bg-white p-6 shadow-soft md:flex-row md:items-center md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-moss-100 text-moss-600">
              <UserCircle2 className="h-9 w-9" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-forest-950">
                {user.first_name} {user.last_name || ""}
              </h2>
              <p className="mt-0.5 text-sm text-forest-500">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-forest-500">
              Assigned Role
            </span>
            <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-moss-200 bg-moss-100 px-3 py-1 text-xs font-extrabold text-moss-600">
              <span className="h-1.5 w-1.5 rounded-full bg-moss-500" />
              {user.role}
            </span>
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-forest-500">
            Your System Permissions
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {user.permissions && user.permissions.length > 0 ? (
              user.permissions.map((p) => (
                <div
                  key={p}
                  className="flex items-start gap-3.5 rounded-2xl border border-sand-200 bg-white p-4 shadow-soft transition-colors hover:border-moss-300"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-moss-500" />
                  <div>
                    <code className="rounded-md border border-sand-200 bg-sand-100 px-2 py-0.5 text-xs font-bold text-forest-800">
                      {p}
                    </code>
                    <p className="mt-2 text-xs leading-relaxed text-forest-500">
                      {getPermissionDesc(p)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 rounded-3xl border border-dashed border-sand-200 bg-white py-10 text-center text-sm text-forest-500">
                No permissions mapped to this profile yet. Contact administration.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
