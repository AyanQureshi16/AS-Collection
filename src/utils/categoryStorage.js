const STORAGE_KEY = "as_collection_categories";

const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: "Men",
    slug: "men",
    description: "Luxury essentials and elevated everyday wear for men.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&q=80",
    status: "Active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Women",
    slug: "women",
    description: "Elegant silhouettes and statement pieces for women.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&q=80",
    status: "Active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 3,
    name: "Watches",
    slug: "watches",
    description: "Precision-crafted timepieces with timeless appeal.",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=100&q=80",
    status: "Active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

export const getStoredCategories = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      throw new Error("Stored categories data is not an array");
    }
    if (parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return parsed;
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
};

export const saveStoredCategories = (categories) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    // Fail silently
  }
};

export const initStoredCategories = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data || JSON.parse(data).length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    }
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
  }
};

export default {
  getStoredCategories,
  saveStoredCategories,
  initStoredCategories,
};
