import { formatCurrencyPeru } from "@/helpers";

export default function DisplayAmount({ amount }) {
  return (
    <div className="flex justify-end">
      <p className="mt-4 font-bold text-xl">
        Total: {formatCurrencyPeru(amount)}
      </p>
    </div>
  );
}
