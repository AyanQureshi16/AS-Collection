import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown } from "lucide-react";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/shop/ProductCard";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import QuickView from "../components/ui/QuickView";
import { useProducts } from "../context/ProductContext";
import { getCustomerVisibleProducts } from "../data/products";

const ITEMS_PER_PAGE = 12;

const sortOptions = [
  { value: "default", label: "Featured" },
  { value: "new", label: "Newest First" },
  { value: "bestseller", label: "Best Sellers" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "default");
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const allProducts = useMemo(() => getCustomerVisibleProducts(products), [products]);

  const categoryOptions = useMemo(() => {
    const map = new Map();
    allProducts.forEach((product) => {
      const key = String(product.category || "uncategorized").toLowerCase();
      const label = product.category || "Uncategorized";
      if (!map.has(key)) {
        map.set(key, { id: key, label });
      }
    });
    return [{ id: "all", label: "All" }, ...Array.from(map.values())];
  }, [allProducts]);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sort, priceRange]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (selectedCategory !== "all") {
      result = result.filter((p) => String(p.category).toLowerCase() === selectedCategory.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sort) {
      case "new":
        result = result.sort((a, b) => (b.isNew === true) - (a.isNew === true) || Number(b.createdAt || 0) - Number(a.createdAt || 0));
        break;
      case "bestseller":
        result = result.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || Number(b.rating) - Number(a.rating));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      default:
        result = result.sort((a, b) => Number(b.featured || 0) - Number(a.featured || 0) || Number(b.isBestSeller || 0) - Number(a.isBestSeller || 0));
        break;
    }

    return result;
  }, [allProducts, search, selectedCategory, sort, priceRange]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Layout>
      {/* Page header */}
      <div className="pt-28 pb-10 section-glow border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gold font-inter text-xs tracking-[0.3em] uppercase mb-3"
          >
            Our Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-poppins font-black text-4xl md:text-5xl text-white mb-4"
          >
            Shop <span className="gold-text">All Products</span>
          </motion.h1>
          <p className="font-inter text-white/40 text-sm">
            {filteredProducts.length} products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-luxury pl-10 pr-10"
              id="shop-search"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-luxury pr-10 appearance-none cursor-pointer min-w-[180px]"
              id="sort-select"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-dark-50">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-lg border transition-all ${
                viewMode === "grid"
                  ? "border-gold/50 text-gold bg-gold/10"
                  : "border-white/10 text-white/40 hover:border-white/30"
              }`}
              aria-label="Grid view"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-lg border transition-all ${
                viewMode === "list"
                  ? "border-gold/50 text-gold bg-gold/10"
                  : "border-white/10 text-white/40 hover:border-white/30"
              }`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-white/60 hover:border-white/30 transition-all"
            >
              <SlidersHorizontal size={16} />
              <span className="text-sm font-inter">Filters</span>
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-poppins font-medium transition-all border ${
                selectedCategory === cat.id
                  ? "bg-gold text-primary border-gold"
                  : "border-white/10 text-white/50 hover:border-gold/30 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter drawer */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass gold-border rounded-2xl p-6">
                <h3 className="font-poppins font-semibold text-white mb-4">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-white/40">PKR {priceRange[0].toLocaleString()}</span>
                    <span className="text-gold font-semibold">PKR {priceRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-gold"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product grid */}
        {isLoading ? (
          <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-poppins font-bold text-white text-xl mb-2">No Products Found</h3>
            <p className="text-white/40 font-inter text-sm">
              Try adjusting your filters or search term.
            </p>
          </motion.div>
        ) : (
          <div
            className={`grid gap-5 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            <AnimatePresence>
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex justify-center items-center gap-2 mt-12">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full font-poppins font-semibold text-sm transition-all ${
                  currentPage === i + 1
                    ? "bg-gold text-primary"
                    : "border border-white/10 text-white/40 hover:border-gold/30 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </Layout>
  );
}
