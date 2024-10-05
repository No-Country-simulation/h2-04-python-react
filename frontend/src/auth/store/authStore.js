import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
    //modificar lo necesario luego de conectar con back
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: (userData, token) =>
        set({
          user: userData,
          isAuthenticated: true,
          token: token,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
