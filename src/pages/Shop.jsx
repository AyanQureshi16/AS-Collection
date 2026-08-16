import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/shop/ProductCard";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import QuickView from "../components/ui/QuickView";
import { useProducts } from "../context/ProductContext";
import { useSettings } from "../context/SettingsContext";
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
  const { settings } = useSettings();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "default");
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  
  const currencySymbol = settings?.currencySymbol || "₨";
  const currency = settings?.currency || "PKR";

  const allProducts = useMemo(() => getCustomerVisibleProducts(products), [products]);

  const categoryOptions = useMemo(() => {
    const map = new Map();
    allProducts.forEach((product) => {
      const key = String(product.category || "uncategorized").toLowerCase();
      const label = product.category || "Uncategorized";
      if (!map.has(key)) map.set(key, { id: key, label });
    });
    return [{ id: "all", label: "All" }, ...Array.from(map.values())];
  }, [allProducts]);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSort(searchParams.get("sort") || "default");
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
      {/* Editorial header */}
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(201,168,106,0.05)_0%,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="eyebrow mb-6">{sort === "new" ? "New" : "Shop"}</p>
            <h1 className="section-title mb-6">{sort === "new" ? "New Arrivals" : "The Collection"}</h1>
            <p className="font-inter text-muted text-base md:text-lg leading-relaxed">
              {sort === "new" 
                ? "Discover our latest additions to the collection. Fresh timepieces just arrived, featuring cutting-edge designs and premium craftsmanship."
                : "Timepieces designed to make every moment count. Explore our curated selection of premium watches."
              }
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-10 pb-8 border-b border-white/[0.06]">
          <div className="relative flex-1 max-w-md">
            <Search size={16} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search timepieces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-luxury pl-11 pr-10 py-3 text-sm"
              id="shop-search"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ivory">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-luxury pr-10 appearance-none cursor-pointer min-w-[200px] py-3 text-sm"
              id="sort-select"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-surface">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-5 py-3 border border-white/[0.08] text-muted hover:text-ivory hover:border-white/20 transition-all text-sm font-inter"
          >
            <SlidersHorizontal size={16} strokeWidth={1.5} />
            Filters
          </button>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 text-[11px] font-inter tracking-widest uppercase transition-all border ${
                selectedCategory === cat.id
                  ? "bg-champagne text-ink border-champagne"
                  : "border-white/[0.08] text-muted hover:border-champagne/30 hover:text-ivory"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <div className="border border-white/[0.06] p-6 bg-surface">
                <h3 className="font-inter text-[10px] tracking-widest uppercase text-muted mb-6">Price Range</h3>
                <div className="space-y-4 max-w-md">
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-muted">{currencySymbol} {priceRange[0].toLocaleString()}</span>
                    <span className="text-champagne">{currencySymbol} {priceRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product count */}
        <p className="font-inter text-xs text-muted mb-8 tracking-wide">
          {filteredProducts.length} timepiece{filteredProducts.length !== 1 ? "s" : ""}
        </p>

        {/* Grid — editorial 3-column */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <h3 className="font-display text-2xl text-ivory mb-3">No Timepieces Found</h3>
            <p className="text-muted font-inter text-sm">Try adjusting your filters or search term.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex justify-center items-center gap-2 mt-16">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 font-inter text-xs transition-all border ${
                  currentPage === i + 1
                    ? "bg-champagne text-ink border-champagne"
                    : "border-white/[0.08] text-muted hover:border-champagne/30 hover:text-ivory"
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
