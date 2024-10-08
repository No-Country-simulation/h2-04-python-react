import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import useAuthStore from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Este campo es requerido"),
  password: z.string().min(1, "Este campo es requerido"),
});

const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data) => {
    try {
      const userData = {
        id: Date.now(),
        emailOrPhone: data.emailOrPhone,
      };
      const token = "fake-jwt-token-" + Date.now();

      login(userData, token);

      console.log("Usuario autenticado:", userData);
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast("Error al iniciar sesión:", error);
    }
  };

  return (
    <Card className="border-none border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex flex-col gap-y-1">
          <span className="text-[22px] text-blueWaki font-semibold">
            Hola de nuevo,
          </span>
          <span className="text-zinc-500 text-sm">Por favor inicia sesión</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className="space-y-4"
          >
            <FormField
              control={loginForm.control}
              name="emailOrPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="emailOrPhone">
                    Ingresa tu email o teléfono
                  </FormLabel>
                  <FormControl>
                    <Input id="emailOrPhone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PasswordInput
              control={loginForm.control}
              name="password"
              htmlFor="loginPassword"
              label="Contraseña"
              id="loginPassword"
            />

            <div className="flex items-center justify-center">
              <Link
                to="#"
                className="text-blueWaki leading-[19px] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="flex items-center justify-center">
              <Button
                type="submit"
                className="w-full max-w-40 bg-purpleWaki hover:bg-purple-700"
              >
                Iniciar sesión
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex items-center w-full">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">
            O inicia sesión con
          </span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24px"
            height="24px"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          <span>Continuar con Google</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
