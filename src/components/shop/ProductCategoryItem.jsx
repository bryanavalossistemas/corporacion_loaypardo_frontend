import { Link } from "react-router-dom";

export default function ProductCategoryItem({ productCategory }) {
  return (
    <div className="w-[370px] flex flex-col gap-y-8">
      <img
        className="h-[370px] flex items-center justify-center object-contain"
        src={productCategory.imageUrl}
        alt="imagen del producto"
      />
      <div className="flex flex-col gap-y-3">
        <p className="text-2xl">{productCategory.name}</p>
        <Link
          className="text-sm underline"
          to={`/productCategories/${productCategory.id}/detail`}
        >
          Ver Categoría
        </Link>
      </div>
    </div>
  );
}
