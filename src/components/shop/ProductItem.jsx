import { Link } from "react-router-dom";

export default function ProductItem({ product }) {
  return (
    <div className="w-[185px] flex flex-col gap-y-6">
      <img
        className="h-[240px] flex items-center justify-center object-contain bg-white"
        src={product.imageUrl}
        alt="imagen del producto"
      />
      <div className="flex flex-col gap-y-3">
        <p className="text-2xl">{product.name}</p>
        <Link
          className="text-sm underline"
          to={`/products/${product.id}/detail`}
        >
          Ver producto
        </Link>
      </div>
    </div>
  );
}
