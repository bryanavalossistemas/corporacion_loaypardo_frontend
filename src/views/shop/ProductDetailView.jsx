import { formatCurrencyPeru } from "@/helpers";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/store";
import { Dot, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ProductDetaiView() {
  const params = useParams();
  const id = params.id;
  const [product, setProduct] = useState({
    productBrand: {},
    productCategory: {},
    productCharacteristics: [],
  });

  const addToCart = useStore((state) => state.addToCart);
  const [productItemQuantity, setProductItemQuantity] = useState(1);

  function handleAddToCart() {
    const newProductItem = {
      ...product,
      quantity: productItemQuantity,
    };
    addToCart(newProductItem);
    toast.success("Producto añadido al carrito correctamente");
    setProductItemQuantity(1);
  }

  async function fetchProduct() {
    try {
      const responseProduct = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );
      if (!responseProduct.ok) {
        throw new Error();
      }
      const product = await responseProduct.json();
      setProduct(product);
    } catch (error) {
      toast.error("Error al obtener el producto");
    }
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <main className="text-2xl pt-[15px] px-[40px] pb-[36px]">
      <h1 className="text-[32px] mb-[15px]">
        Titulo de Producto: {product.name}
      </h1>
      <p className="mb-[26px]">
        Por: <span className="font-bold">{product.productBrand.name}</span> -
        Serie: <span className="font-bold">{product.productCategory.name}</span>
      </p>
      <Separator className="bg-black h-[3px] mb-[56px]" />
      <div className="mb-[25px] flex justify-between gap-x-[50px]">
        <div className="bg-white w-full flex items-center justify-center">
          <img src={product.imageUrl} className="h-[641px] object-contain" />
        </div>
        <div className="min-w-[399px] flex flex-col items-center">
          <h2 className="min-h-[68px] flex items-center justify-center border-b w-full bg-white">
            DISPONIBLE
          </h2>
          <div className="flex flex-col px-[35px] w-full items-center pt-[48px] pb-[83px] bg-slate-300 h-full">
            <span className="font-bold text-5xl mb-[44px]">
              {formatCurrencyPeru(product.price)}
            </span>
            <Button
              className="mb-[64px] w-full h-[65px] rounded-none flex items-center justify-center text-[20px]"
              onClick={handleAddToCart}
            >
              AÑADIR AL CARRITO
            </Button>
            <span className="font-bold text-[20px] mb-[30px]">Cantidad:</span>
            <div className="flex items-center gap-x-[20px] mb-[70px]">
              <button className="flex items-center">
                <Minus
                  strokeWidth={2}
                  onClick={() => {
                    productItemQuantity !== 1 &&
                      setProductItemQuantity(productItemQuantity - 1);
                  }}
                />
              </button>
              <span className="w-[88px] h-[55.28px] font-bold text-[20px] flex items-center justify-center bg-white">
                {productItemQuantity}
              </span>
              <button className="flex items-center">
                <Plus
                  strokeWidth={2}
                  onClick={() => {
                    setProductItemQuantity(productItemQuantity + 1);
                  }}
                />
              </button>
            </div>
            <a className="font-bold text-[20px] underline" href="#">
              Ver métodos de envìo disponibles
            </a>
          </div>
        </div>
      </div>
      <div className="mb-[25px] text-2xl flex flex-col gap-y-[25px]">
        <h3 className="font-bold">Descripción</h3>
        <p>{product.description}</p>
      </div>
      {product.productCharacteristics.length !== 0 && (
        <div className="bg-slate-300 px-[25px] py-[25px]">
          <h3 className="font-bold text-2xl mb-[25px]">
            Características del Producto:
          </h3>
          <ul className="flex flex-col gap-y-[21px]">
            {product.productCharacteristics.map((productCharacteristic) => (
              <li
                key={productCharacteristic.id}
                className="flex items-center gap-x-[15px]"
              >
                <Dot size={48} strokeWidth={3} />
                <span>{productCharacteristic.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
