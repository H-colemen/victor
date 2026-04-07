import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, TrendingUp, Plus, Eye } from 'lucide-react';
import { getDashboardStats } from '@/services/adminService';
import { getAllProducts } from '@/services/adminService';
import { getAllOrders } from '@/services/orderService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    const [dashboardStats, products, orders] = await Promise.all([
      getDashboardStats(),
      getAllProducts(),
      getAllOrders(),
    ]);

    setStats(dashboardStats);
    setRecentOrders(orders.slice(0, 5));
    setLowStockProducts(products.filter(p => p.stock_quantity < 5).slice(0, 5));
    
    setIsLoading(false);
  };

  const formatPrice = (price: number) => `R${price.toLocaleString()}`;

  const statCards = [
    { 
      label: 'Total Products', 
      value: stats.totalProducts, 
      icon: Package, 
      color: 'bg-blue-500',
      link: '/admin/products'
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      icon: ShoppingCart, 
      color: 'bg-green-500',
      link: '/admin/orders'
    },
    { 
      label: 'Total Revenue', 
      value: formatPrice(stats.totalRevenue), 
      icon: DollarSign, 
      color: 'bg-purple-500',
      link: '/admin/orders'
    },
    { 
      label: 'Pending Orders', 
      value: stats.pendingOrders, 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      link: '/admin/orders'
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#005EE9] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Dashboard</h1>
          <p className="text-gray-500">Welcome back to your admin panel</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-[#005EE9] text-white px-4 py-2 rounded-lg hover:bg-[#0F172A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-medium">Recent Orders</h2>
            <Link to="/admin/orders" className="text-[#005EE9] text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y">
            {recentOrders.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-gray-500">{order.customer_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total_amount)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-medium">Low Stock Alert</h2>
            <Link to="/admin/products" className="text-[#005EE9] text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y">
            {lowStockProducts.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">All products well stocked</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.primary_image || product.images?.[0]?.image_url || 'https://via.placeholder.com/40'}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      product.stock_quantity === 0 ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {product.stock_quantity} left
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/admin/products/new"
            className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-[#005EE9] hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-6 h-6 text-[#005EE9]" />
            <span className="text-sm">Add Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-[#005EE9] hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-6 h-6 text-[#005EE9]" />
            <span className="text-sm">View Orders</span>
          </Link>
          <Link
            to="/admin/hero-slides"
            className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-[#005EE9] hover:bg-blue-50 transition-colors"
          >
            <Package className="w-6 h-6 text-[#005EE9]" />
            <span className="text-sm">Edit Hero</span>
          </Link>
          <Link
            to="/admin/settings"
            className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-[#005EE9] hover:bg-blue-50 transition-colors"
          >
            <DollarSign className="w-6 h-6 text-[#005EE9]" />
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
