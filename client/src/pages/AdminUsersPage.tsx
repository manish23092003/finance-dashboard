import { useState, type FormEvent } from 'react';
import { Shield, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUsers, useChangeRole, useToggleStatus, useCreateUser } from '../hooks/useUsers';
import { createUserSchema } from '../validators/forms';
import { formatDate } from '../lib/utils';
import type { Role } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';

export default function AdminUsersPage() {
  const { data: users, isLoading } = useUsers();
  const changeRoleMutation = useChangeRole();
  const toggleStatusMutation = useToggleStatus();
  const createUserMutation = useCreateUser();

  // ── Create User Modal State ─────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '' as string,
  });

  const openCreateModal = () => {
    setFormData({ name: '', email: '', password: '', role: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = createUserSchema.safeParse(formData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!errs[key]) errs[key] = issue.message;
      }
      setFormErrors(errs);
      return;
    }

    try {
      await createUserMutation.mutateAsync(result.data);
      toast.success('User created successfully');
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to create user');
    }
  };

  // ── Inline Actions ──────────────────────────────────────────────────────
  const handleRoleChange = async (userId: string, role: Role) => {
    try {
      await changeRoleMutation.mutateAsync({ userId, role });
      toast.success('Role updated successfully');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to update role');
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync({ userId, isActive });
      toast.success(`User ${isActive ? 'activated' : 'deactivated'}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
            <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">{users?.length || 0} registered users</p>
          </div>
        </div>
        <Button onClick={openCreateModal} icon={<UserPlus className="w-4 h-4" />} id="create-user-btn">
          <span className="hidden sm:inline">Create User</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      {/* ── Desktop Table View (hidden on mobile) ───────────────────────── */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">User</th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Joined</th>
                <th className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {users?.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  {/* User avatar + name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{u.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.email}</td>

                  {/* Role dropdown */}
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      disabled={changeRoleMutation.isPending}
                      className="text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="ANALYST">Analyst</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  </td>

                  {/* Status badge */}
                  <td className="px-6 py-4">
                    <Badge variant={u.isActive ? 'active' : 'inactive'}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>

                  {/* Joined date */}
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(u.createdAt)}
                  </td>

                  {/* Toggle status */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(u.id, !u.isActive)}
                      disabled={toggleStatusMutation.isPending}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer ${
                        u.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          u.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Card View (hidden on md+) ────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {users?.map((u) => (
          <div
            key={u.id}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4"
          >
            {/* User Identity Row */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">{u.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
              </div>
              <Badge variant={u.isActive ? 'active' : 'inactive'}>
                {u.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Details Row */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {/* Role Selector */}
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                  disabled={changeRoleMutation.isPending}
                  className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="ANALYST">Analyst</option>
                  <option value="VIEWER">Viewer</option>
                </select>

                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Joined {formatDate(u.createdAt)}
                </span>
              </div>

              {/* Toggle */}
              <button
                onClick={() => handleToggleStatus(u.id, !u.isActive)}
                disabled={toggleStatusMutation.isPending}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer ${
                  u.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    u.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New User"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
            error={formErrors.name}
            id="create-user-name"
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
            error={formErrors.email}
            id="create-user-email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min 6 chars, upper + lower + digit"
            value={formData.password}
            onChange={(e) => setFormData((f) => ({ ...f, password: e.target.value }))}
            error={formErrors.password}
            id="create-user-password"
          />
          <Select
            label="Role"
            options={[
              { value: 'ADMIN', label: 'Admin' },
              { value: 'ANALYST', label: 'Analyst' },
              { value: 'VIEWER', label: 'Viewer' },
            ]}
            placeholder="Select a role..."
            value={formData.role}
            onChange={(e) => setFormData((f) => ({ ...f, role: e.target.value }))}
            error={formErrors.role}
            id="create-user-role"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createUserMutation.isPending}
              icon={<UserPlus className="w-4 h-4" />}
              id="create-user-submit"
            >
              Create User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
