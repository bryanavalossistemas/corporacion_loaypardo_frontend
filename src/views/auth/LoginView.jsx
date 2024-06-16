import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Heading from "@/components/auth/Heading";
import Input from "@/components/auth/Input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [submiting, setSubmiting] = useState(false);

  const navigate = useNavigate();

  async function login(e) {
    setSubmiting(true);
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (!response.ok) {
        setSubmiting(false);
        throw new Error();
      }
      const user = await response.json();
      setCurrentUser(user);
      navigate("/checkout");
      toast.success("Usuario logueado correctamente");
    } catch (error) {
      setSubmiting(false);
      toast.error("Error al loguear usuario");
    }
  }

  return (
    <main className="p-8">
      <div className="flex flex-col justify-center items-center gap-y-8 max-w-xs mx-auto">
        <Heading text="Ingreso para Clientes Registrados" />
        <form onSubmit={login} className="flex flex-col gap-y-4 w-full">
          <Input
            required
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <Button
            className="py-8 text-base rounded-none disabled:opacity-50"
            type="submit"
            disabled={submiting}
          >
            Ingresar
          </Button>
        </form>
        <div className="flex flex-col justify-center items-center gap-y-4">
          <Link className="underline" to={"/auth/forgot"}>
            Olvide mi password
          </Link>
          <Link className="underline" to={"/auth/register"}>
            No tengo cuenta, deseo registrarme
          </Link>
        </div>
      </div>
    </main>
  );
}
