import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <div className="flex flex-col gap-y-8 py-8 px-6 bg-white min-w-max">
      <h2 className="font-medium text-lg">Mi Cuenta</h2>
      <ul className="flex flex-col gap-y-6 pl-6">
        <li>
          <Link to={"/account/orders"}>Órdenes Recientes</Link>
        </li>
        <li>
          <Link to={"/account/data"}>Datos de Registro</Link>
        </li>
        <li>
          <Link to={"/account/change_password"}>Cambiar Password</Link>
        </li>
      </ul>
    </div>
  );
}
