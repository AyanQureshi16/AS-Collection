import { motion } from "framer-motion";
import { BarChart3, Clock, BarChart, DollarSign, ShoppingCart, Users, Box, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useOrders } from "../../context/OrderContext";
import { useProducts } from "../../context/ProductContext";
import { useCustomers } from "../../context/CustomerContext";
import { useReviews } from "../../context/ReviewContext";
import { useCategories } from "../../context/CategoryContext";

function SummaryCard({ title, value, icon }) {
  return (
    <div className="glass gold-border rounded-2xl p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
        {icon}
      </div>
      <div>
        <div className="text-white/70 text-xs">{title}</div>
        <div className="font-poppins font-bold text-white text-lg">{value}</div>
      </div>
    </div>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="flex items-center justify-between text-white/70 text-sm"><span>{label}</span><span className="font-poppins font-semibold text-white">{value}</span></div>
  );
}

function formatCurrency(n) {
  if (!n && n !== 0) return "PKR 0";
  return `PKR ${Number(n).toLocaleString()}`;
}

export default function Analytics() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { customers } = useCustomers();
  const { reviews } = useReviews();
  const { categories } = useCategories();

  const [range, setRange] = useState(7); // days: 7,30,90,0(all -> months)

  // Revenue (exclude Cancelled)
  const revenue = useMemo(() => {
    return orders
      .filter((o) => (o.status || "") !== "Cancelled")
      .reduce((s, o) => s + (Number(o.total) || 0), 0);
  }, [orders]);

  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const totalReviews = reviews.length;

  const nonCancelledOrdersCount = useMemo(() => orders.filter((o) => (o.status || "") !== "Cancelled").length, [orders]);
  const averageOrderValue = nonCancelledOrdersCount ? revenue / nonCancelledOrdersCount : 0;

  // Orders by status
  const orderStatusCounts = useMemo(() => {
    const map = { Pending: 0, Confirmed: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
    orders.forEach((o) => { const s = o.status || "Pending"; map[s] = (map[s] || 0) + 1; });
    return map;
  }, [orders]);

  // Product analytics
  const productStats = useMemo(() => {
    const active = products.filter((p) => p.status === "Active").length;
    const draft = products.filter((p) => p.status === "Draft").length;
    const outOfStock = products.filter((p) => p.status === "Out of Stock" || (p.stock || 0) === 0).length;
    const featured = products.filter((p) => p.featured).length;
    return { active, draft, outOfStock, featured };
  }, [products]);

  // Top-selling products (by quantity) from orders items (exclude Cancelled)
  const topSelling = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      if ((o.status || "") === "Cancelled") return;
      (o.items || []).forEach((it) => {
        const id = String(it.productId || it.id || it.productId);
        const qty = Number(it.quantity || 1) || 1;
        counts[id] = (counts[id] || 0) + qty;
      });
    });
    const arr = Object.keys(counts).map((id) => ({ id, qty: counts[id], product: products.find((p) => String(p.id) === String(id)) }));
    arr.sort((a,b) => b.qty - a.qty);
    return arr.slice(0,5);
  }, [orders, products]);

  // Category distribution based on products
  const categoryDistribution = useMemo(() => {
    const total = products.length;
    const map = {};
    products.forEach((p) => { const cat = p.category || "Uncategorized"; map[cat] = (map[cat] || 0) + 1; });
    const arr = Object.keys(map).map((k) => ({ name: k, count: map[k], pct: total ? Math.round((map[k]/total)*100) : 0 }));
    arr.sort((a,b) => b.count - a.count);
    return arr;
  }, [products]);

  // Customer analytics
  const customerAnalytics = useMemo(() => {
    const activeCount = customers.filter((c) => (c.status || "Active") === "Active").length;
    // map customer spending excluding Cancelled
    const spendMap = {};
    orders.forEach((o) => {
      if ((o.status || "") === "Cancelled") return;
      const email = (o.customer?.email || "").toLowerCase();
      const phone = (o.customer?.phone || "").toLowerCase();
      // try to find matching customer
      const cust = customers.find((c) => (c.email && c.email.toLowerCase() === email) || (c.phone && c.phone.toLowerCase() === phone));
      if (cust) {
        spendMap[cust.id] = (spendMap[cust.id] || 0) + (Number(o.total) || 0);
      }
    });
    const withOrders = Object.keys(spendMap).length;
    const withoutOrders = customers.length - withOrders;
    const topSpenders = Object.keys(spendMap).map((id) => ({ id, total: spendMap[id], customer: customers.find((c) => c.id === Number(id)) })).sort((a,b)=>b.total-a.total).slice(0,5);
    return { activeCount, withOrders, withoutOrders, topSpenders };
  }, [customers, orders]);

  // Review analytics
  const reviewAnalytics = useMemo(() => {
    const approved = reviews.filter((r)=> r.status === "Approved").length;
    const pending = reviews.filter((r)=> r.status === "Pending").length;
    const rejected = reviews.filter((r)=> r.status === "Rejected").length;
    const avg = reviews.length ? (reviews.reduce((s,r)=> s + (Number(r.rating)||0),0) / reviews.length) : 0;
    const counts = [5,4,3,2,1].map((n) => ({ star: n, count: reviews.filter((r)=> Number(r.rating) === n).length }));
    return { approved, pending, rejected, avg, counts };
  }, [reviews]);

  // Revenue over time
  const revenueSeries = useMemo(() => {
    const now = new Date();
    if (range === 0) {
      // all time -> monthly for last 12 months
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(d);
      }
      const labels = months.map((d)=> d.toLocaleString(undefined,{month:'short', year:'numeric'}));
      const values = months.map((start, idx) => {
        const end = new Date(start.getFullYear(), start.getMonth()+1, 1);
        return orders.filter((o)=> {
          if ((o.status||"") === "Cancelled") return false;
          const c = o.createdAt ? new Date(o.createdAt) : null;
          return c && c >= start && c < end;
        }).reduce((s,o)=> s + (Number(o.total)||0), 0);
      });
      return { labels, values };
    }
    // days range
    const days = range;
    const labels = [];
    const values = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      labels.push(d.toLocaleDateString());
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(dayStart); dayEnd.setDate(dayStart.getDate() + 1);
      const total = orders.filter((o)=> {
        if ((o.status||"") === "Cancelled") return false;
        const c = o.createdAt ? new Date(o.createdAt) : null;
        return c && c >= dayStart && c < dayEnd;
      }).reduce((s,o)=> s + (Number(o.total)||0), 0);
      values.push(total);
    }
    return { labels, values };
  }, [orders, range]);

  // Recent activity
  const recentOrders = useMemo(() => orders.slice().sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5), [orders]);
  const recentReviews = useMemo(() => reviews.slice().sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5), [reviews]);
  const recentProducts = useMemo(() => products.slice().filter(p=> p.createdAt || p.updatedAt || p.lastUpdated).slice().sort((a,b)=> new Date(b.updatedAt||b.createdAt||b.lastUpdated) - new Date(a.updatedAt||a.createdAt||a.lastUpdated)).slice(0,5), [products]);
  const recentCustomers = useMemo(() => customers.slice().sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5), [customers]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/50 mb-1"><span>Admin</span><span className="text-white/30">/</span><span>Analytics</span></div>
          <h1 className="font-poppins font-bold text-white text-2xl">Analytics</h1>
        </div>
        <div className="flex items-center gap-3">
          <select value={range} onChange={(e)=> setRange(Number(e.target.value))} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={0}>All time (monthly)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <SummaryCard title="Total Revenue" value={formatCurrency(revenue)} icon={<DollarSign size={20} className="text-gold" />} />
        <SummaryCard title="Total Orders" value={totalOrders} icon={<ShoppingCart size={20} className="text-gold" />} />
        <SummaryCard title="Total Customers" value={totalCustomers} icon={<Users size={20} className="text-gold" />} />
        <SummaryCard title="Total Products" value={totalProducts} icon={<Box size={20} className="text-gold" />} />
        <SummaryCard title="Avg Order Value" value={formatCurrency(Math.round(averageOrderValue))} icon={<BarChart size={20} className="text-gold" />} />
        <SummaryCard title="Total Reviews" value={totalReviews} icon={<Star size={20} className="text-gold" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass gold-border rounded-2xl p-4">
          <h3 className="font-poppins font-semibold text-white text-lg mb-4">Revenue Overview</h3>
          <div className="w-full h-48 bg-primary/50 rounded-md p-3">
            {/* simple bar chart */}
            <div className="w-full h-full flex items-end gap-2">
              {revenueSeries.values.map((v, i) => {
                const max = Math.max(...revenueSeries.values, 1);
                const h = (v / max) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="bg-gold w-full" style={{ height: `${h}%`, borderRadius: 4 }} />
                    <div className="text-white/40 text-xs mt-2 truncate">{revenueSeries.labels[i]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="glass gold-border rounded-2xl p-4">
          <h3 className="font-poppins font-semibold text-white text-lg mb-4">Orders Breakdown</h3>
          <div className="space-y-2">
            <SmallStat label="Pending" value={orderStatusCounts.Pending || 0} />
            <SmallStat label="Processing" value={orderStatusCounts.Processing || 0} />
            <SmallStat label="Shipped" value={orderStatusCounts.Shipped || 0} />
            <SmallStat label="Delivered" value={orderStatusCounts.Delivered || 0} />
            <SmallStat label="Cancelled" value={orderStatusCounts.Cancelled || 0} />
            <div className="h-px bg-white/5 my-2" />
            <SmallStat label="Total Orders" value={totalOrders} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass gold-border rounded-2xl p-4">
          <h3 className="font-poppins font-semibold text-white text-lg mb-4">Product Analytics</h3>
          <SmallStat label="Active Products" value={productStats.active} />
          <SmallStat label="Draft Products" value={productStats.draft} />
          <SmallStat label="Out of Stock" value={productStats.outOfStock} />
          <SmallStat label="Featured" value={productStats.featured} />

          <div className="mt-4">
            <h4 className="text-white/70 text-sm mb-2">Top Selling</h4>
            {topSelling.length === 0 ? <div className="text-white/50 text-sm">No sales data available</div> : topSelling.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-white/70 text-sm mb-2">
                <div>{t.product ? t.product.name : `Product ${t.id}`}</div>
                <div className="font-poppins font-semibold text-white">{t.qty}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass gold-border rounded-2xl p-4">
          <h3 className="font-poppins font-semibold text-white text-lg mb-4">Category Distribution</h3>
          {categoryDistribution.length === 0 ? <div className="text-white/50">No categories</div> : categoryDistribution.map((c) => (
            <div key={c.name} className="flex items-center justify-between text-white/70 text-sm mb-2">
              <div>{c.name}</div>
              <div className="font-poppins font-semibold text-white">{c.count} ({c.pct}%)</div>
            </div>
          ))}
        </div>

        <div className="glass gold-border rounded-2xl p-4">
          <h3 className="font-poppins font-semibold text-white text-lg mb-4">Customer Analytics</h3>
          <SmallStat label="Total Customers" value={totalCustomers} />
          <SmallStat label="Active Customers" value={customerAnalytics.activeCount} />
          <SmallStat label="Customers with Orders" value={customerAnalytics.withOrders} />
          <SmallStat label="Customers without Orders" value={customerAnalytics.withoutOrders} />

          <div className="mt-4">
            <h4 className="text-white/70 text-sm mb-2">Top Spenders</h4>
            {customerAnalytics.topSpenders.length === 0 ? <div className="text-white/50">No spending data</div> : customerAnalytics.topSpenders.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-white/70 text-sm mb-2">
                <div>{s.customer ? s.customer.name : `Customer ${s.id}`}</div>
                <div className="font-poppins font-semibold text-white">{formatCurrency(s.total)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass gold-border rounded-2xl p-4 lg:col-span-2">
          <h3 className="font-poppins font-semibold text-white text-lg mb-4">Review Analytics</h3>
          <SmallStat label="Total Reviews" value={totalReviews} />
          <SmallStat label="Approved" value={reviewAnalytics.approved} />
          <SmallStat label="Pending" value={reviewAnalytics.pending} />
          <SmallStat label="Rejected" value={reviewAnalytics.rejected} />
          <SmallStat label="Average Rating" value={reviewAnalytics.avg.toFixed(2)} />
          <div className="mt-3">
            {reviewAnalytics.counts.map((c) => (
              <SmallStat key={c.star} label={`${c.star}★`} value={c.count} />
            ))}
          </div>
        </div>

        <div className="glass gold-border rounded-2xl p-4">
          <h3 className="font-poppins font-semibold text-white text-lg mb-4">Recent Activity</h3>
          <div className="text-white/70 text-sm mb-3">Recent Orders</div>
          {recentOrders.length === 0 ? <div className="text-white/50 mb-3">No recent orders</div> : recentOrders.map((o) => (
            <div key={o.id} className="flex items-center justify-between text-white/70 text-sm mb-2">
              <div>{o.orderNumber}</div>
              <div className="font-poppins font-semibold text-white">{formatCurrency(o.total)}</div>
            </div>
          ))}

          <div className="h-px bg-white/5 my-3" />
          <div className="text-white/70 text-sm mb-3">Recent Reviews</div>
          {recentReviews.length === 0 ? <div className="text-white/50 mb-3">No recent reviews</div> : recentReviews.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-white/70 text-sm mb-2">
              <div className="truncate mr-2">{r.title}</div>
              <div className="font-poppins font-semibold text-white">{r.rating}★</div>
            </div>
          ))}

          <div className="h-px bg-white/5 my-3" />
          <div className="text-white/70 text-sm mb-3">Recent Products / Customers</div>
          <div className="text-white/70 text-sm">Products:</div>
          {recentProducts.length === 0 ? <div className="text-white/50">No recent products with timestamps</div> : recentProducts.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-white/70 text-sm mb-2"><div className="truncate mr-2">{p.name}</div><div className="text-white/50 text-xs">{(p.updatedAt||p.createdAt||p.lastUpdated) ? new Date(p.updatedAt||p.createdAt||p.lastUpdated).toLocaleDateString() : '-'}</div></div>
          ))}
          <div className="text-white/70 text-sm mt-2">Customers:</div>
          {recentCustomers.length === 0 ? <div className="text-white/50">No recent customers</div> : recentCustomers.map((c) => (
            <div key={c.id} className="flex items-center justify-between text-white/70 text-sm mb-2"><div>{c.name}</div><div className="text-white/50 text-xs">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</div></div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
