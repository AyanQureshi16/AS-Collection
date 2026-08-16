const STORAGE_KEY = "as_collection_products";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Obsidian Slim-Fit Kurta",
    category: "Men",
    brand: "AS Collection",
    sku: "SKU-001",
    price: 5000,
    salePrice: 4500,
    stock: 75,
    status: "Active",
    featured: true,
    lastUpdated: "2 hours ago",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"],
  },
  {
    id: 2,
    name: "Automatique Royale Watch",
    category: "Watches",
    brand: "AS Collection",
    sku: "SKU-002",
    price: 15000,
    salePrice: null,
    stock: 25,
    status: "Active",
    featured: true,
    lastUpdated: "5 hours ago",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&q=80",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
      "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&q=80",
    ],
  },
  {
    id: 4,
    name: "Silk Gharara Bridal",
    category: "Women",
    brand: "AS Collection",
    sku: "SKU-004",
    price: 15000,
    salePrice: null,
    stock: 0,
    status: "Out of Stock",
    featured: true,
    lastUpdated: "3 days ago",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=100&q=80",
    images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80"],
  },
  {
    id: 5,
    name: "Cashmere Wrap Shawl",
    category: "Women",
    brand: "AS Collection",
    sku: "SKU-005",
    price: 5000,
    salePrice: null,
    stock: 45,
    status: "Draft",
    featured: false,
    lastUpdated: "1 week ago",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=100&q=80",
    images: ["https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"],
  },
  {
    id: 6,
    name: "Skeleton Tourbillon Watch",
    category: "Watches",
    brand: "AS Collection",
    sku: "SKU-006",
    price: 25000,
    salePrice: 22000,
    stock: 12,
    status: "Active",
    featured: true,
    lastUpdated: "2 weeks ago",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=100&q=80",
    images: [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80",
      "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&q=80",
    ],
  },
  {
    id: 7,
    name: "Midnight Blue Sherwani",
    category: "Men",
    brand: "AS Collection",
    sku: "SKU-007",
    price: 18000,
    salePrice: null,
    stock: 30,
    status: "Active",
    featured: false,
    lastUpdated: "2 weeks ago",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&q=80",
    images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80"],
  },
  {
    id: 8,
    name: "Chronograph Prestige Watch",
    category: "Watches",
    brand: "AS Collection",
    sku: "SKU-008",
    price: 18500,
    salePrice: null,
    stock: 18,
    status: "Active",
    featured: true,
    lastUpdated: "1 week ago",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&q=80",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
      "https://images.unsplash.com/photo-1509941943102-10c232557cbd?w=800&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80",
    ],
  },
  {
    id: 9,
    name: "Classic Dive Watch",
    category: "Watches",
    brand: "AS Collection",
    sku: "SKU-009",
    price: 12000,
    salePrice: 10500,
    stock: 22,
    status: "Active",
    featured: true,
    lastUpdated: "3 days ago",
    image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=100&q=80",
    images: [
      "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&q=80",
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=800&q=80",
      "https://images.unsplash.com/photo-1509941943102-10c232557cbd?w=800&q=80",
    ],
  },
];

// Normalize product images to always return an array
export const getProductImages = (product) => {
  if (!product) return [];
  
  // If images array exists and is valid, use it
  if (Array.isArray(product.images) && product.images.length > 0) {
    const validImages = product.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
    if (validImages.length > 0) {
      // Remove duplicates
      return [...new Set(validImages)];
    }
  }
  
  // Fall back to single image field
  if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
    return [product.image];
  }
  
  return [];
};

export const getStoredProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      throw new Error("Stored products data is not an array");
    }
    return parsed;
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    // Fail silently in case storage limits or permissions restrict writes
  }
};

export const normalizeProductStock = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return 0;

    const numericFromString = Number(trimmed);
    if (Number.isFinite(numericFromString) && numericFromString >= 0) {
      return Math.max(0, numericFromString);
    }

    const digitsOnly = Number(trimmed.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(digitsOnly) && digitsOnly >= 0) {
      return Math.max(0, digitsOnly);
    }

    const lower = trimmed.toLowerCase();
    if (lower.includes("out of stock")) return 0;
    if (lower.includes("limited stock")) return 10;
    if (lower.includes("in stock")) return 999;

    return 0;
  }

  if (value === null || value === undefined) return 0;

  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? Math.max(0, numeric) : 0;
};

export const getProductStockStatus = (product, lowStockThreshold = 10) => {
  const stockValue = normalizeProductStock(product?.stock ?? product?.inventory ?? 0);
  if (stockValue <= 0) return "Out of Stock";
  if (stockValue <= Number(lowStockThreshold)) return "Limited Stock";
  return "In Stock";
};

export const initStoredProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  }
};
