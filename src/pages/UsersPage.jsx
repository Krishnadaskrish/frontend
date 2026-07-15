import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import DeleteModal from "../components/DeleteModal";
import Can from "../components/Can";
import { useSnackbar } from "notistack";
import axios from "axios";
import {
  Users,
  UserPlus,
  Trash2,
  Loader2,
  AlertCircle,
  ShieldCheck,
  X,
  Lock,
} from "lucide-react";

export const UsersPage = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [usersList, setUsersList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal toggle state
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Add user form state
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "User",
  });
  const [creatingUser, setCreatingUser] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchUsersList(page, limit);
    }
  }, [page, limit]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const usersRes = await axios.get("/api/users", { params: { page, limit } });
      const res = usersRes.data;
      setUsersList(res.response || []);
      if (res.pagination) {
        setTotalRecords(res.pagination.recordsTotal || 0);
      }

      // 2. Only fetch roles definitions if user has permissions to create users (Requires roles:read)
      if (user.permissions.includes("users:create")) {
        try {
          const rolesRes = await axios.get("/api/roles");
          setRolesList(rolesRes.data || []);
        } catch (roleErr) {
          console.warn("Failed to load roles list for creation mapping: ", roleErr.message);
        }
      }
    } catch (error) {
      console.error("Failed to load users page data", error);
      setErrorMsg("Failed to retrieve system status data.");
      enqueueSnackbar("Failed to retrieve system status data.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersList = async (p = page, l = limit) => {
    setLoadingUsers(true);
    try {
      const usersRes = await axios.get("/api/users", { params: { page: p, limit: l } });
      const res = usersRes.data;
      setUsersList(res.response || []);
      if (res.pagination) {
        setTotalRecords(res.pagination.recordsTotal || 0);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
      setErrorMsg("Failed to load user directory updates.");
      enqueueSnackbar("Failed to load user directory updates.", { variant: "error" });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setCreatingUser(true);

    try {
      await axios.post("/api/users", newUser);
      const msg = `User ${newUser.email} created successfully.`;
      setSuccessMsg(msg);
      enqueueSnackbar(msg, { variant: "success" });
      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "User",
      });
      setShowCreateModal(false);
      setPage(1);
      await fetchUsersList(1, limit);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to create user profile";
      setErrorMsg(errMsg);
      enqueueSnackbar(errMsg, { variant: "error" });
    } finally {
      setCreatingUser(false);
    }
  };

  // Trigger delete validation & open the React confirmation modal
  const handleDeleteTrigger = (usr) => {
    if (usr.email === "admin@rbac.com") {
      setErrorMsg("Security constraint: Default Admin cannot be deleted.");
      enqueueSnackbar("Security constraint: Default Admin cannot be deleted.", { variant: "error" });
      return;
    }

    if (usr.email === user.email) {
      setErrorMsg("Self-lockout constraint: You cannot delete your own profile.");
      enqueueSnackbar("Self-lockout constraint: You cannot delete your own profile.", { variant: "error" });
      return;
    }

    setUserToDelete(usr);
    setDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      await axios.delete(`/api/users/${userToDelete.id}`);
      const msg = `User profile ${userToDelete.email} removed.`;
      setSuccessMsg(msg);
      enqueueSnackbar(msg, { variant: "success" });
      // Reload current users list
      await fetchUsersList(page, limit);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to delete user profile";
      setErrorMsg(errMsg);
      enqueueSnackbar(errMsg, { variant: "error" });
    } finally {
      setUserToDelete(null);
    }
  };

  if (loading) {
    return <Loader message="Loading user profiles..." />;
  }

  return (
    <Layout
      pageTitle="Users Directory"
      pageSubtitle="Manage system user profiles and authorization nodes"
      headerAction={
        <Can perform="users:create">
          <button
            onClick={() => {
              setErrorMsg("");
              setSuccessMsg("");
              setShowCreateModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-forest-950 px-4 py-2.5 text-xs font-bold text-white shadow-soft transition-colors hover:bg-forest-800 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" /> Create User
          </button>
        </Can>
      }
    >
      <div className="space-y-6">
        {/* Error/Success Alert Box */}
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

        {/* User Profiles Directory Table */}
        <div className="space-y-4 rounded-3xl border border-sand-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-moss-500" />
            <h2 className="font-display text-lg font-extrabold text-forest-950">
              Registered Users
            </h2>
            {loadingUsers && <Loader2 className="h-4 w-4 animate-spin text-moss-500" />}
          </div>

          <div className="overflow-x-auto rounded-t-2xl border border-sand-200 border-b-0">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50 text-[10px] font-extrabold uppercase tracking-wider text-forest-500">
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Email Address</th>
                  <th className="px-5 py-3.5">Assigned System Role</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-xs">
                {usersList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-forest-400 font-semibold">
                      No user accounts found.
                    </td>
                  </tr>
                ) : (
                  usersList.map((usr) => (
                    <tr key={usr.id} className="transition-colors hover:bg-sand-50/60">
                      <td className="px-5 py-3.5 font-bold text-forest-900">
                        {usr.first_name} {usr.last_name || ""}
                      </td>
                      <td className="px-5 py-3.5 text-forest-500">{usr.email}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-moss-200 bg-moss-100 px-2.5 py-0.5 text-[10.5px] font-extrabold text-moss-600">
                          {usr.role || "User"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <Can perform="users:delete">
                          <button
                            title="Delete User"
                            disabled={usr.email === "admin@rbac.com" || usr.email === user.email}
                            onClick={() => handleDeleteTrigger(usr)}
                            className="cursor-pointer rounded-lg border border-transparent p-1.5 text-forest-400 transition-all hover:border-ember-500/20 hover:bg-ember-100 hover:text-ember-500 disabled:opacity-30 disabled:hover:border-transparent disabled:hover:bg-transparent disabled:hover:text-forest-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </Can>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            limit={limit}
            totalRecords={totalRecords}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
            isLoading={loadingUsers}
          />
        </div>
      </div>

      {/* Floating Create User Modal overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-sand-200 bg-white p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 text-forest-400 hover:text-forest-700 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <UserPlus className="h-5 w-5 text-moss-500" />
              <h2 className="font-display text-lg font-extrabold text-forest-950">Create New User</h2>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-forest-500">First Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    placeholder="Jane"
                    className="h-10 w-full rounded-lg border border-sand-200 bg-sand-50 px-3 text-xs text-forest-900 outline-none transition-colors focus:border-moss-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-forest-500">Last Name</label>
                  <input
                    type="text"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    placeholder="Doe"
                    className="h-10 w-full rounded-lg border border-sand-200 bg-sand-50 px-3 text-xs text-forest-900 outline-none transition-colors focus:border-moss-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-forest-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="jane.doe@company.com"
                  className="h-10 w-full rounded-lg border border-sand-200 bg-sand-50 px-3 text-xs text-forest-900 outline-none transition-colors focus:border-moss-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-forest-500">Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-lg border border-sand-200 bg-sand-50 px-3 text-xs text-forest-900 outline-none transition-colors focus:border-moss-400"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold uppercase text-forest-500">System Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="h-10 w-full cursor-pointer rounded-lg border border-sand-200 bg-sand-50 px-2.5 text-xs text-forest-800 outline-none transition-colors focus:border-moss-400"
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="User">User (Read-only Profiles)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={creatingUser}
                className="flex h-10 w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-forest-950 text-xs font-bold text-white shadow-soft transition-colors hover:bg-forest-800 mt-2"
              >
                {creatingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create User Profile</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Confirmation Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDeleteUser}
        title="Remove User Account"
        message={`"${userToDelete?.first_name || ""} (${userToDelete?.email || ""})"` + " profile and linked credentials will be permanently removed. This cannot be undone."}
      />
    </Layout>
  );
};

export default UsersPage;
