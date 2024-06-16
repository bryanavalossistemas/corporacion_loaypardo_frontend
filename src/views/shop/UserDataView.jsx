import SideBar from "@/components/shop/SideBar";
import TopBar from "@/components/admin/TopBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import Input from "@/components/auth/Input";
import { toast } from "sonner";

export default function UserDataView() {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submiting, setSubmiting] = useState(false);

  async function updateUser(e) {
    try {
      e.preventDefault();
      setSubmiting(true);
      const responseUser = await fetch(
        `http://localhost:4000/api/users/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
          }),
        }
      );

      if (!responseUser.ok) {
        setSubmiting(false);
        throw new Error();
      }
      setCurrentUser(await responseUser.json());
      setSubmiting(false);
      toast.success("Usuario actualizado correctamente");
    } catch (error) {
      setSubmiting(false);
      toast.error("Error al actualizar usuario");
    }
  }

  async function verifySession() {
    try {
      if (!currentUser) {
        navigate("/auth/login");
      }
      const responseUser = await fetch(
        `http://localhost:4000/api/users/${currentUser.id}`
      );
      if (!responseUser.ok) {
        navigate("/auth/login");
      }
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setEmail(currentUser.email);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    verifySession();
  }, []);

  return (
    <main className="p-10">
      <div className="flex gap-x-8">
        <SideBar />
        <div className="flex-grow flex flex-col">
          <div className="flex flex-col">
            <TopBar text="DATOS DE REGISTRO" />
            <div className="flex pt-4 justify-center">
              <form
                onSubmit={updateUser}
                className="flex flex-col gap-y-4 w-96"
              >
                <Input
                  placeholder="Nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  placeholder="Apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  className="py-8 text-lg rounded-none"
                  type="submit"
                  disabled={submiting}
                >
                  Actualizar
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
