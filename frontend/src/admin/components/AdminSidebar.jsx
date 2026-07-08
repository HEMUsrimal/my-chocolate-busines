import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../utils/api';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Settings,
  BarChart,
  LogOut
} from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const userString = localStorage.getItem('user');
  const loggedInUser = userString ? JSON.parse(userString) : null;
  const isSeller = loggedInUser?.isSeller && !loggedInUser?.isAdmin;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    ...(!isSeller ? [{ icon: Users, label: 'Users', path: '/admin/users' }] : []),
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: BarChart, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen w-64 bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center">
          {isSeller ? 'Seller Panel' : 'Admin Panel'}
        </h2>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-8">
        <button
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
          onClick={async () => {
            try {
              await adminApi.logout();
            } catch (err) {
              console.error('Logout error:', err);
            } finally {
              localStorage.removeItem('token');
              navigate('/admin/login');
            }
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 