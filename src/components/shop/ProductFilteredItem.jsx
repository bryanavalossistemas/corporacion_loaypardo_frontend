import { formatCurrencyPeru } from "@/helpers";
import { Link } from "react-router-dom";

export default function ProductFilteredItem({ product }) {
  return (
    <Link
      className="flex px-[22px] py-[29px] gap-x-[61px] shadow-md bg-white"
      to={`/products/${product.id}/detail`}
    >
      <img
        className="w-[143px] h-[121px] flex justify-center items-center object-contain"
        src={product.imageUrl}
        alt="iamgen del producto"
      />
      <div className="flex flex-col">
        <p className="font-bold">{product.name}</p>
        <span className="text-lg">
          Por: {product.productBrand.name} - Serie:{" "}
          {product.productCategory.name}
        </span>
        <span className="text-4xl font-bold">
          {formatCurrencyPeru(product.price)}
        </span>
      </div>
    </Link>
  );
}
