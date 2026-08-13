import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Plus, ChevronRight } from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import { useProducts } from "../../context/ProductContext";
import Pagination from "../../components/admin/Pagination";
import EmptyState from "../../components/admin/EmptyState";
import toast from "react-hot-toast";

export default function Orders() {
  const { orders, isLoading, addOrder, updateOrder, deleteOrder } = useOrders();
  const { products } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [viewOrder, setViewOrder] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, sortBy]);

  const revenueFromOrders = useMemo(() => {
    return orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const confirmed = orders.filter((o) => o.status === "Confirmed").length;
    const processing = orders.filter((o) => o.status === "Processing").length;
    const shipped = orders.filter((o) => o.status === "Shipped").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;
    return { total, pending, confirmed, processing, shipped, delivered, cancelled };
  }, [orders]);

  const filteredAndSorted = useMemo(() => {
    let list = Array.isArray(orders) ? [...orders] : [];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter((o) => {
        const on = (o.orderNumber || "").toLowerCase();
        const cn = (o.customer?.name || "").toLowerCase();
        const cp = (o.customer?.phone || "").toLowerCase();
        const ce = (o.customer?.email || "").toLowerCase();
        return on.includes(q) || cn.includes(q) || cp.includes(q) || ce.includes(q);
      });
    }

    if (statusFilter) {
      list = list.filter((o) => (o.status || "") === statusFilter);
    }

    switch (sortBy) {
      case "newest":
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "highest":
        list.sort((a, b) => (b.total || 0) - (a.total || 0));
        break;
      case "lowest":
        list.sort((a, b) => (a.total || 0) - (b.total || 0));
        break;
      case "customer-asc":
        list.sort((a, b) => (a.customer?.name || "").localeCompare(b.customer?.name || ""));
        break;
      case "customer-desc":
        list.sort((a, b) => (b.customer?.name || "").localeCompare(a.customer?.name || ""));
        break;
      default:
        break;
    }

    return list;
  }, [orders, searchQuery, statusFilter, sortBy]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages]);

  const productById = (id) => products.find((p) => p.id === id) || null;

  const openDemoOrder = () => {
    // Create a demo order from cart-like sample referencing existing products
    const sampleItems = [
      { productId: 2, productName: "Automatique Royale Watch", quantity: 1, price: 15000, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&q=80" },
    ];
    const subtotal = sampleItems.reduce((s, it) => s + it.price * it.quantity, 0);
    const order = {
      customer: { name: "Demo User", phone: "03001112222", email: "demo@example.com", address: "Demo Address" },
      items: sampleItems,
      subtotal,
      deliveryFee: 200,
      total: subtotal + 200,
      paymentMethod: "Cash on Delivery",
      status: "Pending",
    };
    const created = addOrder(order);
    if (created) {
      toast.success("Demo order created");
      setCurrentPage(1);
    }
  };

  const handleStatusChange = (order, newStatus) => {
    updateOrder(order.id, { status: newStatus });
    toast.success(`Order ${order.orderNumber} updated to ${newStatus}`);
  };

  const attemptDelete = (order) => {
    setDeleteTarget(order);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteOrder(deleteTarget.id);
    toast.success("Order deleted");
    setDeleteTarget(null);
    setTimeout(() => setCurrentPage((p) => Math.min(p, Math.max(1, Math.ceil((orders.length - 1) / itemsPerPage)))), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/50 mb-1">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span>Orders</span>
          </div>
          <h1 className="font-poppins font-bold text-white text-2xl">Orders</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search orders..." className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 w-64" />
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50">
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50">
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Total</option>
            <option value="lowest">Lowest Total</option>
            <option value="customer-asc">Customer A - Z</option>
            <option value="customer-desc">Customer Z - A</option>
          </select>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openDemoOrder} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-primary font-poppins font-semibold text-sm hover:bg-gold-light transition-all duration-200">
            <Plus size={18} />
            Add Demo Order
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="glass gold-border rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="p-6">Loading...</div>
            ) : totalItems === 0 ? (
              <div className="p-6">
                <EmptyState message={searchQuery || statusFilter ? "No orders match your search or filters" : undefined} onAdd={openDemoOrder} />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Order #</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Customer</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Items</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Total</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Payment</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Date</th>
                        <th className="text-right px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((o) => (
                        <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4"><div className="text-white/70 font-mono text-sm">{o.orderNumber}</div></td>
                          <td className="px-6 py-4"><div className="text-white text-sm">{o.customer?.name}</div><div className="text-white/50 text-xs">{o.customer?.phone}</div></td>
                          <td className="px-6 py-4"><div className="text-white/70 text-sm">{o.items?.length || 0}</div></td>
                          <td className="px-6 py-4"><div className="text-gold font-poppins font-semibold">PKR {(o.total || 0).toLocaleString()}</div></td>
                          <td className="px-6 py-4"><div className="text-white/70 text-sm">{o.paymentMethod}</div></td>
                          <td className="px-6 py-4">
                            <select value={o.status} onChange={(e) => handleStatusChange(o, e.target.value)} className="px-3 py-1 rounded-lg bg-white/5 text-white text-sm">
                              <option>Pending</option>
                              <option>Confirmed</option>
                              <option>Processing</option>
                              <option>Shipped</option>
                              <option>Delivered</option>
                              <option>Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4"><div className="text-white/50 text-xs">{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</div></td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setViewOrder(o)} aria-label="View order" title="View order" className="p-2 rounded-lg text-white/60 hover:text-blue-400 hover:bg-blue-500/10">View</button>
                              <button onClick={() => attemptDelete(o)} aria-label="Delete order" title="Delete order" className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 border-t border-white/5">
                  <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={(p) => setCurrentPage(p)} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass gold-border rounded-2xl p-6">
            <h3 className="font-poppins font-semibold text-white text-lg mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-white/70">Total Orders</span><span className="font-poppins font-semibold text-white">{stats.total}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Pending</span><span className="font-poppins font-semibold text-white">{stats.pending}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Processing</span><span className="font-poppins font-semibold text-white">{stats.processing}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Shipped</span><span className="font-poppins font-semibold text-white">{stats.shipped}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Delivered</span><span className="font-poppins font-semibold text-white">{stats.delivered}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Cancelled</span><span className="font-poppins font-semibold text-white">{stats.cancelled}</span></div>
              <div className="mt-3 border-t border-white/5 pt-3 flex items-center justify-between"><span className="text-white/70">Total Revenue</span><span className="font-poppins font-semibold text-gold">PKR {revenueFromOrders.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setViewOrder(null)} />
          <div className="relative z-50 w-full max-w-3xl bg-primary rounded-2xl p-6">
            <div className="flex items-center justify-between"><h3 className="font-poppins font-semibold text-white text-lg">Order {viewOrder.orderNumber}</h3><button onClick={() => setViewOrder(null)} className="text-white/50">Close</button></div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <h4 className="text-white/70">Customer</h4>
                <p className="text-white text-sm">{viewOrder.customer?.name}</p>
                <p className="text-white/50 text-xs">{viewOrder.customer?.phone} • {viewOrder.customer?.email}</p>
                <p className="text-white/50 text-xs mt-2">{viewOrder.customer?.address}</p>

                <h4 className="text-white/70 mt-4">Items</h4>
                <div className="space-y-3 mt-2">
                  {viewOrder.items?.map((it, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={it.image} alt={it.productName} className="w-12 h-12 rounded-md object-cover" />
                      <div>
                        <div className="text-white text-sm">{it.productName}</div>
                        <div className="text-white/50 text-xs">Qty: {it.quantity} • PKR {it.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-white/70"><span>Subtotal</span><span>PKR {(viewOrder.subtotal || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between text-white/70"><span>Delivery</span><span>PKR {(viewOrder.deliveryFee || 0).toLocaleString()}</span></div>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="flex justify-between font-poppins font-bold text-base"><span>Total</span><span className="text-gold">PKR {(viewOrder.total || 0).toLocaleString()}</span></div>
                  <div className="mt-3 text-white/70 text-sm">Payment: {viewOrder.paymentMethod}</div>
                  <div className="mt-3 text-white/50 text-xs">Created: {viewOrder.createdAt ? new Date(viewOrder.createdAt).toLocaleString() : "-"}</div>
                  <div className="text-white/50 text-xs">Updated: {viewOrder.updatedAt ? new Date(viewOrder.updatedAt).toLocaleString() : "-"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-50 w-full max-w-lg bg-primary rounded-2xl p-6">
            <h3 className="font-poppins font-semibold text-white text-lg">Delete Order</h3>
            <p className="text-white/70 mt-2">Are you sure you want to delete order "{deleteTarget.orderNumber}"?</p>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl bg-white/5 text-white">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-xl bg-red-500 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
