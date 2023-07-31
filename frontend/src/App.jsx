import { BrowserRouter, Routes, Route } from "react-router-dom";
//protect route components
import ProtectedRoutesComponents from "./components/ProtectedRoutesComponents";

//components
//footer and header
import FooterComponent from "./components/FooterComponent";
import HeaderComponent from "./components/HeaderComponent";
//user components
import RoutesWithUserChatComponent from "./components/user/RoutesWithUserChatComponent";

//Utilities
import ScrollToTop from './utils/ScrollToTop'


//unprotected pages
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import RegistrationPage from "./pages/RegistrationPage";
//protected user pages
import UserProfilePage from "./pages/user/UserProfilePage";
import UserOrdersPage from "./pages/user/UserOrdersPage";
import UserCartDetailsPage from "./pages/user/UserCartDetailsPage";
import UserOrderDetailsPage from "./pages/user/UserOrderDetailsPage";

//protected admin pages
// protected admin pages:
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminEditUserPage from "./pages/admin/AdminEditUserPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminCreateProductPage from "./pages/admin/AdminCreateProductPage";
import AdminEditProductPage from "./pages/admin/AdminEditProductPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import AdminChatsPage from "./pages/admin/AdminChatsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <HeaderComponent />
      <Routes>
        {/* Add chat box in these route */}
        <Route element={<RoutesWithUserChatComponent />}>
          {/* unprotected routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/product-list" element={<ProductListPage />} />
          <Route path="/product-list/:pageNumParam" element={<ProductListPage />} />
          <Route path="/product-list/category/:categoryName" element={<ProductListPage />} />
          <Route path="/product-list/category/:categoryName/:pageNumParam" element={<ProductListPage />} />
          <Route path="/product-list/search/:searchQuery" element={<ProductListPage />} />
          <Route path="/product-list/search/:searchQuery/:pageNumParam" element={<ProductListPage />} />
          <Route path="/product-list/category/:categoryName/search/:searchQuery" element={<ProductListPage />} />
          <Route path="/product-list/category/:categoryName/search/:searchQuery/:pageNumParam" element={<ProductListPage />} />
          <Route path="/product-details/:id" element={<ProductDetailsPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="*" element="Page not exists 404" />


          {/* user protected routes */}
          <Route element={<ProtectedRoutesComponents />}>
            <Route path="/user" element={<UserProfilePage />} />
            <Route path="/user/my-orders" element={<UserOrdersPage />} />
            <Route path="/user/cart-details" element={<UserCartDetailsPage />} />
            <Route path="/user/order-details/:id" element={<UserOrderDetailsPage />} />
          </Route>
        </Route>

        {/* admin protected routes: */}
        <Route element={<ProtectedRoutesComponents isAdminPage={true} />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/edit-user/:id" element={<AdminEditUserPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/create-new-product" element={<AdminCreateProductPage />}/>
          <Route path="/admin/edit-product/:id" element={<AdminEditProductPage />}/>
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/order-details/:id" element={<AdminOrderDetailsPage />}/>
          <Route path="/admin/chats" element={<AdminChatsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
