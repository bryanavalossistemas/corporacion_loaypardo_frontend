import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import ProductCategoryItem from "@/components/shop/ProductCategoryItem";
import ProductItem from "@/components/shop/ProductItem";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Input from "@/components/auth/Input";

export default function ShopMainView() {
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  async function fetchProductCategoriesAndFetchProducts() {
    try {
      const responseProductCategories = await fetch(
        `${import.meta.env.VITE_API_URL}/api/productCategories`
      );
      if (!responseProductCategories.ok) {
        throw new Error();
      }
      const productCategories = await responseProductCategories.json();
      setProductCategories(productCategories);

      const responseProducts = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/active`
      );
      if (!responseProducts.ok) {
        throw new Error();
      }
      const products = await responseProducts.json();
      setProducts(products);
    } catch (error) {
      toast.error("Error al obtener las categorias o productos");
    }
  }

  useEffect(() => {
    fetchProductCategoriesAndFetchProducts();
  }, []);

  return (
    <main className="pt-10 pb-24">
      <div className="px-16">
        <div className="flex items-center gap-x-3 mb-10 h-14">
          <Input
            className="flex-1 h-full rounded-none border-none text-base px-6"
            type="text"
            placeholder="Buscar productos ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Link className="h-full " to={`/products?query=${query}`}>
            <Button className="h-full px-14 rounded-none text-lg" type="button">
              Buscar
            </Button>
          </Link>
        </div>

        <div className="flex justify-between mb-16">
          {productCategories.slice(3, 6).map((productCategory) => (
            <ProductCategoryItem
              key={productCategory.id}
              productCategory={productCategory}
            />
          ))}
        </div>

        <div className="flex justify-between mb-7">
          {products.slice(5, 10).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-between mb-11">
          {products.slice(10, 15).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>

      <Separator className="bg-black h-2.5 mb-11" />

      <div className="px-16">
        <h2 className="text-3xl uppercase mb-12">Nuevos</h2>

        {productCategories.length >= 3 && (
          <div className="h-[539px] flex gap-x-6 mb-9">
            <div className="flex flex-col flex-1 gap-y-9">
              <img
                className="h-[400px] flex justify-center items-center bg-white object-contain"
                src={productCategories[0]?.imageUrl}
              />
              <div className="flex flex-col gap-y-4">
                <p className="text-2xl">{productCategories[0]?.name}</p>
                <Link
                  className="text-sm underline"
                  to={`/productCategories/${productCategories[0]?.id}/detail`}
                >
                  Ver categoría
                </Link>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-y-5">
              <div className="flex flex-col gap-y-4">
                <img
                  className="h-[186px] flex justify-center items-center object-contain bg-white"
                  src={productCategories[1]?.imageUrl}
                />
                <div className="flex flex-col gap-y-1">
                  <p className="text-2xl">{productCategories[1]?.name}</p>
                  <Link
                    className="text-sm underline"
                    to={`/productCategories/${productCategories[1]?.id}/detail`}
                  >
                    Ver categoría
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-y-4">
                <img
                  className="h-[186px] flex justify-center items-center bg-white object-contain"
                  src={productCategories[2]?.imageUrl}
                />
                <div className="flex flex-col gap-y-1">
                  <p className="text-2xl">{productCategories[2]?.name}</p>
                  <Link
                    className="text-sm underline"
                    to={`/productCategories/${productCategories[2]?.id}/detail`}
                  >
                    Ver categoría
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          {products.slice(0, 5).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
