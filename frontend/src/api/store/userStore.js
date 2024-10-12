import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserDataStore = create(
  persist(
    (set) => ({
      user: null, 
      setUserData: (userData) => {
        const { data } = userData;
        set({ user: data });
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserDataStore;