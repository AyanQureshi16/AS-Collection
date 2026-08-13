import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import { useProducts } from "../../context/ProductContext";
import { useCustomers } from "../../context/CustomerContext";
import { useReviews } from "../../context/ReviewContext";
import { useCategories } from "../../context/CategoryContext";

function formatCurrency(n) {
  if (!n && n !== 0) return "PKR 0";
  return `PKR ${Number(n).toLocaleString()}`;
}

export default function Dashboard() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { customers } = useCustomers();
  const { reviews } = useReviews();
  const { categories } = useCategories();

  // Revenue: exclude Cancelled
  const revenue = useMemo(() => {
    return orders
      .filter((o) => (o.status || "") !== "Cancelled")
      .reduce((s, o) => s + (Number(o.total) || 0), 0);
  }, [orders]);

  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;

  // stats array computed dynamically
  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(revenue),
      change: "",
      trend: "up",
      icon: DollarSign,
      color: "text-gold",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      change: "",
      trend: "up",
      icon: ShoppingBag,
      color: "text-blue-400",
    },
    {
      label: "Total Customers",
      value: totalCustomers,
      change: "",
      trend: "up",
      icon: Users,
      color: "text-green-400",
    },
    {
      label: "Total Products",
      value: totalProducts,
      change: "",
      trend: "up",
      icon: Package,
      color: "text-purple-400",
    },
  ];

  // Recent orders: sort by createdAt desc, take latest 5
  const recentOrders = useMemo(() => {
    return orders
      .slice()
      .sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      })
      .slice(0, 5)
      .map((o) => ({
        id: o.orderNumber || `#${o.id}`,
        customer: o.customer?.name || o.customer?.email || "Guest",
        amount: formatCurrency(Number(o.total) || 0),
        status: o.status || "Pending",
      }));
  }, [orders]);

  // Top selling products derived from orders.items excluding Cancelled
  const topProducts = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      if ((o.status || "") === "Cancelled") return;
      (o.items || []).forEach((it) => {
        const pid = String(it.productId || it.id || it.productId);
        const qty = Number(it.quantity || 1) || 1;
        counts[pid] = (counts[pid] || 0) + qty;
      });
    });
    const arr = Object.keys(counts).map((pid) => {
      const product = products.find((p) => String(p.id) === String(pid));
      return {
        id: pid,
        name: product ? product.name : `Product ${pid}`,
        sales: counts[pid],
      };
    });
    arr.sort((a, b) => b.sales - a.sales);
    return arr.slice(0, 5);
  }, [orders, products]);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass gold-border rounded-2xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/50 text-sm font-inter mb-2">{stat.label}</p>
                  <h3 className="font-poppins font-bold text-white text-2xl">
                    {stat.value}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <ArrowUpRight size={16} className="text-green-400" />
                    ) : (
                      <ArrowDownRight size={16} className="text-red-400" />
                    )}
                    <span
                      className={`text-sm font-inter ${
                        stat.trend === "up" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass gold-border rounded-2xl p-6"
        >
          <h2 className="font-poppins font-semibold text-white text-lg mb-4">
            Recent Orders
          </h2>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-white/50">No recent orders</div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5"
                >
                  <div>
                    <p className="font-poppins font-semibold text-white text-sm">{order.id}</p>
                    <p className="text-white/50 text-xs font-inter">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-poppins font-semibold text-gold text-sm">{order.amount}</p>
                    <span
                      className={`text-xs font-inter px-2 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "Processing"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass gold-border rounded-2xl p-6"
        >
          <h2 className="font-poppins font-semibold text-white text-lg mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <div className="text-white/50">No sales data available</div>
            ) : (
              topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex-1">
                    <p className="font-poppins font-semibold text-white text-sm line-clamp-1">{product.name}</p>
                    <p className="text-white/50 text-xs font-inter">{product.sales} sales</p>
                  </div>
                  <p className="font-poppins font-semibold text-gold text-sm ml-4">{ /* revenue not available */ "" }</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Revenue Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass gold-border rounded-2xl p-6"
      >
        <h2 className="font-poppins font-semibold text-white text-lg mb-4">Revenue Overview</h2>
        <div className="h-64 flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
          <div className="text-center">
            <TrendingUp size={48} className="text-gold mx-auto mb-4" />
            <p className="text-white/50 text-sm font-inter">Chart visualization coming soon</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
