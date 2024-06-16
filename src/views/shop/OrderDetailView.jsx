import Heading from "@/components/shop/Heading";
import HeadingBar from "@/components/shop/HeadingBar";
import CheckoutCard from "@/components/shop/CheckoutCard";
import CheckoutInput from "@/components/shop/CheckoutInput";
import OrderItem from "@/components/shop/OrderItem";
import SummaryOrderItem from "@/components/shop/SummaryOrderItem";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatCurrencyPeru } from "@/helpers";

export default function OrderDetailView() {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);

  const [orderShippingMethods, setOrderShippingMethods] = useState([]);
  const [orderPaymentMethods, setOrderPaymentMethods] = useState([]);

  const [order, setOrder] = useState({
    firstDirection: "",
    secondDirection: "",
    district: "",
    city: "",
    country: "",
    orderShippingMethodId: "",
    orderPaymentMethodId: "",
    lastFourNumbersPay: "",
    subtotal: 0,
    tax: 0,
    shippingAmount: 0,
    total: 0,
    userId: 0,
    orderDetails: [],
    status: "",
  });

  async function cancelOrder(e) {
    try {
      e.preventDefault();
      const responseCancelOrder = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!responseCancelOrder.ok) {
        toast.error("Error al cancelar el pedido");
        throw new Error();
      }
      navigate("/account/orders");
      toast.success("Order cancelada correctamente");
    } catch (error) {
      toast.success("Error al cancelar el producto");
    }
  }

  async function verifySession() {
    try {
      if (!currentUser) {
        navigate("/auth/login");
      }
      const responseUser = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${currentUser.id}`
      );
      if (!responseUser.ok) {
        navigate("/auth/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchOrderShippingMethodsAndOrderPaymentMethodsAndOrder() {
    try {
      const responseOrderShippingMethods = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orderShippingMethods`
      );
      if (!responseOrderShippingMethods.ok) {
        throw new Error();
      }
      const orderShippingMethods = await responseOrderShippingMethods.json();
      setOrderShippingMethods(orderShippingMethods);

      const responseOrderPaymentMethods = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orderPaymentMethods`
      );
      if (!responseOrderPaymentMethods.ok) {
        throw new Error();
      }
      const orderPaymentMethods = await responseOrderPaymentMethods.json();
      setOrderPaymentMethods(orderPaymentMethods);

      const responseOrder = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}`
      );
      if (!responseOrder.ok) {
        throw new Error();
      }
      const order = await responseOrder.json();
      setOrder({
        ...order,
        orderPaymentMethodId: order.orderPaymentMethodId.toString(),
        orderShippingMethodId: order.orderShippingMethodId.toString(),
      });
    } catch (error) {
      toast.error("Error al obtener los métodos de envio o pagos o la orden");
    }
  }

  useEffect(() => {
    verifySession();
    fetchOrderShippingMethodsAndOrderPaymentMethodsAndOrder();
  }, []);

  return (
    <main>
      <form className="flex flex-col gap-y-4 py-4 px-10" onSubmit={cancelOrder}>
        <Heading text={`Detalles de Orden Nro ${order.id}`} />
        <HeadingBar text="Datos de Compra" />
        <div className="flex gap-x-4 justify-between items-center">
          <CheckoutCard className="h-[559px]" heading="Dirección de Envío">
            <div className="flex flex-col gap-y-[27px]">
              <CheckoutInput
                placeholder="Línea 1"
                value={order.firstDirection}
                onChange={(e) =>
                  setOrder({ ...order, firstDirection: e.target.value })
                }
                required
                disabled
              />
              <CheckoutInput
                placeholder="Línea 2"
                value={order.secondDirection}
                onChange={(e) =>
                  setOrder({ ...order, secondDirection: e.target.value })
                }
                required
                disabled
              />
              <CheckoutInput
                placeholder="Distrito"
                value={order.district}
                onChange={(e) =>
                  setOrder({ ...order, district: e.target.value })
                }
                required
                disabled
              />
              <CheckoutInput
                placeholder="Ciudad"
                value={order.city}
                onChange={(e) => setOrder({ ...order, city: e.target.value })}
                required
                disabled
              />
              <CheckoutInput
                placeholder="País"
                value={order.country}
                onChange={(e) =>
                  setOrder({ ...order, country: e.target.value })
                }
                required
                disabled
              />
            </div>
          </CheckoutCard>

          <CheckoutCard className="h-[559px]" heading="Pago">
            <div className="pl-[15px] flex flex-col gap-y-[29px] mb-[32px]">
              {orderPaymentMethods.map((orderPaymentMethod) => (
                <div
                  className="flex items-center gap-x-[17px]"
                  key={orderPaymentMethod.id}
                >
                  <input
                    type="radio"
                    name="orderPaymentMethod"
                    id={orderPaymentMethod.name}
                    value={orderPaymentMethod.id.toString()}
                    checked={
                      order.orderPaymentMethodId ===
                      orderPaymentMethod.id.toString()
                    }
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        orderPaymentMethodId: e.target.value,
                      })
                    }
                    required
                    disabled
                  />
                  <label htmlFor={orderPaymentMethod.name}>
                    Pago con {orderPaymentMethod.name}
                  </label>
                </div>
              ))}
            </div>

            {order.orderPaymentMethodId === "2" && (
              <div className="flex items-center justify-center text-lg font-semibold">
                Pago que termina en: *****{order.lastFourNumbersPay}
              </div>
            )}
          </CheckoutCard>
        </div>

        <HeadingBar text="Métodos de Envío" />

        <div className="flex items-center justify-center h-[68px] bg-white px-[69px] text-2xl">
          <div className="flex items-center gap-x-20">
            {orderShippingMethods.map((orderShippingMethod) => (
              <div
                className="flex items-center gap-x-[17px]"
                key={orderShippingMethod.id}
              >
                <input
                  type="radio"
                  name="orderShippingMethod"
                  id={orderShippingMethod.name}
                  value={orderShippingMethod.id.toString()}
                  checked={
                    order.orderShippingMethodId ===
                    orderShippingMethod.id.toString()
                  }
                  onChange={(e) =>
                    setOrder({
                      ...order,
                      orderShippingMethodId: e.target.value,
                    })
                  }
                  required
                  disabled
                />
                <label htmlFor={orderShippingMethod.name}>
                  {orderShippingMethod.name} -{" "}
                  {formatCurrencyPeru(orderShippingMethod.price)}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-x-4 justify-between items-center">
          <CheckoutCard className="h-[467px]" heading="Items en Pedido:">
            <div className="pl-[56px] pr-[17px] flex flex-col gap-y-[20px]">
              {order.orderDetails.map((item) => (
                <OrderItem key={item.id} item={item} />
              ))}
            </div>
          </CheckoutCard>

          <CheckoutCard className="h-[467px]" heading="Resumen de Orden">
            <div className="pl-[78px]">
              <div className="flex flex-col text-2xl gap-y-[17px]">
                <SummaryOrderItem title="Subtotal" amount={order.subtotal} />
                <SummaryOrderItem title="Envío" amount={order.shippingAmount} />
                <SummaryOrderItem title="Impuestos" amount={order.tax} />
                <SummaryOrderItem title="Total" amount={order.total} />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                disabled={order.status === "Cancelado"}
                className="mt-[87px] h-[60px] text-lg rounded-none px-14"
                type="submit"
              >
                CANCELAR PEDIDO
              </Button>
            </div>
            {order.status === "Cancelado" && (
              <span className="flex justify-center text-lg font-bold mt-3">
                Orden Cancelada
              </span>
            )}
          </CheckoutCard>
        </div>
      </form>
    </main>
  );
}
