import ProductItem from "@/components/shop/ProductItem";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function OrderCreatedSuccessfullyView() {
  const [products, setProducts] = useState([]);
  async function fetchProductCategoriesAndFetchProducts() {
    try {
      const responseProducts = await fetch(
        "http://localhost:4000/api/products/active"
      );
      if (!responseProducts.ok) {
        throw new Error();
      }
      const products = await responseProducts.json();
      setProducts(products);
    } catch (error) {
      toast.error("Error al obtener los productos");
    }
  }

  useEffect(() => {
    fetchProductCategoriesAndFetchProducts();
  }, []);

  return (
    <div className="flex p-[65px] flex-col">
      <h1 className="text-center text-[32px] mb-[65px]">
        ¡Muchas gracias por tu pedido!
      </h1>
      <p className="text-center text-[24px] mb-[65px]">
        Puedes ver el detalle y estado de tu pedido ingresando a{" "}
        <Link className="underline" to={"/account/orders"}>
          tu cuenta.
        </Link>
      </p>
      <h2 className="text-[32px] mb-[25px]">También de podría interesar...</h2>
      <div className="flex justify-between mb-7">
        {products.slice(0, 5).map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
