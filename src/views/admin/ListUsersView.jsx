import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
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
import SideBar from "@/components/admin/SideBar";
import TopBar from "@/components/admin/TopBar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ListUsersView() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 4 });

  async function toggleActiveUser(id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${id}/active`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        toast.error("Error al cambiar el estado del usuario");
        throw new Error();
      }
      setUsers(
        users.map((user) => {
          if (user.id === id) {
            return {
              ...user,
              active: user.active === "Activo" ? "Inactivo" : "Activo",
            };
          }
          return user;
        })
      );
      toast.success("Estado del usuario cambiado correctamente");
    } catch (error) {
      toast.success("Error al cambiar el estado del usuario");
    }
  }

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => row.getValue("id"),
    },
    {
      accessorKey: "firstName",
      header: "Nombre",
      cell: ({ row }) => row.getValue("firstName"),
    },
    {
      accessorKey: "lastName",
      header: "Apellido",
      cell: ({ row }) => row.getValue("lastName"),
    },
    {
      accessorKey: "email",
      header: "Correo",
      cell: ({ row }) => row.getValue("email"),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Registro",
      cell: ({ row }) => row.getValue("createdAt"),
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
              to={`/admin/users/${row.getValue("id")}/detail`}
            >
              Ver
            </Link>
            |
            <button
              className="underline"
              onClick={() => toggleActiveUser(row.getValue("id"))}
            >
              {row.getValue("active") === "Activo" ? "Desactivar" : "Activar"}
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
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

  async function fetchUsers() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
    const users = await response.json();

    setUsers(
      users.map((user) => {
        return {
          ...user,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
          active: user.active ? "Activo" : "Inactivo",
        };
      })
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="p-10">
      <div className="flex gap-x-8">
        <SideBar />
        <div className="flex-grow flex flex-col gap-y-4">
          <TopBar text="USUARIOS REGISTRADOS" />
          <Input
            className="border-none rounded-none"
            type="search"
            placeholder="Buscar usuarios"
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
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
