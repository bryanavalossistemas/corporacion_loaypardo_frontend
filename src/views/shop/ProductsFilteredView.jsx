import ProductFilteredItem from "@/components/shop/ProductFilteredItem";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function ProductsFilteredView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");
  const orderByParam = searchParams.get("orderBy");
  const [products, setProducts] = useState([]);
  const [orderBy, setOrderBy] = useState("");

  async function fetchProductsByQueryAndOrderBy() {
    try {
      const responseProducts = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/query?query=${
          query ?? ""
        }&orderBy=${orderByParam ?? ""}`
      );
      if (!responseProducts.ok) {
        throw new Error();
      }
      const products = await responseProducts.json();
      setProducts(products);
    } catch (error) {
      toast.error("No se pudo obtener los productos");
    }
  }

  useEffect(() => {
    fetchProductsByQueryAndOrderBy();
  }, [orderBy]);

  return (
    <main className="pt-[11px] px-10 pb-[51px] text-xl">
      <div className="flex justify-end gap-x-4 items-center mb-[11px]">
        <label className="font-bold" htmlFor="orderBy">
          Ordernar Por:
        </label>
        <select
          value={orderBy}
          onChange={(e) => {
            setSearchParams({ query: query ?? "", orderBy: e.target.value });
            setOrderBy(e.target.value);
          }}
          className="text-slate-600 h-[46px] w-[243px] px-5 flex items-center"
          name="orderBy"
          id="orderBy"
        >
          <option disabled value={""}>
            -- Filtrar por --
          </option>
          <option value={"name"}>Nombre</option>
          <option value={"price"}>Precio</option>
        </select>
      </div>

      <div className="h-[52px] bg-slate-300 flex items-center px-[22px] mb-[15px]">
        <h1 className="font-bold">Resultados de Búsqueda</h1>
      </div>

      <div className="space-y-[23px] mb-[51px]">
        {products.map((product) => (
          <ProductFilteredItem key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
