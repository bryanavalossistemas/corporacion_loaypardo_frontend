import ImageUpload from "@/components/admin/ImageUpload";
import SideBar from "@/components/admin/SideBar";
import TopBar from "@/components/admin/TopBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useReactTable,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreateSerieView() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [file, setFile] = useState();
  const [productCategory, setProductCategory] = useState({
    name: "",
    imageUrl: "",
    products: [],
  });
  const [products, setProducts] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

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
      accessorKey: "description",
      header: "Descripción",
      cell: ({ row }) => row.getValue("description"),
    },
    {
      id: "actions",
      header: () => <span className="flex justify-end">Acciones</span>,
      cell: ({ row }) => (
        <button
          className="underline w-full text-right"
          onClick={() => addToProductCategoryProducts(row.original)}
        >
          Agregar
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
  });

  function addToProductCategoryProducts(productSelected) {
    setProductCategory({
      ...productCategory,
      products: [...productCategory.products, productSelected],
    });
    setProducts(
      products.filter((product) => product.id !== productSelected.id)
    );
    toast.success("Producto agregado correctamente");
  }

  function removeFromProductCategoryProducts(productSelected) {
    setProducts([...products, productSelected]);
    setProductCategory({
      ...productCategory,
      products: productCategory.products.filter(
        (product) => product.id !== productSelected.id
      ),
    });
    toast.success("Producto removido correctamente");
  }

  async function createProductCategory(e) {
    try {
      setSubmiting(true);
      e.preventDefault();
      if (!file) {
        toast.error("Debe seleccionar una imagen para la categoría");
        setSubmiting(false);
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("cloud_name", "bryanavalossistemas");
      formData.append("upload_preset", "iouhxpsu");
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/bryanavalossistemas/upload",
        { method: "POST", body: formData }
      );
      if (!cloudinaryResponse) {
        setSubmiting(false);
        throw new Error();
      }
      const imageData = await cloudinaryResponse.json();
      const imageUrl = imageData.url;
      const response = await fetch(
        "http://localhost:4000/api/productCategories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: productCategory.name,
            imageUrl,
          }),
        }
      );
      if (!response.ok) {
        setSubmiting(false);
        throw new Error();
      }
      const productCategoryCreated = await response.json();
      const updatedProducts = productCategory.products.map((product) => {
        return fetch(`http://localhost:4000/api/products/${product.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productCategoryId: productCategoryCreated.id,
          }),
        });
      });
      await Promise.all([updatedProducts]);
      navigate("/admin/productCategories");
      toast.success("Categoría creada correctamente");
    } catch (error) {
      toast.error("Error al crear la categoría");
      setSubmiting(false);
    }
  }

  function onSelectFile(e) {
    if (!e.target.files || e.target.files.length === 0) {
      setFile();
      return;
    }
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    if (!file) {
      setProductCategory({ ...productCategory, imageUrl: "" });
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setProductCategory({ ...productCategory, imageUrl: objectUrl });
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:4000/api/products");
      if (!response.ok) {
        throw new Error();
      }
      const products = await response.json();
      setProducts(products);
    } catch (error) {
      toast.error("No se pudo obtener los productos");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="p-10">
      <form className="flex gap-x-8" onSubmit={createProductCategory}>
        <SideBar />
        <div className="grow flex flex-col gap-y-6">
          <TopBar text="AGREGAR CATEGORÍA" />
          <div className="flex-1 flex gap-x-6">
            <ImageUpload
              className="basis-5/12"
              src={productCategory.imageUrl}
              onSelectFile={onSelectFile}
            />
            <div className="basis-7/12 flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  className="h-9 rounded-none border-none"
                  type="text"
                  id="name"
                  value={productCategory.name}
                  onChange={(e) =>
                    setProductCategory({
                      ...productCategory,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="bg-lime-500 py-2 px-4 flex items-center justify-between">
                  <span className="font-medium">Productos en la categoría</span>
                  <Button
                    className="px-3 py-1.5 h-auto rounded-none"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    <Plus className="w-4 h-4" strokeWidth={3} />
                  </Button>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="min-w-[80vw] h-[70vh] flex flex-col">
                      <DialogHeader>
                        <DialogTitle>Agregar productos</DialogTitle>
                        <DialogDescription>
                          Agregue productos a la categoría.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-x-4">
                        <Input
                          type="search"
                          placeholder="Buscar producto"
                          value={table.getState().globalFilter ?? ""}
                          onChange={(event) =>
                            table.setGlobalFilter(event.target.value)
                          }
                        />
                      </div>
                      <div className="overflow-auto">
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
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="h-full max-h-[275.5px] overflow-auto bg-white py-2 px-4">
                  <Table className="">
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productCategory.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell className="text-right">
                            <button
                              className="underline"
                              onClick={() =>
                                removeFromProductCategoryProducts(product)
                              }
                            >
                              Remover
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="rounded-none px-8 py-6 disabled:opacity-50"
                  type="submit"
                  disabled={submiting}
                >
                  CREAR CATEGORÍA
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
