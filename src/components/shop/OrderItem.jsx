import { formatCurrencyPeru } from "@/helpers";

export default function ItemInOrderItem({ item }) {
  return (
    <div key={item.id} className="flex gap-x-[13px]  text-2xl">
      <p className="flex-1">
        {item.quantity} x {item.product.name}
      </p>
      <span className="w-[146px]">
        {formatCurrencyPeru(item.quantity * item.product.price)}
      </span>
    </div>
  );
}
