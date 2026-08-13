import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, Plus } from "lucide-react";
import { useCustomers } from "../../context/CustomerContext";
import { useOrders } from "../../context/OrderContext";
import Pagination from "../../components/admin/Pagination";
import EmptyState from "../../components/admin/EmptyState";
import toast from "react-hot-toast";

export default function Customers() {
  const { customers, isLoading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const { orders } = useOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [viewCustomer, setViewCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, sortBy]);

  // derive order stats per customer (match by email or phone)
  const customerMetrics = useMemo(() => {
    const map = {};
    (customers || []).forEach((c) => {
      map[c.id] = { orders: 0, total: 0, lastOrder: null };
    });
    orders.forEach((o) => {
      const email = (o.customer?.email || "").toLowerCase();
      const phone = (o.customer?.phone || "").toLowerCase();
      // find matching customer by email or phone
      const found = customers.find((c) => {
        if (c.email && c.email.toLowerCase() === email && email) return true;
        if (c.phone && c.phone.toLowerCase() === phone && phone) return true;
        return false;
      });
      if (found) {
        const m = map[found.id] || { orders: 0, total: 0, lastOrder: null };
        // Always count the order for the customer's order count
        m.orders += 1;
        // Only include order total in spending if the order is not Cancelled
        if ((o.status || "") !== "Cancelled") {
          m.total += Number(o.total || 0);
        }
        const created = o.createdAt ? new Date(o.createdAt) : null;
        if (created && (!m.lastOrder || created > new Date(m.lastOrder))) m.lastOrder = created.toISOString();
        map[found.id] = m;
      }
    });
    return map;
  }, [customers, orders]);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const active = customers.filter((c) => (c.status || "Active") === "Active").length;
    const withOrders = Object.values(customerMetrics).filter((m) => m.orders > 0).length;
    const withoutOrders = totalCustomers - withOrders;
    const totalRevenue = Object.values(customerMetrics).reduce((s, m) => s + (m.total || 0), 0);
    return { totalCustomers, active, withOrders, withoutOrders, totalRevenue };
  }, [customers, customerMetrics]);

  const filteredAndSorted = useMemo(() => {
    let list = Array.isArray(customers) ? [...customers] : [];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => {
        return (
          (c.name || "").toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q) ||
          (c.phone || "").toLowerCase().includes(q) ||
          (c.city || "").toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter) {
      list = list.filter((c) => (c.status || "Active") === statusFilter);
    }

    switch (sortBy) {
      case "newest":
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name-asc":
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "most-orders":
        list.sort((a, b) => (customerMetrics[b.id]?.orders || 0) - (customerMetrics[a.id]?.orders || 0));
        break;
      case "highest-spending":
        list.sort((a, b) => (customerMetrics[b.id]?.total || 0) - (customerMetrics[a.id]?.total || 0));
        break;
      case "lowest-spending":
        list.sort((a, b) => (customerMetrics[a.id]?.total || 0) - (customerMetrics[b.id]?.total || 0));
        break;
      default:
        break;
    }

    return list;
  }, [customers, searchQuery, statusFilter, sortBy, customerMetrics]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages]);

  // Form state for add/edit
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", status: "Active" });

  useEffect(() => {
    if (editingCustomer) setForm({ name: editingCustomer.name || "", email: editingCustomer.email || "", phone: editingCustomer.phone || "", address: editingCustomer.address || "", city: editingCustomer.city || "", status: editingCustomer.status || "Active" });
    else setForm({ name: "", email: "", phone: "", address: "", city: "", status: "Active" });
  }, [editingCustomer]);

  const openAdd = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const validateForm = () => {
    if (!form.name || !form.name.trim()) return "Name is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email is invalid";
    if (form.phone && !/^[0-9+\-()\s]{6,}$/.test(form.phone)) return "Phone is invalid";
    // unique email check
    if (form.email) {
      const exists = customers.find((c) => c.email && c.email.toLowerCase() === form.email.toLowerCase() && (!editingCustomer || c.id !== editingCustomer.id));
      if (exists) return "A customer with this email already exists";
    }
    return null;
  };

  const submitForm = () => {
    const err = validateForm();
    if (err) {
      toast.error(err);
      return;
    }
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, { ...form });
      toast.success("Customer updated");
    } else {
      addCustomer({ ...form });
      toast.success("Customer added");
      setCurrentPage(1);
    }
    setShowForm(false);
  };

  const attemptDelete = (c) => setDeleteTarget(c);
  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteCustomer(deleteTarget.id);
    toast.success("Customer deleted (orders not affected)");
    setDeleteTarget(null);
    setTimeout(() => setCurrentPage((p) => Math.min(p, Math.max(1, Math.ceil((customers.length - 1) / itemsPerPage)))), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/50 mb-1">
            <span>Admin</span>
            <span className="text-white/30">/</span>
            <span>Customers</span>
          </div>
          <h1 className="font-poppins font-bold text-white text-2xl">Customers</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search customers..." className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 w-64" />
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50">
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50">
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name A - Z</option>
            <option value="name-desc">Name Z - A</option>
            <option value="most-orders">Most Orders</option>
            <option value="highest-spending">Highest Spending</option>
            <option value="lowest-spending">Lowest Spending</option>
          </select>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-primary font-poppins font-semibold text-sm hover:bg-gold-light transition-all duration-200">
            <Plus size={18} />
            Add Customer
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
                <EmptyState message={searchQuery || statusFilter ? "No customers match your search or filters" : undefined} onAdd={openAdd} />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Customer</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Email</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Phone</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Location</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Orders</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Total Spent</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Joined</th>
                        <th className="text-right px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((c) => (
                        <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4"><div className="text-white text-sm font-semibold">{c.name}</div></td>
                          <td className="px-6 py-4"><div className="text-white/70 text-sm">{c.email || "-"}</div></td>
                          <td className="px-6 py-4"><div className="text-white/70 text-sm">{c.phone || "-"}</div></td>
                          <td className="px-6 py-4"><div className="text-white/50 text-sm">{c.city || c.address || "-"}</div></td>
                          <td className="px-6 py-4"><div className="text-white/70 text-sm">{customerMetrics[c.id]?.orders || 0}</div></td>
                          <td className="px-6 py-4"><div className="text-gold font-poppins font-semibold">PKR {(customerMetrics[c.id]?.total || 0).toLocaleString()}</div></td>
                          <td className="px-6 py-4"><div className="text-white/70 text-sm">{c.status || "Active"}</div></td>
                          <td className="px-6 py-4"><div className="text-white/50 text-xs">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}</div></td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setViewCustomer(c)} aria-label="View customer" title="View customer" className="p-2 rounded-lg text-white/60 hover:text-blue-400 hover:bg-blue-500/10">View</button>
                              <button onClick={() => { setEditingCustomer(c); setShowForm(true); }} aria-label="Edit customer" title="Edit customer" className="p-2 rounded-lg text-white/60 hover:text-gold hover:bg-gold/10">Edit</button>
                              <button onClick={() => attemptDelete(c)} aria-label="Delete customer" title="Delete customer" className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10">Delete</button>
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
            <h3 className="font-poppins font-semibold text-white text-lg mb-4">Customer Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-white/70">Total Customers</span><span className="font-poppins font-semibold text-white">{stats.totalCustomers}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Active</span><span className="font-poppins font-semibold text-white">{stats.active}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">With Orders</span><span className="font-poppins font-semibold text-white">{stats.withOrders}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Without Orders</span><span className="font-poppins font-semibold text-white">{stats.withoutOrders}</span></div>
              <div className="mt-3 border-t border-white/5 pt-3 flex items-center justify-between"><span className="text-white/70">Total Customer Revenue</span><span className="font-poppins font-semibold text-gold">PKR {stats.totalRevenue.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* View Customer Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setViewCustomer(null)} />
          <div className="relative z-50 w-full max-w-3xl bg-primary rounded-2xl p-6">
            <div className="flex items-center justify-between"><h3 className="font-poppins font-semibold text-white text-lg">{viewCustomer.name}</h3><button onClick={() => setViewCustomer(null)} className="text-white/50">Close</button></div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <h4 className="text-white/70">Contact</h4>
                <p className="text-white text-sm">{viewCustomer.email || "-"}</p>
                <p className="text-white/50 text-xs">{viewCustomer.phone || "-"}</p>
                <p className="text-white/50 text-xs mt-2">{viewCustomer.address || "-"}</p>

                <h4 className="text-white/70 mt-4">Recent Orders</h4>
                <div className="space-y-3 mt-2">
                  {(orders.filter((o) => {
                    const email = (o.customer?.email || "").toLowerCase();
                    const phone = (o.customer?.phone || "").toLowerCase();
                    return (viewCustomer.email && viewCustomer.email.toLowerCase() === email) || (viewCustomer.phone && viewCustomer.phone.toLowerCase() === phone);
                  }).slice(0,5)).map((o) => (
                    <div key={o.id} className="flex items-center gap-3">
                      <div className="text-white text-sm">{o.orderNumber}</div>
                      <div className="text-white/50 text-xs">PKR {(o.total || 0).toLocaleString()}</div>
                      <div className="text-white/50 text-xs">{o.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-white/70"><span>Total Orders</span><span>{customerMetrics[viewCustomer.id]?.orders || 0}</span></div>
                  <div className="flex justify-between text-white/70"><span>Total Spent</span><span className="font-poppins font-semibold text-gold">PKR {(customerMetrics[viewCustomer.id]?.total || 0).toLocaleString()}</span></div>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="text-white/50 text-xs">Joined: {viewCustomer.createdAt ? new Date(viewCustomer.createdAt).toLocaleString() : "-"}</div>
                  <div className="text-white/50 text-xs">Last Order: {customerMetrics[viewCustomer.id]?.lastOrder ? new Date(customerMetrics[viewCustomer.id].lastOrder).toLocaleString() : "-"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <div className="relative z-50 w-full max-w-2xl bg-primary rounded-2xl p-6">
            <div className="flex items-center justify-between"><h3 className="font-poppins font-semibold text-white text-lg">{editingCustomer ? "Edit Customer" : "Add Customer"}</h3><button onClick={() => setShowForm(false)} className="text-white/50">Close</button></div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-white/70 text-xs">Name</label>
                <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
              </div>
              <div>
                <label className="text-white/70 text-xs">Email</label>
                <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
              </div>
              <div>
                <label className="text-white/70 text-xs">Phone</label>
                <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
              </div>
              <div>
                <label className="text-white/70 text-xs">City</label>
                <input value={form.city} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="text-white/70 text-xs">Address</label>
                <input value={form.address} onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
              </div>
              <div>
                <label className="text-white/70 text-xs">Status</label>
                <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-white/5 text-white">Cancel</button>
              <button onClick={submitForm} className="px-4 py-2 rounded-xl bg-gold text-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-50 w-full max-w-lg bg-primary rounded-2xl p-6">
            <h3 className="font-poppins font-semibold text-white text-lg">Delete Customer</h3>
            <p className="text-white/70 mt-2">Are you sure you want to delete customer "{deleteTarget.name}"? This will not delete their existing orders.</p>
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
