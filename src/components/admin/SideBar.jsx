import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <div className="flex flex-col gap-y-8 py-8 px-6 bg-white min-w-max">
      <h2 className="font-medium text-lg">Admin</h2>
      <ul className="flex flex-col gap-y-6 pl-6">
        <li>
          <Link to={"/admin/dashboard"}>Dashboard</Link>
        </li>
        <li>
          <Link to={"/admin/users"}>Usuarios registrados</Link>
        </li>
        <li>
          <Link to={"/admin/products"}>Productos</Link>
        </li>
        <li>
          <Link to={"/admin/orders"}>Órdenes</Link>
        </li>
        <li>
          <Link to={"/admin/productCategories"}>Categorías</Link>
        </li>
      </ul>
    </div>
  );
}
