import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, Plus, Search, ChevronRight } from "lucide-react";
import { useCategories } from "../../context/CategoryContext";
import { useProducts } from "../../context/ProductContext";
import toast from "react-hot-toast";
import Pagination from "../../components/admin/Pagination";
import EmptyState from "../../components/admin/EmptyState";

function slugify(text) {
  return (
    (text || "")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  );
}

export default function Categories() {
  const { categories, isLoading, addCategory, updateCategory, deleteCategory, refreshCategories } = useCategories();
  const { products } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState({});
  const [viewCategory, setViewCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, sortBy]);

  const productCountFor = (catName) => products.filter((p) => (p.category || "") === (catName || "")).length;

  const filteredAndSorted = useMemo(() => {
    let list = Array.isArray(categories) ? [...categories] : [];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => {
        return (
          (c.name || "").toLowerCase().includes(q) ||
          (c.description || "").toLowerCase().includes(q) ||
          (c.slug || "").toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter) {
      list = list.filter((c) => (c.status || "") === statusFilter);
    }

    switch (sortBy) {
      case "newest":
        list.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case "oldest":
        list.sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
      case "name-asc":
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "most-products":
        list.sort((a, b) => productCountFor(b.name) - productCountFor(a.name));
        break;
      case "least-products":
        list.sort((a, b) => productCountFor(a.name) - productCountFor(b.name));
        break;
      default:
        break;
    }

    return list;
  }, [categories, products, searchQuery, statusFilter, sortBy]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages]);

  const openAddForm = () => {
    setFormMode("add");
    setFormData({ name: "", description: "", image: "", status: "Active" });
    setShowForm(true);
  };

  const openEditForm = (cat) => {
    setFormMode("edit");
    setFormData({ ...cat });
    setShowForm(true);
  };

  const validateForm = () => {
    const name = (formData.name || "").trim();
    if (!name) return "Name is required";
    const slug = slugify(name);
    const conflict = categories.some((c) => (c.name === name || c.slug === slug) && (formMode !== "edit" || c.id !== formData.id));
    if (conflict) return "Category name or slug already exists";
    return null;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) { toast.error(err); return; }

    const name = (formData.name || "").trim();
    const slug = slugify(name);
    const payload = {
      name,
      slug,
      description: formData.description || "",
      image: formData.image || "",
      status: formData.status || "Active",
    };

    if (formMode === "add") {
      addCategory(payload);
      toast.success("Category added successfully");
      setShowForm(false);
      setCurrentPage(1);
    } else {
      updateCategory(formData.id, payload);
      toast.success("Category updated successfully");
      setShowForm(false);
    }
  };

  const attemptDelete = (cat) => {
    const count = productCountFor(cat.name);
    if (count > 0) {
      toast.error(`This category contains ${count} product(s). Reassign or remove products before deleting.`);
      return;
    }
    setDeleteTarget(cat);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteCategory(deleteTarget.id);
    toast.success("Category deleted");
    setDeleteTarget(null);
    setTimeout(() => setCurrentPage((p) => Math.min(p, Math.max(1, Math.ceil((categories.length - 1) / itemsPerPage)))), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/50 mb-1">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span>Categories</span>
          </div>
          <h1 className="font-poppins font-bold text-white text-2xl">Categories</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search categories..." className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 w-64" />
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
            <option value="most-products">Most Products</option>
            <option value="least-products">Least Products</option>
          </select>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAddForm} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-primary font-poppins font-semibold text-sm hover:bg-gold-light transition-all duration-200">
            <Plus size={18} />
            Add Category
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
                <EmptyState message={searchQuery || statusFilter ? "No categories match your search or filters" : undefined} onAdd={openAddForm} />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Category</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Description</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Products</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Updated</th>
                        <th className="text-right px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((cat, idx) => (
                        <tr key={cat.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={cat.image || "https://images.unsplash.com/photo-1523995462485-4d94b64fd5c5?w=100&q=80"} alt={cat.name} className="w-12 h-12 rounded-lg object-cover" />
                              <div>
                                <p className="font-poppins font-semibold text-white text-sm">{cat.name}</p>
                                <p className="text-white/50 text-xs">{cat.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4"><span className="text-white/70 text-sm">{cat.description}</span></td>
                          <td className="px-6 py-4"><span className="text-white/70 text-sm">{productCountFor(cat.name)}</span></td>
                          <td className="px-6 py-4"><span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-poppins font-medium ${cat.status === "Active" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>{cat.status}</span></td>
                          <td className="px-6 py-4"><span className="text-white/50 text-xs">{cat.updatedAt ? new Date(cat.updatedAt).toLocaleString() : "-"}</span></td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setViewCategory(cat)} aria-label="View category" title="View category" className="p-2 rounded-lg text-white/60 hover:text-blue-400 hover:bg-blue-500/10">
                                View
                              </button>
                              <button onClick={() => openEditForm(cat)} aria-label="Edit category" title="Edit category" className="p-2 rounded-lg text-white/60 hover:text-gold hover:bg-gold/10">
                                Edit
                              </button>
                              <button onClick={() => attemptDelete(cat)} aria-label="Delete category" title="Delete category" className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10">
                                Delete
                              </button>
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
            <h3 className="font-poppins font-semibold text-white text-lg mb-4">Category Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Total</span>
                <span className="font-poppins font-semibold text-white">{categories.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Active</span>
                <span className="font-poppins font-semibold text-white">{categories.filter((c) => c.status === "Active").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Inactive</span>
                <span className="font-poppins font-semibold text-white">{categories.filter((c) => c.status !== "Active").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Categories With Products</span>
                <span className="font-poppins font-semibold text-white">{categories.filter((c) => productCountFor(c.name) > 0).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Empty Categories</span>
                <span className="font-poppins font-semibold text-white">{categories.filter((c) => productCountFor(c.name) === 0).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewCategory && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setViewCategory(null)} />
          <div className="relative z-50 w-full max-w-2xl bg-primary rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins font-semibold text-white text-lg">{viewCategory.name}</h3>
              <button onClick={() => setViewCategory(null)} className="text-white/50">Close</button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <img src={viewCategory.image || "https://images.unsplash.com/photo-1523995462485-4d94b64fd5c5?w=400&q=80"} alt={viewCategory.name} className="w-full h-48 object-cover rounded-lg md:col-span-1" />
              <div className="md:col-span-2">
                <p className="text-white/70">{viewCategory.description}</p>
                <p className="text-white/70 mt-2">Slug: {viewCategory.slug}</p>
                <p className="text-white/70 mt-2">Status: {viewCategory.status}</p>
                <p className="text-white/70 mt-2">Products: {productCountFor(viewCategory.name)}</p>
                <div className="mt-4">
                  <h4 className="font-poppins font-semibold text-white text-sm mb-2">Products Preview</h4>
                  <div className="space-y-2">
                    {products.filter((p) => p.category === viewCategory.name).slice(0,5).map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-md object-cover" />
                        <div>
                          <div className="text-white text-sm">{p.name}</div>
                          <div className="text-white/50 text-xs">{p.sku}</div>
                        </div>
                      </div>
                    ))}
                    {productCountFor(viewCategory.name) === 0 && <div className="text-white/50 text-sm">No products in this category</div>}
                  </div>
                </div>
                <p className="text-white/50 text-xs mt-4">Created: {viewCategory.createdAt ? new Date(viewCategory.createdAt).toLocaleString() : "-"}</p>
                <p className="text-white/50 text-xs">Updated: {viewCategory.updatedAt ? new Date(viewCategory.updatedAt).toLocaleString() : "-"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <form onSubmit={handleFormSubmit} className="relative z-50 w-full max-w-3xl bg-primary rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins font-semibold text-white text-lg">{formMode === "add" ? "Add Category" : "Edit Category"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-white/50">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/70 text-sm block mb-1">Name *</label>
                <input value={formData.name} onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
              </div>

              <div>
                <label className="text-white/70 text-sm block mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData((s) => ({ ...s, status: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-white/70 text-sm block mb-1">Image URL</label>
                <input value={formData.image} onChange={(e) => setFormData((s) => ({ ...s, image: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
              </div>

              <div className="md:col-span-2">
                <label className="text-white/70 text-sm block mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData((s) => ({ ...s, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white h-24" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-white/5 text-white">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-gold text-primary">{formMode === "add" ? "Add Category" : "Save Changes"}</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-50 w-full max-w-lg bg-primary rounded-2xl p-6">
            <h3 className="font-poppins font-semibold text-white text-lg">Delete Category</h3>
            <p className="text-white/70 mt-2">Are you sure you want to delete "{deleteTarget.name}"?</p>
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
