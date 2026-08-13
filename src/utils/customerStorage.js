const STORAGE_KEY = "as_collection_customers";

const INITIAL_CUSTOMERS = [];

export const getStoredCustomers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) throw new Error("Stored customers is not an array");
    return parsed;
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  }
};

export const saveStoredCustomers = (customers) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch (error) {
    // fail silently
  }
};

export const initStoredCustomers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
  }
};

export default { getStoredCustomers, saveStoredCustomers, initStoredCustomers };
