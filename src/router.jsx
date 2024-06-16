import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShopLayout from "@/layouts/ShopLayout";

import ShopMainView from "@/views/shop/ShopMainView";
import ProductsFilteredView from "@/views/shop/ProductsFilteredView";
import ProductDetailView from "@/views/shop/ProductDetailView";
import CartView from "@/views/shop/CartView";
import CheckoutView from "@/views/shop/CheckoutView";
import OrderCreatedSuccessfullyView from "@/views/shop/OrderCreatedSuccessfullyView";
import OrderDetailView from "@/views/shop/OrderDetailView";

import UserOrdersView from "@/views/shop/UserOrdersView";
import UserDataView from "@/views/shop/UserDataView";
import UserChangePasswordView from "@/views/shop/UserChangePasswordView";

import CreateProductCategoryView from "@/views/admin/CreateProductCategoryView";
import ListProductCategoriesView from "@/views/admin/ListProductCategoriesView";
import UpdateProductCategoryView from "@/views/admin/UpdateProductCategoryView";
import CreateProductView from "@/views/admin/CreateProductView";
import ListProductsView from "@/views/admin/ListProductsView";
import UpdateProductView from "@/views/admin/UpdateProductView";
import ListUsersView from "@/views/admin/ListUsersView";
import UserDetailView from "@/views/admin/UserDetailView";
import ListOrdersView from "@/views/admin/ListOrdersView";
import DashboardView from "@/views/admin/DashboardView";

import LoginView from "@/views/auth/LoginView";
import RegisterView from "@/views/auth/RegisterView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ShopLayout />}>
          <Route path="/" element={<ShopMainView />} />
          <Route path="/products" element={<ProductsFilteredView />} />
          <Route path="/products/:id/detail" element={<ProductDetailView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/checkout" element={<CheckoutView />} />
          <Route
            path="/orderSuccess"
            element={<OrderCreatedSuccessfullyView />}
          />
          <Route path="/orders/:id/view" element={<OrderDetailView />} />

          <Route path="/account/orders" element={<UserOrdersView />} />
          <Route path="/account/data" element={<UserDataView />} />
          <Route
            path="/account/change_password"
            element={<UserChangePasswordView />}
          />

          <Route
            path="/admin/productCategories/create"
            element={<CreateProductCategoryView />}
          />
          <Route
            path="/admin/productCategories"
            element={<ListProductCategoriesView />}
          />
          <Route
            path="/admin/productCategories/:id/update"
            element={<UpdateProductCategoryView />}
          />
          <Route
            path="/admin/products/create"
            element={<CreateProductView />}
          />
          <Route path="/admin/products" element={<ListProductsView />} />
          <Route
            path="/admin/products/:id/update"
            element={<UpdateProductView />}
          />
          <Route path="/admin/users" element={<ListUsersView />} />
          <Route path="/admin/users/:id/detail" element={<UserDetailView />} />
          <Route path="/admin/orders" element={<ListOrdersView />} />
          <Route path="/admin/dashboard" element={<DashboardView />} />

          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
