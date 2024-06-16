import { formatCurrencyPeru } from "@/helpers";
import { useStore } from "@/store";

export default function SavedItem({ savedItem }) {
  const changeQuantitySavedItems = useStore(
    (state) => state.changeQuantitySavedItems
  );

  const addToCart = useStore((state) => state.addToCart);

  const deleteToSavedItems = useStore((state) => state.deleteToSavedItems);

  const subTotal = savedItem.price * savedItem.quantity;

  function moveToCart() {
    addToCart(savedItem);
    deleteToSavedItems(savedItem);
  }

  return (
    <div className="bg-white h-[179px] flex items-center pl-[22px] pr-[40px] justify-between py-[29px] shadow-xl">
      <div className="w-[143px]">
        <img className="object-cover" src={savedItem.imageUrl} alt="imagen del producto h-[121px]" />
      </div>
      <div className="w-[640px] flex flex-col h-full justify-between py-3">
        <p className="font-bold text-2xl">{savedItem.name}</p>
        <div className="flex gap-x-5">
          <button
            className="underline"
            onClick={() => deleteToSavedItems(savedItem)}
          >
            Eliminar
          </button>
          <span>|</span>
          <button className="underline" onClick={moveToCart}>
            Mover al carrito
          </button>
        </div>
      </div>
      <div className="h-full py-3">
        <select
          name="quantity"
          id="quantity"
          className="border border-slate-400 text-slate-600 w-[125px] h-[46px] px-4 font-bold text-xl"
          value={savedItem.quantity}
          onChange={(e) => changeQuantitySavedItems(savedItem, +e.target.value)}
        >
          {savedItem.quantity > 6
            ? Array.from({ length: savedItem.quantity }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))
            : Array.from({ length: 6 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
        </select>
      </div>
      <div className="w-[76px] h-full py-3 text-right">
        <p className="font-bold text-base">Precio</p>
        <span>{formatCurrencyPeru(savedItem.price)}</span>
      </div>
      <div className="w-[76px] h-full py-3 text-right">
        <p className="font-bold text-base">Precio</p>
        <span>{formatCurrencyPeru(subTotal)}</span>
      </div>
    </div>
  );
}
