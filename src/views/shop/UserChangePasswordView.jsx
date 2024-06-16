import SideBar from "@/components/shop/SideBar";
import TopBar from "@/components/admin/TopBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import Input from "@/components/auth/Input";
import { toast } from "sonner";

export default function UserChangePasswordView() {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [submiting, setSubmiting] = useState(false);

  async function changePassword(e) {
    try {
      e.preventDefault();
      setSubmiting(true);
      if (newPassword !== repeatPassword) {
        setSubmiting(false);
        toast.error("Las contraseñas no son iguales");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${currentUser.id}/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: currentPassword,
            newPassword: newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }
      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
      toast.success("Contraseña actualizada correctamente");
      setSubmiting(false);
    } catch (error) {
      setSubmiting(false);
      toast.error("Error al actualizar la contraseña");
    }
  }

  async function verifySession() {
    try {
      if (!currentUser) {
        navigate("/auth/login");
      }
      const responseUser = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${currentUser.id}`
      );
      if (!responseUser.ok) {
        navigate("/auth/login");
      }
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
            <TopBar text="CAMBIAR PASSWORD" />
            <div className="flex pt-4 justify-center">
              <form
                onSubmit={changePassword}
                className="flex flex-col gap-y-4 w-96"
              >
                <Input
                  type="password"
                  placeholder="Actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Nuevo"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Repetir"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                />
                <Button
                  className="py-8 text-lg rounded-none"
                  type="submit"
                  disabled={submiting}
                >
                  Cambiar
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
