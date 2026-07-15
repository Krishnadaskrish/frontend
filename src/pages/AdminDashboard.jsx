import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import { useSnackbar } from "notistack";
import axios from "axios";
import {
  Users,
  Lock,
  Loader2,
  CheckSquare,
  Square,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  Layers,
} from "lucide-react";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [usersCount, setUsersCount] = useState(0);
  const [rolesList, setRolesList] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Role permissions mappings edits
  const [editingMappings, setEditingMappings] = useState({}); // roleId -> array of permissionIds
  const [updatingPermissions, setUpdatingPermissions] = useState({}); // roleId -> boolean

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes, permsRes] = await Promise.all([
        axios.get("/api/users"),
        axios.get("/api/roles"),
        axios.get("/api/permissions"),
      ]);

      // Calculate total users count
      const uRes = usersRes.data;
      if (Array.isArray(uRes)) {
        setUsersCount(uRes.length);
      } else if (uRes.pagination) {
        setUsersCount(uRes.pagination.recordsTotal || 0);
      } else if (uRes.response) {
        setUsersCount(uRes.response.length);
      }

      setRolesList(rolesRes.data);
      setPermissionsList(permsRes.data);

      // Prepopulate current permission mappings
      const mappingsObj = {};
      rolesRes.data.forEach((role) => {
        mappingsObj[role.id] = role.permissions.map((p) => p.id);
      });
      setEditingMappings(mappingsObj);
    } catch (error) {
      console.error("Failed to load admin dashboard data", error);
      setErrorMsg("Failed to retrieve system status data.");
      enqueueSnackbar("Failed to retrieve system status data.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Toggle permission mapping check
  const handleTogglePermission = (roleId, permId) => {
    setEditingMappings((prev) => {
      const currentList = prev[roleId] || [];
      const newList = currentList.includes(permId)
        ? currentList.filter((id) => id !== permId)
        : [...currentList, permId];
      return { ...prev, [roleId]: newList };
    });
  };

  const handleSavePermissionMappings = async (roleId) => {
    setErrorMsg("");
    setSuccessMsg("");
    setUpdatingPermissions((prev) => ({ ...prev, [roleId]: true }));

    const selectedPermissionIds = editingMappings[roleId] || [];

    try {
      await axios.post("/api/roles/permissions", {
        roleId,
        permissionIds: selectedPermissionIds,
      });
      const msg = "Role permissions mapped successfully.";
      setSuccessMsg(msg);
      enqueueSnackbar(msg, { variant: "success" });
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to save permission mappings.";
      setErrorMsg(errMsg);
      enqueueSnackbar(errMsg, { variant: "error" });
      // Rollback UI check state to what is active on the server
      const rolesRes = await axios.get("/api/roles");
      setRolesList(rolesRes.data);
      const mappingsObj = {};
      rolesRes.data.forEach((role) => {
        mappingsObj[role.id] = role.permissions.map((p) => p.id);
      });
      setEditingMappings(mappingsObj);
    } finally {
      setUpdatingPermissions((prev) => ({ ...prev, [roleId]: false }));
    }
  };

  if (loading) {
    return <Loader message="Loading system configuration..." />;
  }

  return (
    <Layout
      pageTitle="Roles & Access"
      pageSubtitle="Configure microservice roles and access scopes"
      headerAction={
        <div className="hidden items-center gap-2 rounded-xl border border-moss-200 bg-moss-100 px-3 py-2 text-xs font-bold text-moss-600 sm:flex">
          <ShieldCheck className="h-4 w-4" /> Active Admin Node
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-forest-950 p-5 text-white shadow-panel">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-forest-400">
                Total Users
              </span>
              <Users className="h-4 w-4 text-moss-400" />
            </div>
            <p className="font-display mt-3 text-2xl font-extrabold">{usersCount}</p>
            <p className="mt-1 text-[11px] text-forest-400">Registered profiles</p>
          </div>
          <div className="rounded-3xl border border-sand-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-forest-500">
                Roles Defined
              </span>
              <Layers className="h-4 w-4 text-moss-500" />
            </div>
            <p className="font-display mt-3 text-2xl font-extrabold text-forest-950">
              {rolesList.length}
            </p>
            <p className="mt-1 text-[11px] text-forest-500">Configured system roles</p>
          </div>
          <div className="rounded-3xl border border-sand-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-forest-500">
                Permissions
              </span>
              <KeyRound className="h-4 w-4 text-moss-500" />
            </div>
            <p className="font-display mt-3 text-2xl font-extrabold text-forest-950">
              {permissionsList.length}
            </p>
            <p className="mt-1 text-[11px] text-forest-500">Available across roles</p>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-ember-500/30 bg-ember-100 p-4 text-sm font-semibold text-ember-500">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-moss-300 bg-moss-100 p-4 text-sm font-semibold text-moss-600">
            <ShieldCheck className="h-5 w-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Roles Configuration Panel */}
        <div className="space-y-5 rounded-3xl border border-sand-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-moss-500" />
            <h2 className="font-display text-lg font-extrabold text-forest-950">
              Role & Permission Configurations
            </h2>
          </div>

          <div className="space-y-6">
            {rolesList.map((role) => (
              <div
                key={role.id}
                className="space-y-4 rounded-2xl border border-sand-200 bg-sand-50/60 p-5"
              >
                <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-moss-600">{role.name} Role</h3>
                    <p className="mt-0.5 text-[11px] text-forest-500">{role.description}</p>
                  </div>
                  <button
                    onClick={() => handleSavePermissionMappings(role.id)}
                    disabled={!user.permissions.includes("roles:assign") || updatingPermissions[role.id]}
                    className="flex cursor-pointer items-center gap-1 rounded-lg border border-sand-200 bg-white px-3 py-1.5 text-[10px] font-bold text-forest-700 transition-all hover:border-moss-300 hover:text-moss-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingPermissions[role.id] ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>Save Mapping</>
                    )}
                  </button>
                </div>

                {/* Permissions checkboxes */}
                <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                  {permissionsList.map((perm) => {
                    const isChecked = (editingMappings[role.id] || []).includes(perm.id);
                    return (
                      <div
                        key={perm.id}
                        onClick={() => {
                          if (user.permissions.includes("roles:assign")) {
                            handleTogglePermission(role.id, perm.id);
                          } else {
                            enqueueSnackbar("You do not have write access to modify permission mappings.", { variant: "warning" });
                          }
                        }}
                        className={`group flex select-none items-start gap-2.5 ${
                          user.permissions.includes("roles:assign") ? "cursor-pointer" : "cursor-default opacity-80"
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-moss-500" />
                        ) : (
                          <Square className="mt-0.5 h-4 w-4 flex-shrink-0 text-sand-200 transition-colors group-hover:text-forest-400" />
                        )}
                        <div>
                          <span className="text-xs font-semibold text-forest-800">{perm.code}</span>
                          <p className="text-[10px] leading-normal text-forest-500">
                            {perm.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
