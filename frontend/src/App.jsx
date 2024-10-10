import { Routes, Route } from "react-router-dom";
import UserLayout from "./common/components/layout/UserLayout";
import Home from "./public/pages/Home";
import { AuthPage } from "./public/pages/AuthPage";
import { ProtectedRoute } from "./common/components/ProtectedRoute";
import { ErrorPage } from "./public/pages/ErrorPage";
import { SplashScreenWrapper } from "./public/components/SplashScreen";
import { Players, Matches, Divisions, Profile } from "@/users/pages/index";

const App = () => {
  return (
    <div className="">
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/"
          element={
            <SplashScreenWrapper>
              <Home />
            </SplashScreenWrapper>
          }
        />
        <Route path="/auth" element={<AuthPage />} />

        {/* Rutas protegidas user */}
        <Route element={<UserLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/players" element={<Players />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/divisions" element={<Divisions />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App;
