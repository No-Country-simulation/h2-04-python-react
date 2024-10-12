import PropTypes from "prop-types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/ui/form";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import useAuthStore from "@/api/store/authStore";
import PasswordInput from "./PasswordInput";
import { useState } from "react";
import { toast } from "sonner";
import { fetchData } from "@/api/services/fetchData";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .max(12, "El nombre de usuario debe tener como máximo 12 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    phone: z
      .string()
      .optional()
      .refine(
        (phone) => !phone || /^\+\d{10,15}$/.test(phone),
        "Número de teléfono inválido"
      ),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const RegisterForm = ({ onSwitchToLogin }) => {
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRegisterSubmit = async (data) => {
    setIsLoading(true);

    try {
      const responseData = await fetchData("user/register/", "POST", {
        full_name: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password2: data.confirmPassword,
      });
      login(responseData);
      onSwitchToLogin();
      toast.success("Registro exitoso! Por favor, inicia sesión.");
    } catch (error) {
      toast.error("Error de registro: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex flex-col gap-y-1">
          <span className="text-[22px] text-blueWaki font-semibold">
            Bienvenido a Waki,
          </span>
          <span className="text-zinc-500 text-sm">
            Crea tu cuenta completando los datos
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onRegisterSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username">
                    Nombre de usuario{" "}
                    <span className="text-red-400 text-xs">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="username"
                      {...field}
                      autoComplete="username"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">
                    Ingresa tu email{" "}
                    <span className="text-red-400 text-xs">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      id="email"
                      {...field}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl rules={{ required: false }}>
                    <PhoneInput
                      defaultCountry="AR"
                      international
                      withCountryCallingCode
                      value={field.value}
                      onChange={field.onChange}
                      className="phone-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PasswordInput
              control={form.control}
              name="password"
              htmlFor="loginPassword"
              label="Contraseña"
              span="*"
              id="loginPassword"
            />

            <PasswordInput
              control={form.control}
              name="confirmPassword"
              htmlFor="confirmPassword"
              label="Repetir contraseña"
              span="*"
              id="confirmPassword"
            />

            <div className="flex items-center justify-center">
              <Button
                type="submit"
                className="w-full max-w-36 bg-purpleWaki hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Registrarse"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {/* <div className="text-sm text-center">
          ¿Ya tienes una cuenta?{" "}
          <Button variant="link" onClick={onSwitchToLogin}>
            Iniciar Sesión
          </Button>
        </div> */}
        <div className="flex items-center w-full">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">O registrate con</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center space-x-2"
          disabled
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

RegisterForm.propTypes = {
  onSwitchToLogin: PropTypes.func,
};

export default RegisterForm;
