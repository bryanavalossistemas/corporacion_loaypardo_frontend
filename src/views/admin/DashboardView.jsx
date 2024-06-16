import SideBar from "@/components/admin/SideBar";
import { formatCurrencyPeru, now } from "@/helpers";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function DashboardView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const createdAt = searchParams.get("createdAt");
  const [date, setDate] = useState(createdAt ? createdAt : now());
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  async function fetchOrdersAndUsers() {
    try {
      const responseOrders = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/createdAt?createdAt=${
          createdAt ? createdAt : now()
        }`
      );
      if (!responseOrders.ok) {
        throw new Error();
      }
      const orders = await responseOrders.json();
      setOrders(orders);

      const responseUsers = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/createdAt?createdAt=${
          createdAt ? createdAt : now()
        }`
      );
      if (!responseUsers.ok) {
        throw new Error();
      }
      const users = await responseUsers.json();
      setUsers(users);
    } catch (error) {
      toast.error("No se pudo obtener los productos o usuarios");
    }
  }

  useEffect(() => {
    fetchOrdersAndUsers();
  }, [date]);

  return (
    <main className="p-10">
      <div className="flex gap-x-8">
        <SideBar />
        <div className="flex-grow flex flex-col gap-y-4">
          <div className="flex justify-between items-center bg-lime-500 pl-6 pr-2 py-2">
            <h2 className="font-bold">Dashboard</h2>
            <div className="flex items-center gap-x-2">
              <span className="font-medium">Cambiar fecha o periodo</span>
              <input
                className="bg-primary text-white px-4 py-1.5"
                type="date"
                value={date}
                onChange={(e) => {
                  setSearchParams({ createdAt: e.target.value });
                  setDate(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex gap-x-4">
            <div className="basis-1/3 bg-white flex items-center justify-center py-16">
              <div className="flex flex-col gap-y-4">
                <h2 className="text-5xl text-center font-medium">
                  {orders.length}
                </h2>
                <p className="text-center">Órdenes del día de hoy</p>
              </div>
            </div>
            <div className="basis-1/3 bg-white flex items-center justify-center py-16">
              <div className="flex flex-col gap-y-4">
                <h2 className="text-5xl text-center font-medium">
                  {users.length}
                </h2>
                <p className="text-center">Usuarios Nuevos</p>
              </div>
            </div>
            <div className="basis-1/3 bg-white flex items-center justify-center py-16">
              <div className="flex flex-col gap-y-4">
                <h2 className="text-5xl text-center font-medium">
                  {formatCurrencyPeru(
                    orders.reduce((total, order) => total + order.total, 0)
                  )}
                </h2>
                <p className="text-center">Ingresos de hoy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
