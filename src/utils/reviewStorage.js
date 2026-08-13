const STORAGE_KEY = "as_collection_reviews";

const INITIAL_REVIEWS = [];

export const getStoredReviews = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) throw new Error("Stored reviews is not an array");
    return parsed;
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
    return INITIAL_REVIEWS;
  }
};

export const saveStoredReviews = (reviews) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (error) {
    // fail silently
  }
};

export const initStoredReviews = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
  }
};

export default { getStoredReviews, saveStoredReviews, initStoredReviews };
