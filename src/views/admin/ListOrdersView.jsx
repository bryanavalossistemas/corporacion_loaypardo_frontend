import SideBar from "@/components/admin/SideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyPeru } from "@/helpers";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "@/components/admin/TopBar";

export default function ListOrdersView() {
  const [orders, setOrders] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 4 });

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => row.getValue("id"),
    },
    {
      accessorKey: "userName",
      header: "Usuario",
      cell: ({ row }) => row.getValue("userName"),
    },
    {
      accessorKey: "createdAt",
      header: () => {
        return <span className="flex justify-center">Fecha de Order</span>;
      },
      cell: ({ row }) => {
        return (
          <span className="flex justify-center">
            {row.getValue("createdAt")}
          </span>
        );
      },
    },
    {
      accessorKey: "total",
      header: () => {
        return <span className="flex justify-end">Total</span>;
      },
      cell: ({ row }) => {
        return (
          <span className="flex justify-end">
            {formatCurrencyPeru(row.getValue("total"))}
          </span>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Correo",
      cell: ({ row }) => row.getValue("email"),
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
          <div className="flex justify-end">
            <Link
              className="underline"
              to={`/orders/${row.getValue("id")}/view`}
            >
              Ver
            </Link>
          </div>
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

  async function fetchProductCategories() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`);
      const orders = await response.json();
      console.log(orders);
      const filteredOrders = orders.map((order) => {
        return {
          ...order,
          userName: order.user.firstName + " " + order.user.lastName,
          createdAt: new Date(order.createdAt).toLocaleDateString(),
          email: order.user.email,
        };
      });
      setOrders(filteredOrders);
    } catch (error) {
      toast.error("No se pudo obtener las categorías");
    }
  }

  useEffect(() => {
    fetchProductCategories();
  }, []);

  return (
    <main className="p-10">
      <div className="flex gap-x-8">
        <SideBar />
        <div className="flex-grow flex flex-col gap-y-4">
          <TopBar text="ÓRDENES" />
          <Input
            className="rounded-none border-none"
            type="search"
            placeholder="Buscar orden"
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
          <div className="flex-1 w-full flex flex-col gap-y-3">
            <div className="flex-1 bg-white">
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
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
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
