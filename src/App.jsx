import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProductProvider } from "./context/ProductContext";
import { CategoryProvider } from "./context/CategoryContext";
import { OrderProvider } from "./context/OrderContext";
import { ReviewProvider } from "./context/ReviewContext";
import { MediaProvider } from "./context/MediaContext";
import { CustomerProvider } from "./context/CustomerContext";
import { SettingsProvider } from "./context/SettingsContext";
import ScrollToTop from "./utils/ScrollToTop";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import CategoriesAdmin from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Reviews from "./pages/admin/Reviews";
import Media from "./pages/admin/Media";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ProductProvider>
        <CategoryProvider>
          <OrderProvider>
            <ReviewProvider>
              <MediaProvider>
                <SettingsProvider>
                  <CustomerProvider>
                    <WishlistProvider>
                      <CartProvider>
                        <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                
                {/* Admin Routes */}
                <Route path="/local-admin/login" element={<AdminLogin />} />
                <Route
                  path="/local-admin"
                  element={
                    <ProtectedAdminRoute>
                      <AdminLayout />
                    </ProtectedAdminRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="categories" element={<CategoriesAdmin />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="reviews" element={<Reviews />} />
                  <Route path="media" element={<Media />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster
                position="bottom-center"
                toastOptions={{
                  style: {
                    background: "#111111",
                    color: "#F5F2EA",
                    border: "1px solid rgba(201,168,106,0.2)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                  },
                  iconTheme: { primary: "#C9A86A", secondary: "#080808" },
                }}
              />
            </CartProvider>
          </WishlistProvider>
        </CustomerProvider>
      </SettingsProvider>
      </MediaProvider>
    </ReviewProvider>
  </OrderProvider>
  </CategoryProvider>
  </ProductProvider>
    </Router>
  );
}

export default App;
