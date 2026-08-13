import { createContext, useContext, useEffect, useReducer, useMemo } from "react";
import { useProducts } from "./ProductContext";
import { normalizeProductStock } from "../utils/productStorage";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "as_collection_cart";

const getProductImage = (product) => {
  if (Array.isArray(product?.images) && product.images.length > 0) return product.images[0];
  if (typeof product?.image === "string" && product.image) return product.image;
  return "";
};

const getProductPrice = (product) => {
  const basePrice = Number(product?.salePrice ?? product?.price ?? 0);
  if (Number.isFinite(basePrice) && basePrice >= 0) return basePrice;
  return Number(product?.price ?? 0);
};

const buildCartItem = (product, selectedSize = "", quantity = 1) => ({
  id: product.id,
  productId: product.id,
  name: product.name,
  price: getProductPrice(product),
  image: getProductImage(product),
  imageUrl: getProductImage(product),
  selectedSize: selectedSize || "",
  quantity: Number(quantity) || 1,
  stock: normalizeProductStock(product?.stock ?? product?.inventory ?? 0),
  category: product.category,
});

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, selectedSize, quantity = 1 } = action.payload;
      const cartItem = buildCartItem(product, selectedSize, quantity);
      const existingIndex = state.findIndex(
        (item) => String(item.id) === String(product.id) && String(item.selectedSize || "") === String(selectedSize || "")
      );

      if (existingIndex >= 0) {
        return state.map((item, index) =>
          index === existingIndex ? { ...item, quantity: Number(item.quantity || 0) + Number(cartItem.quantity || 1) } : item
        );
      }

      return [...state, cartItem];
    }

    case "REMOVE_ITEM": {
      const { id, selectedSize } = action.payload;
      return state.filter((item) => {
        const sameId = String(item.id) === String(id);
        const sameSize = String(item.selectedSize || "") === String(selectedSize || "");
        return !(sameId && (selectedSize === undefined || sameSize));
      });
    }

    case "UPDATE_QUANTITY": {
      const { id, selectedSize, quantity } = action.payload;
      if (Number(quantity) <= 0) {
        return state.filter((item) => !(String(item.id) === String(id) && String(item.selectedSize || "") === String(selectedSize || "")));
      }

      return state.map((item) =>
        String(item.id) === String(id) && String(item.selectedSize || "") === String(selectedSize || "")
          ? { ...item, quantity: Number(quantity) }
          : item
      );
    }

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { products } = useProducts();
  const [cartItems, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // fail silently on storage constraints
    }
  }, [cartItems]);

  const getAvailableStock = useMemo(() => {
    const productMap = new Map();
    products.forEach((product) => {
      productMap.set(String(product.id), product);
    });

    return (item) => {
      const liveProduct = productMap.get(String(item.productId ?? item.id));
      if (!liveProduct) return Number(item.stock || 0);
      return normalizeProductStock(liveProduct?.stock ?? liveProduct?.inventory ?? 0);
    };
  }, [products]);

  const addToCart = (product, selectedSize = "", quantity = 1) => {
    if (!product) return false;

    const safeQuantity = Number(quantity) || 1;
    const availableStock = normalizeProductStock(product?.stock ?? product?.inventory ?? 0);
    const currentQty = cartItems.find((item) => String(item.id) === String(product.id) && String(item.selectedSize || "") === String(selectedSize || ""))?.quantity || 0;

    if (availableStock <= 0) {
      return false;
    }

    if (currentQty + safeQuantity > availableStock) {
      return false;
    }

    dispatch({ type: "ADD_ITEM", payload: { product, selectedSize, quantity: safeQuantity } });
    return true;
  };

  const removeFromCart = (id, selectedSize) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, selectedSize } });
  };

  const updateQuantity = (id, selectedSize, quantity) => {
    const item = cartItems.find((entry) => String(entry.id) === String(id) && String(entry.selectedSize || "") === String(selectedSize || ""));
    if (!item) return false;

    const nextQty = Number(quantity) || 1;
    const availableStock = getAvailableStock(item);

    if (nextQty <= 0) {
      removeFromCart(id, selectedSize);
      return true;
    }

    if (nextQty > availableStock) {
      return false;
    }

    dispatch({ type: "UPDATE_QUANTITY", payload: { id, selectedSize, quantity: nextQty } });
    return true;
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  const isInCart = (id, selectedSize = "") =>
    cartItems.some((item) => String(item.id) === String(id) && String(item.selectedSize || "") === String(selectedSize || ""));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getAvailableStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
