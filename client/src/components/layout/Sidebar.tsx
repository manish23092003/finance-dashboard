import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Users, LogOut, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../context/authStore';
import Badge from '../ui/Badge';
import type { Role } from '../../types';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: CreditCard },
];

const adminItems = [
  { to: '/admin/users', label: 'User Management', icon: Users },
];

function roleBadgeVariant(role: Role) {
  return role === 'ADMIN' ? 'admin' : role === 'ANALYST' ? 'analyst' : 'viewer';
}

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items = user?.role === 'ADMIN' ? [...navItems, ...adminItems] : navItems;

  return (
    <aside className="w-[260px] h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white shrink-0 dark:border-r dark:border-slate-800">
      {/* Brand */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">FinDash</h1>
          <p className="text-xs text-slate-400">Finance Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="px-4 py-5 border-t border-slate-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <Badge variant={roleBadgeVariant(user?.role || 'VIEWER')}>
              {user?.role}
            </Badge>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
