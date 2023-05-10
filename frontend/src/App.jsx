import { BrowserRouter, Routes, Route } from "react-router-dom";
//protect route components
import ProtectedRoutesComponents from "./components/ProtectedRoutesComponents";

//pages
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import RegistrationPage from "./pages/RegistrationPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import UserOrdersPage from "./pages/user/UserOrdersPage";
import UserCartDetailsPage from "./pages/user/UserCartDetailsPage";
import UserOrderDetailsPage from "./pages/user/UserOrderDetailsPage";

function App() {
  return (
    //render based on URLpath
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/product-list" element={<ProductListPage />} />
        <Route path="/product-detail/:id" element={<ProductDetailsPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* user page route */}
        <Route element={<ProtectedRoutesComponents />}>
          <Route path="/user" element={<UserProfilePage />} />
          <Route path="/user/my-orders" element={<UserOrdersPage />} />
          <Route path="/user/cart-details" element={<UserCartDetailsPage />} />
          <Route path="/user/order-details" element={<UserOrderDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
