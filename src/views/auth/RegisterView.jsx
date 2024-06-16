import Input from "@/components/auth/Input";
import Heading from "@/components/auth/Heading";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function RegisterView() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  async function createUser(e) {
    try {
      e.preventDefault();
      if (password !== repeatPassword) {
        toast.error("Las contraseñas no son iguales");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      if (!response.ok) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setRepeatPassword("");
        throw new Error();
      }
      navigate("/auth/login");
      toast.success("Usuario creado correctamente");
    } catch (error) {
      toast.error("Error al crear usuario");
    }
  }

  return (
    <main className="p-8">
      <div className="flex flex-col justify-center items-center gap-y-8 max-w-md mx-auto">
        <Heading text="Registra una Nueva Cuenta" />
        <form onSubmit={createUser} className="flex flex-col gap-y-4 w-full">
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
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <Input
            type="password"
            placeholder="Repetir contraseña"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            minLength={6}
            required
          />
          <Button className="py-8 text-base rounded-none" type="submit">
            Crear Nueva Cuenta
          </Button>
        </form>
        <div className="flex flex-col justify-center items-center gap-y-4">
          <Link className="underline" to={"/auth/forgot"}>
            Olvide mi password
          </Link>
          <Link className="underline" to={"/auth/login"}>
            Tengo una cuenta, ingresar ahora
          </Link>
        </div>
      </div>
    </main>
  );
}
