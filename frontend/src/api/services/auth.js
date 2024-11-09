import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchData } from "./fetchData";
import useAuthStore from "../store/authStore";
import useUserDataStore from "../store/userStore";
import { toast } from "sonner";
import { t } from 'i18next';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const setUserData = useUserDataStore((state) => state.setUserData);

  return useMutation({
    mutationFn: async (data) => {
      const responseData = await fetchData("api/token/", "POST", {
        username: data.emailOrPhone,
        password: data.password,
      });

      const userData = await fetchData(
        "user/me/",
        "GET",
        null,
        responseData.access
      );

      return { tokens: responseData, userData };
    },
    onSuccess: (data) => {
      login(data.tokens.access, data.tokens.refresh);
      setUserData(data.userData);
      queryClient.setQueryData(["user"], data.userData);
      toast.success(t("auth.loginSuccess"), { duration: 1500 });
      navigate("/matches");
    },
    onError: (error) => {
      console.error("Error de inicio de sesión:", error);
      if (error.message === "Credenciales inválidas") {
        toast.error(t("auth.invalidCredentials"), {
          description: t("auth.tryAgain"),
          duration: 2500,
        });
      } else {
        toast.error("Error de inicio de sesión: " + error.message);
      }
    },
  });
};

export const useRegister = (onSwitchToLogin) => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (data) => {
      return await fetchData("user/register/", "POST", {
        full_name: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password2: data.confirmPassword,
      });
    },
    onSuccess: (responseData) => {
      login(responseData);
      onSwitchToLogin();
      toast.success(t("auth.registerSuccess"));
    },
    onError: (error) => {
      toast.error("Error de registro: " + error.message);
    },
  });
};
