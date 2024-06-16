import SideBar from "@/components/admin/SideBar";
import TopBarWithAddButton from "@/components/admin/TopBarWithAddButton";
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
import { toast } from "sonner";

export default function ListProductsView() {
  const [products, setProducts] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 4 });

  async function toggleActiveProduct(id) {
    try {
      const response = await fetch(
        `http://localhost:4000/api/products/${id}/active`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        toast.error("Error al cambiar el estado del producto");
        throw new Error();
      }
      setProducts(
        products.map((product) => {
          if (product.id === id) {
            return {
              ...product,
              active: product.active === "Activo" ? "Inactivo" : "Activo",
            };
          }
          return product;
        })
      );
      toast.success("Estado del producto cambiado correctamente");
    } catch (error) {
      toast.success("Error al cambiar el estado del producto");
    }
  }

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => row.getValue("id"),
    },
    {
      accessorKey: "name",
      header: "Detalle",
      cell: ({ row }) => row.getValue("name"),
    },
    {
      accessorKey: "categoryName",
      header: "Categoría",
      cell: ({ row }) => row.getValue("categoryName"),
    },
    {
      accessorKey: "price",
      header: () => {
        return <span className="flex justify-end">Precio</span>;
      },
      cell: ({ row }) => {
        return (
          <span className="flex justify-end">
            {formatCurrencyPeru(row.getValue("price"))}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => {
        return <span className="flex justify-center">Fecha de Registro</span>;
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
      accessorKey: "stock",
      header: () => {
        return <span className="flex justify-center">Stock</span>;
      },
      cell: ({ row }) => {
        return (
          <span className="flex justify-center">{row.getValue("stock")}</span>
        );
      },
    },
    {
      accessorKey: "active",
      header: "Estado",
      cell: ({ row }) => row.getValue("active"),
    },
    {
      id: "actions",
      header: () => {
        return <span className="flex justify-center">Acciones</span>;
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-x-2 justify-center">
            <Link
              className="underline"
              to={`/admin/products/${row.getValue("id")}/update`}
            >
              Ver
            </Link>
            |
            <button
              className="underline"
              onClick={() => toggleActiveProduct(row.getValue("id"))}
            >
              {row.getValue("active") === "Activo" ? "Desactivar" : "Activar"}
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products,
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

  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:4000/api/products");
      const products = await response.json();
      const filteredProducts = products.map((product) => {
        return {
          ...product,
          createdAt: new Date(product.createdAt).toLocaleDateString(),
          active: product.active ? "Activo" : "Inactivo",
        };
      });
      setProducts(filteredProducts);
    } catch (error) {
      toast.error("No se pudo obtener los productos");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="p-10">
      <div className="flex gap-x-8">
        <SideBar />
        <div className="flex-grow flex flex-col gap-y-4">
          <TopBarWithAddButton
            title="PRODUCTOS"
            buttonText="Agregar Producto"
            src={"/admin/products/create"}
          />
          <Input
            className="rounded-none border-none"
            type="search"
            placeholder="Buscar productos"
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
