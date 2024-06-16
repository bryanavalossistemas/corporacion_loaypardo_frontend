import { formatCurrencyPeru } from "@/helpers";

export default function ItemInOrderItem({ cartItem }) {
  return (
    <div key={cartItem.id} className="flex gap-x-[13px]  text-2xl">
      <p className="flex-1">
        {cartItem.quantity} x {cartItem.name}
      </p>
      <span className="w-[146px]">
        {formatCurrencyPeru(cartItem.quantity * cartItem.price)}
      </span>
    </div>
  );
}
