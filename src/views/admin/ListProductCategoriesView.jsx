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
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ListProductCategoriesView() {
  const [productCategories, setProductCategories] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 4 });

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => row.getValue("id"),
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => row.getValue("name"),
    },
    {
      accessorKey: "createdAt",
      header: () => {
        return <span className="flex justify-center">Fecha de Creación</span>;
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
      accessorKey: "products",
      header: () => {
        return <span className="flex justify-center">Nro. Productos</span>;
      },
      cell: ({ row }) => {
        return (
          <span className="flex justify-center">
            {row.getValue("products")}
          </span>
        );
      },
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
              to={`/admin/productCategories/${row.getValue("id")}/update`}
            >
              Ver
            </Link>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: productCategories,
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/productCategories`
      );
      const productCategories = await response.json();
      const filteredProductCategories = productCategories.map(
        (productCategory) => {
          return {
            ...productCategory,
            createdAt: new Date(productCategory.createdAt).toLocaleDateString(),
          };
        }
      );
      setProductCategories(filteredProductCategories);
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
          <TopBarWithAddButton
            title="CATEGORÍAS"
            buttonText="Agregar Categoría"
            src={"/admin/productCategories/create"}
          />
          <Input
            className="rounded-none border-none"
            type="search"
            placeholder="Buscar categoría"
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
