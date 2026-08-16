import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Download, Plus, ChevronRight, X } from "lucide-react";
import ProductSummaryCard from "../../components/admin/ProductSummaryCard";
import StatusBadge from "../../components/admin/StatusBadge";
import StockBadge from "../../components/admin/StockBadge";
import ActionButtons from "../../components/admin/ActionButtons";
import Pagination from "../../components/admin/Pagination";
import EmptyState from "../../components/admin/EmptyState";
import LoadingSkeleton from "../../components/admin/LoadingSkeleton";
import { useProducts } from "../../context/ProductContext";
import { useCategories } from "../../context/CategoryContext";
import toast from "react-hot-toast";

export default function Products() {
  const {
    products,
    isLoading,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
  } = useProducts();
  const { categories } = useCategories();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Filters / Search / Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Modal / UI state
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // 'add' | 'edit'
  const [formData, setFormData] = useState({});
  const [viewProduct, setViewProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Reset page when search/filter/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, sortBy]);

  const categoryOptions = useMemo(() => {
    return Array.isArray(categories) ? categories.map((category) => category.name || category.title || category.label).filter(Boolean) : [];
  }, [categories]);

  const handleRefresh = () => {
    refreshProducts();
    toast.success("Products refreshed");
  };

  const filteredAndSorted = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    // Search
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => {
        return (
          (p.name || "").toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
        );
      });
    }

    // Category filter
    if (categoryFilter) {
      list = list.filter((p) => p.category === categoryFilter);
    }

    // Status filter
    if (statusFilter) {
      if (statusFilter === "Out of Stock") {
        list = list.filter((p) => p.status === "Out of Stock" || (p.stock || 0) === 0);
      } else {
        list = list.filter((p) => p.status === statusFilter);
      }
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        list.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case "oldest":
        list.sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
      case "price-asc":
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name-asc":
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "stock-asc":
        list.sort((a, b) => (a.stock || 0) - (b.stock || 0));
        break;
      case "stock-desc":
        list.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
      default:
        break;
    }

    return list;
  }, [products, searchQuery, categoryFilter, statusFilter, sortBy]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Adjust current page if out of range when products change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // Form helpers
  const openAddForm = () => {
    setFormMode("add");
    setFormData({
      name: "",
      category: "",
      brand: "",
      sku: "",
      price: "",
      salePrice: "",
      stock: 0,
      status: "Draft",
      featured: false,
      image: "",
      images: [""],
      description: "",
    });
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setFormMode("edit");
    setFormData({
      ...product,
      images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
    });
    setShowForm(true);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name || formData.name.trim() === "") errors.push("Product name is required");
    if (!formData.category || formData.category.trim() === "") errors.push("Category is required");
    const price = Number(formData.price);
    if (isNaN(price) || price < 0) errors.push("Price is required and must be >= 0");
    if (formData.salePrice !== "" && formData.salePrice !== null) {
      const sp = Number(formData.salePrice);
      if (isNaN(sp) || sp < 0) errors.push("Sale price must be >= 0");
      if (!isNaN(sp) && sp > price) errors.push("Sale price cannot be greater than price");
    }
    const stock = Number(formData.stock);
    if (isNaN(stock) || stock < 0) errors.push("Stock must be >= 0");

    // SKU uniqueness
    const skuVal = (formData.sku || "").trim();
    if (skuVal) {
      const conflict = products.some((p) => p.sku === skuVal && (formMode !== "edit" || p.id !== formData.id));
      if (conflict) errors.push("SKU must be unique");
    }

    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    // Prepare payload
    const payload = {
      name: formData.name,
      category: formData.category,
      brand: formData.brand,
      sku: formData.sku && formData.sku.trim() !== "" ? formData.sku.trim() : undefined,
      price: Number(formData.price) || 0,
      salePrice: formData.salePrice === "" || formData.salePrice === null ? null : Number(formData.salePrice),
      stock: Number(formData.stock) || 0,
      status: formData.status,
      featured: Boolean(formData.featured),
      image: formData.images?.[0] || formData.image || "",
      images: formData.images && formData.images.length > 0 ? formData.images : (formData.image ? [formData.image] : []),
      description: formData.description || "",
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (formMode === "add") {
      // Generate SKU if not provided
      if (!payload.sku) {
        const maxSkuNum = products.reduce((max, p) => {
          const match = (p.sku || "").match(/SKU-(\d+)/);
          return match ? Math.max(max, parseInt(match[1], 10)) : max;
        }, 0);
        payload.sku = `SKU-${String(maxSkuNum + 1).padStart(3, "0")}`;
      }

      const created = addProduct(payload);
      toast.success("Product added successfully");
      setShowForm(false);
      setCurrentPage(1);
    } else if (formMode === "edit") {
      // Ensure we don't attempt to change ID
      updateProduct(formData.id, payload);
      toast.success("Product updated successfully");
      setShowForm(false);
    }
  };

  const handleDelete = (product) => {
    setDeleteTarget(product);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    toast.success("Product deleted successfully");
    setDeleteTarget(null);
    // Adjust page after deletion
    setTimeout(() => {
      setCurrentPage((p) => Math.min(p, Math.max(1, Math.ceil((products.length - 1) / itemsPerPage))));
    }, 0);
  };

  const handleDuplicate = (product) => {
    const dup = duplicateProduct(product.id);
    if (dup) {
      toast.success("Product duplicated successfully");
      setCurrentPage(1);
    } else {
      toast.error("Unable to duplicate product");
    }
  };

  const toggleFeatured = (product) => {
    updateProduct(product.id, { featured: !product.featured });
    toast.success(product.featured ? "Removed from featured" : "Marked as featured");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/50 mb-1">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span>Products</span>
          </div>
          <h1 className="font-poppins font-bold text-white text-2xl">Products</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              id="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 w-64"
            />
          </div>

          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50 [&>option]:bg-primary"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50 [&>option]:bg-primary"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <select
            id="sort-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold/50 [&>option]:bg-primary"
          >
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="stock-asc">Stock: Low to High</option>
            <option value="stock-desc">Stock: High to Low</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="refresh-products-btn"
            onClick={handleRefresh}
            aria-label="Refresh products"
            title="Refresh products"
            className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <RefreshCw size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="export-products-btn"
            aria-label="Export products"
            title="Export products"
            className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Download size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="add-product-btn"
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-primary font-poppins font-semibold text-sm hover:bg-gold-light transition-all duration-200"
          >
            <Plus size={18} />
            Add Product
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass gold-border rounded-2xl overflow-hidden"
          >
            {isLoading ? (
              <div className="p-6">
                <LoadingSkeleton />
              </div>
            ) : totalItems === 0 ? (
              <div className="p-6">
                <EmptyState message={searchQuery || categoryFilter || statusFilter ? "No products match your search or filters" : undefined} onAdd={openAddForm} />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">
                          Featured
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">
                          Updated
                        </th>
                        <th className="text-right px-6 py-4 text-xs font-poppins font-semibold text-white/50 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSorted
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((product, index) => (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <p className="font-poppins font-semibold text-white text-sm line-clamp-1">
                                    {product.name}
                                  </p>
                                  <p className="text-white/50 text-xs font-inter">{product.brand}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-white/70 text-sm font-inter">{product.category}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-white/50 text-xs font-inter font-mono">{product.sku}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-poppins font-semibold text-gold text-sm">
                                  PKR {(product.salePrice || product.price).toLocaleString()}
                                </p>
                                {product.salePrice && (
                                  <p className="text-white/40 text-xs font-inter line-through">
                                    PKR {product.price.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <StockBadge stock={product.stock} />
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={product.status} />
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => toggleFeatured(product)}
                                aria-label={product.featured ? "Unfeature product" : "Feature product"}
                                title={product.featured ? "Unfeature product" : "Feature product"}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-poppins font-medium border ${product.featured ? "bg-gold/20 text-gold border-gold/30" : "bg-white/5 text-white/60 border-white/10"}`}
                              >
                                {product.featured ? "⭐ Featured" : "Mark"}
                              </button>
                            </td>
                             <td className="px-6 py-4">
                               <span className="text-white/50 text-xs font-inter">
                                 {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : product.lastUpdated || "N/A"}
                               </span>
                             </td>
                            <td className="px-6 py-4">
                              <ActionButtons
                                onView={() => setViewProduct(product)}
                                onEdit={() => openEditForm(product)}
                                onDuplicate={() => handleDuplicate(product)}
                                onDelete={() => handleDelete(product)}
                              />
                            </td>
                          </motion.tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 border-t border-white/5">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </>
            )}
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <ProductSummaryCard />
        </div>
      </div>

      {/* View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setViewProduct(null)} />
          <div className="relative z-50 w-full max-w-2xl bg-primary rounded-2xl p-6">
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-poppins font-semibold text-white text-lg">{viewProduct.name}</h3>
              <button onClick={() => setViewProduct(null)} aria-label="Close view" className="text-white/50">Close</button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <img src={viewProduct.image} alt={viewProduct.name} className="w-full h-48 object-cover rounded-lg md:col-span-1" />
              <div className="md:col-span-2">
                <p className="text-white/70">Brand: {viewProduct.brand}</p>
                <p className="text-white/70">Category: {viewProduct.category}</p>
                <p className="text-white/70">SKU: {viewProduct.sku}</p>
                <p className="text-white/70">Price: PKR {(viewProduct.price || 0).toLocaleString()}</p>
                {viewProduct.salePrice && <p className="text-white/70">Sale Price: PKR {(viewProduct.salePrice || 0).toLocaleString()}</p>}
                <p className="text-white/70">Stock: {viewProduct.stock}</p>
                <p className="text-white/70">Status: {viewProduct.status}</p>
                <p className="text-white/70">Featured: {viewProduct.featured ? "Yes" : "No"}</p>
                <p className="text-white/70 mt-3">{viewProduct.description}</p>
                <p className="text-white/50 text-xs mt-4">Created: {viewProduct.createdAt ? new Date(viewProduct.createdAt).toLocaleString() : "Unknown"}</p>
                <p className="text-white/50 text-xs">Updated: {viewProduct.updatedAt ? new Date(viewProduct.updatedAt).toLocaleString() : viewProduct.lastUpdated || "Unknown"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <form onSubmit={handleFormSubmit} className="relative z-50 w-full max-w-3xl bg-primary rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins font-semibold text-white text-lg">{formMode === "add" ? "Add Product" : "Edit Product"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-white/50">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-name" className="text-white/70 text-sm block mb-1">Name *</label>
                <input id="product-name" value={formData.name} onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
              </div>

              <div>
                <label htmlFor="product-category" className="text-white/70 text-sm block mb-1">Category *</label>
                <select
                  id="product-category"
                  value={formData.category || ""}
                  onChange={(e) => setFormData((s) => ({ ...s, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="product-brand" className="text-white/70 text-sm block mb-1">Brand</label>
                <input id="product-brand" value={formData.brand} onChange={(e) => setFormData((s) => ({ ...s, brand: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
              </div>

              <div>
                <label htmlFor="product-sku" className="text-white/70 text-sm block mb-1">SKU</label>
                <input id="product-sku" value={formData.sku} onChange={(e) => setFormData((s) => ({ ...s, sku: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono" />
              </div>

              <div>
                <label htmlFor="product-price" className="text-white/70 text-sm block mb-1">Price *</label>
                <input id="product-price" type="number" value={formData.price} onChange={(e) => setFormData((s) => ({ ...s, price: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
              </div>

              <div>
                <label htmlFor="product-sale-price" className="text-white/70 text-sm block mb-1">Sale Price</label>
                <input id="product-sale-price" type="number" value={formData.salePrice} onChange={(e) => setFormData((s) => ({ ...s, salePrice: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
              </div>

              <div>
                <label htmlFor="product-stock" className="text-white/70 text-sm block mb-1">Stock</label>
                <input id="product-stock" type="number" value={formData.stock} onChange={(e) => setFormData((s) => ({ ...s, stock: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
              </div>

              <div>
                <label htmlFor="product-status" className="text-white/70 text-sm block mb-1">Status</label>
                <select id="product-status" value={formData.status} onChange={(e) => setFormData((s) => ({ ...s, status: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white">
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="product-featured" className="text-white/70 text-sm">Featured</label>
                <input id="product-featured" type="checkbox" checked={Boolean(formData.featured)} onChange={(e) => setFormData((s) => ({ ...s, featured: e.target.checked }))} />
              </div>

              {/* Multi-Image Management */}
              <div className="md:col-span-2">
                <label className="text-white/70 text-sm block mb-2">Product Images</label>
                <div className="space-y-3">
                  {(formData.images || []).map((img, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        value={img}
                        onChange={(e) => {
                          const newImages = [...(formData.images || [])];
                          newImages[index] = e.target.value;
                          setFormData((s) => ({ ...s, images: newImages }));
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                        placeholder={`Image ${index + 1} URL`}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = (formData.images || []).filter((_, i) => i !== index);
                            setFormData((s) => ({ ...s, images: newImages }));
                          }}
                          className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm"
                        >
                          Remove
                        </button>
                      )}
                      {index === 0 && (
                        <span className="text-champagne text-xs px-2 py-1 bg-champagne/10 rounded">Primary</span>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData((s) => ({ ...s, images: [...(s.images || []), "" ] }))}
                    className="text-champagne text-sm hover:text-champagne/80 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Image
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="product-description" className="text-white/70 text-sm block mb-1">Description</label>
                <textarea id="product-description" value={formData.description} onChange={(e) => setFormData((s) => ({ ...s, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white h-24" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-white/5 text-white">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-gold text-primary">{formMode === "add" ? "Add Product" : "Save Changes"}</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-50 w-full max-w-lg bg-primary rounded-2xl p-6">
            <h3 className="font-poppins font-semibold text-white text-lg">Are you sure?</h3>
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
