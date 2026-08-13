const STORAGE_KEY = "as_collection_media";

const INITIAL_MEDIA = [];

export const getStoredMedia = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEDIA));
      return INITIAL_MEDIA;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) throw new Error("Stored media is not an array");
    return parsed;
  } catch (error) {
    // If data corrupt, reset to initial empty array to keep app functional
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEDIA));
    return INITIAL_MEDIA;
  }
};

export const saveStoredMedia = (media) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(media));
  } catch (error) {
    // fail silently
  }
};

export const initStoredMedia = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEDIA));
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEDIA));
  }
};

export default { getStoredMedia, saveStoredMedia, initStoredMedia };
