import { useEffect, useState } from "react";
import SideBar from "@/components/admin/SideBar";
import TopBar from "@/components/admin/TopBar";
import { Link, useParams } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrencyPeru } from "@/helpers";

export default function UserDetailView() {
  const params = useParams();
  const id = params.id;
  const [user, setUser] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    createdAt: "",
  });
  const [orders, setOrders] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 3 });

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => row.getValue("id"),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Orden",
      cell: ({ row }) => row.getValue("createdAt"),
    },
    {
      accessorKey: "total",
      header: () => {
        return <span className="flex justify-end">Total</span>;
      },
      cell: ({ row }) => (
        <span className="flex justify-end">
          {formatCurrencyPeru(Number(row.getValue("total")))}
        </span>
      ),
    },
    {
      accessorKey: "products",
      header: () => {
        return <span className="flex justify-center">Productos</span>;
      },
      cell: ({ row }) => (
        <span className="flex justify-center">{row.getValue("products")}</span>
      ),
    },
    {
      accessorKey: "status",
      header: () => {
        return <span className="flex justify-center">Estado</span>;
      },
      cell: ({ row }) => (
        <span className="flex justify-center">{row.getValue("status")}</span>
      ),
    },
    {
      id: "actions",
      header: () => {
        return <span className="flex justify-end">Acciones</span>;
      },
      cell: ({ row }) => {
        return (
          <Link
            className="flex justify-end underline"
            to={`/account/orders/${row.getValue("id")}/detail`}
          >
            Ver
          </Link>
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      globalFilter,
    },
  });

  async function fetchUser() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`);
    const user = await response.json();
    console.log(user);
    setUser(user);
    setOrders(
      user.orders.map((order) => {
        return {
          ...order,
          createdAt: new Date(order.createdAt).toLocaleDateString(),
          products: order.orderDetails.length,
        };
      })
    );
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <main className="p-10">
      <div className="flex gap-x-8">
        <SideBar />
        <div className="flex-grow flex flex-col">
          <TopBar text="EDITAR PRODUCTO" />
          <div className="bg-white flex justify-between p-5">
            <div>
              <span className="font-medium">ID: </span>
              <span>{user.id}</span>
            </div>
            <div>
              <span className="font-medium">Nombre: </span>
              <span>
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div>
              <span className="font-medium">Correo: </span>
              <span>{user.email}</span>
            </div>
            <div>
              <span className="font-medium">Fecha de registro: </span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <TopBar text="ÓRDENES RECIENTES (máximo 10)" />
          <div className="w-full flex flex-col gap-y-3">
            <div className="bg-white">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No hay resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end">
              <div className="space-x-2">
                <Button
                  className="rounded-none border-none"
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Anterior
                </Button>
                <Button
                  className="rounded-none border-none"
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
