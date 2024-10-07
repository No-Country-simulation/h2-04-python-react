import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "../auth/layouts";
import { AuthPage } from "../auth/pages";
import { AdminLayout } from "../admin/layouts/AdminLayout";
import { HomeLayout } from "@/home/layouts/HomeLayout";
import { HomePage } from "@/home/pages/HomePage";
import { ErrorPage } from "@/components/shared/pages";
import { SplashScreenWrapper } from "@/components/shared/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreenWrapper><HomeLayout /></SplashScreenWrapper>,
    children: [
      {
        index: true,
        path: "/",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "/auth",
        element: <AuthPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);