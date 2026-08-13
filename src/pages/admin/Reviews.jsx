import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Plus } from "lucide-react";
import { useReviews } from "../../context/ReviewContext";
import { useProducts } from "../../context/ProductContext";
import { useCustomers } from "../../context/CustomerContext";
import Pagination from "../../components/admin/Pagination";
import EmptyState from "../../components/admin/EmptyState";
import toast from "react-hot-toast";

function Stars({ value }) {
  const v = Math.max(0, Math.min(5, Math.round(value || 0)));
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < v ? "text-gold" : "text-white/30"}`}>★</span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { reviews, isLoading, addReview, updateReview, deleteReview } = useReviews();
  const { products } = useProducts();
  const { customers } = useCustomers();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [viewReview, setViewReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, ratingFilter, productFilter, sortBy]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter((r) => r.status === "Pending").length;
    const approved = reviews.filter((r) => r.status === "Approved").length;
    const rejected = reviews.filter((r) => r.status === "Rejected").length;
    const avg = reviews.length ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length) : 0;
    const five = reviews.filter((r) => Number(r.rating) === 5).length;
    const one = reviews.filter((r) => Number(r.rating) === 1).length;
    return { total, pending, approved, rejected, avg, five, one };
  }, [reviews]);

  const filteredAndSorted = useMemo(() => {
    let list = Array.isArray(reviews) ? [...reviews] : [];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => {
        return (
          (r.productName || "").toLowerCase().includes(q) ||
          (r.customerName || "").toLowerCase().includes(q) ||
          (r.customerEmail || "").toLowerCase().includes(q) ||
          (r.title || "").toLowerCase().includes(q) ||
          (r.comment || "").toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter) list = list.filter((r) => (r.status || "") === statusFilter);
    if (ratingFilter) list = list.filter((r) => Number(r.rating) === Number(ratingFilter));
    if (productFilter) list = list.filter((r) => String(r.productId) === String(productFilter));

    switch (sortBy) {
      case "newest":
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "highest":
        list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;
      case "lowest":
        list.sort((a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0));
        break;
      case "customer-asc":
        list.sort((a, b) => (a.customerName || "").localeCompare(b.customerName || ""));
        break;
      case "product-asc":
        list.sort((a, b) => (a.productName || "").localeCompare(b.productName || ""));
        break;
      default:
        break;
    }

    return list;
  }, [reviews, searchQuery, statusFilter, ratingFilter, productFilter, sortBy]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages]);

  const productById = (id) => products.find((p) => String(p.id) === String(id)) || null;
  const customerById = (id) => customers.find((c) => String(c.id) === String(id)) || null;

  // form state
  const [form, setForm] = useState({ productId: "", customerId: "", rating: 5, title: "", comment: "", status: "Pending" });

  useEffect(() => {
    if (editingReview) {
      setForm({
        productId: editingReview.productId || "",
        customerId: editingReview.customerId || "",
        rating: editingReview.rating || 5,
        title: editingReview.title || "",
        comment: editingReview.comment || "",
        status: editingReview.status || "Pending",
      });
    } else {
      setForm({ productId: "", customerId: "", rating: 5, title: "", comment: "", status: "Pending" });
    }
  }, [editingReview]);

  const openAdd = () => { setEditingReview(null); setShowForm(true); };

  const validateForm = () => {
    if (!form.productId) return "Product is required";
    if (!form.customerId) return "Customer is required";
    if (!form.title || !form.title.trim()) return "Title is required";
    if (!form.comment || !form.comment.trim()) return "Comment is required";
    const rt = Number(form.rating);
    if (!rt || rt < 1 || rt > 5) return "Rating must be between 1 and 5";
    if (!["Pending","Approved","Rejected"].includes(form.status)) return "Invalid status";
    return null;
  };

  const submitForm = () => {
    const err = validateForm();
    if (err) { toast.error(err); return; }

    // snapshot product and customer info into review
    const prod = productById(form.productId);
    const cust = customerById(form.customerId);

    const payload = {
      productId: form.productId,
      productName: prod ? prod.name : "(Product unavailable)",
      productImage: prod ? prod.image : "",
      customerId: form.customerId,
      customerName: cust ? cust.name : "(Customer)",
      customerEmail: cust ? cust.email : "",
      rating: Number(form.rating),
      title: form.title,
      comment: form.comment,
      status: form.status,
    };

    if (editingReview) {
      updateReview(editingReview.id, payload);
      toast.success("Review updated");
    } else {
      addReview(payload);
      toast.success("Review added");
      setCurrentPage(1);
    }
    setShowForm(false);
  };

  const attemptDelete = (r) => setDeleteTarget(r);
  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteReview(deleteTarget.id);
    toast.success("Review deleted");
    setDeleteTarget(null);
    setTimeout(() => setCurrentPage((p) => Math.min(p, Math.max(1, Math.ceil((reviews.length - 1) / itemsPerPage)))), 0);
  };

  const changeStatus = (r, s) => { updateReview(r.id, { status: s }); toast.success("Status updated"); };

  // helpers
  const short = (text, n=70) => (text && text.length > n ? text.slice(0,n) + "..." : text || "");

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/50 mb-1">
            <span>Admin</span>
            <span className="text-white/30">/</span>
            <span>Reviews</span>
          </div>
          <h1 className="font-poppins font-bold text-white text-2xl">Reviews</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search reviews..." className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 w-64" />
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50">
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50">
            <option value="">All Products</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50">
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="customer-asc">Customer A - Z</option>
            <option value="product-asc">Product A - Z</option>
          </select>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-primary font-poppins font-semibold text-sm hover:bg-gold-light transition-all duration-200">
            <Plus size={18} />
            Add Review
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="glass gold-border rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="p-6">Loading...</div>
            ) : totalItems === 0 ? (
              <div className="p-6"><EmptyState message={searchQuery || statusFilter || ratingFilter ? "No reviews match your search or filters" : undefined} onAdd={openAdd} /></div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Product</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Customer</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Rating</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Title</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Comment</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Date</th>
                        <th className="text-right px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((r) => (
                        <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {r.productImage ? <img src={r.productImage} alt={r.productName} className="w-12 h-12 rounded-md object-cover" /> : <div className="w-12 h-12 rounded-md bg-white/5" />}
                              <div className="text-white text-sm">{r.productName || "(Product unavailable)"}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4"><div className="text-white text-sm">{r.customerName || "-"}</div><div className="text-white/50 text-xs">{r.customerEmail || "-"}</div></td>
                          <td className="px-6 py-4"><Stars value={r.rating} /></td>
                          <td className="px-6 py-4"><div className="text-white/70 text-sm">{r.title}</div></td>
                          <td className="px-6 py-4"><div className="text-white/50 text-sm">{short(r.comment, 80)}</div></td>
                          <td className="px-6 py-4"><div className="text-white/70 text-sm">{r.status}</div></td>
                          <td className="px-6 py-4"><div className="text-white/50 text-xs">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</div></td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setViewReview(r)} aria-label="View review" title="View review" className="p-2 rounded-lg text-white/60 hover:text-blue-400 hover:bg-blue-500/10">View</button>
                              <button onClick={() => { setEditingReview(r); setShowForm(true); }} aria-label="Edit review" title="Edit review" className="p-2 rounded-lg text-white/60 hover:text-gold hover:bg-gold/10">Edit</button>
                              <select value={r.status} onChange={(e) => changeStatus(r, e.target.value)} className="px-3 py-1 rounded-lg bg-white/5 text-white text-sm">
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                              </select>
                              <button onClick={() => attemptDelete(r)} aria-label="Delete review" title="Delete review" className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10">Delete</button>
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
            <h3 className="font-poppins font-semibold text-white text-lg mb-4">Review Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-white/70">Total Reviews</span><span className="font-poppins font-semibold text-white">{stats.total}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Pending</span><span className="font-poppins font-semibold text-white">{stats.pending}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Approved</span><span className="font-poppins font-semibold text-white">{stats.approved}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Rejected</span><span className="font-poppins font-semibold text-white">{stats.rejected}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Average Rating</span><span className="font-poppins font-semibold text-gold">{stats.avg.toFixed(2)}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">5★ Reviews</span><span className="font-poppins font-semibold text-white">{stats.five}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">1★ Reviews</span><span className="font-poppins font-semibold text-white">{stats.one}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* View Review Modal */}
      {viewReview && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setViewReview(null)} />
          <div className="relative z-50 w-full max-w-3xl bg-primary rounded-2xl p-6">
            <div className="flex items-center justify-between"><h3 className="font-poppins font-semibold text-white text-lg">{viewReview.title}</h3><button onClick={() => setViewReview(null)} className="text-white/50">Close</button></div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                  {viewReview.productImage ? <img src={viewReview.productImage} alt={viewReview.productName} className="w-16 h-16 rounded-md object-cover" /> : <div className="w-16 h-16 rounded-md bg-white/5" />}
                  <div>
                    <div className="text-white font-semibold">{viewReview.productName || "(Product unavailable)"}</div>
                    <div className="text-white/50 text-xs">Reviewed by: {viewReview.customerName || "-"} • {viewReview.customerEmail || "-"}</div>
                  </div>
                </div>

                <div className="mt-4"><Stars value={viewReview.rating} /></div>
                <div className="mt-4 text-white/70"><p>{viewReview.comment}</p></div>
              </div>

              <div>
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-white/70"><span>Status</span><span className="font-poppins font-semibold text-white">{viewReview.status}</span></div>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="text-white/50 text-xs">Created: {viewReview.createdAt ? new Date(viewReview.createdAt).toLocaleString() : "-"}</div>
                  <div className="text-white/50 text-xs">Updated: {viewReview.updatedAt ? new Date(viewReview.updatedAt).toLocaleString() : "-"}</div>
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
            <div className="flex items-center justify-between"><h3 className="font-poppins font-semibold text-white text-lg">{editingReview ? "Edit Review" : "Add Review"}</h3><button onClick={() => setShowForm(false)} className="text-white/50">Close</button></div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-white/70 text-xs">Product</label>
                <select value={form.productId} onChange={(e) => setForm((s) => ({ ...s, productId: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
                  <option value="">Select product</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-white/70 text-xs">Customer</label>
                <select value={form.customerId} onChange={(e) => setForm((s) => ({ ...s, customerId: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
                  <option value="">Select customer</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-white/70 text-xs">Rating</label>
                <select value={form.rating} onChange={(e) => setForm((s) => ({ ...s, rating: Number(e.target.value) }))} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>

              <div>
                <label className="text-white/70 text-xs">Status</label>
                <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-white/70 text-xs">Title</label>
                <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
              </div>

              <div className="md:col-span-2">
                <label className="text-white/70 text-xs">Comment</label>
                <textarea value={form.comment} onChange={(e) => setForm((s) => ({ ...s, comment: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm h-28" />
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
            <h3 className="font-poppins font-semibold text-white text-lg">Delete Review</h3>
            <p className="text-white/70 mt-2">Are you sure you want to delete this review "{deleteTarget.title}"?</p>
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
