import { Outlet } from "react-router-dom";
import Header from "@/components/shop/layout/Header";
import Footer from "@/components/shop/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function ShopLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Toaster position="bottom-center" />
      <Footer />
    </>
  );
}
