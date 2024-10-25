import { Routes, Route } from "react-router-dom";
import UserLayout from "./common/components/layout/UserLayout";
import Home from "./public/pages/Home";
import { AuthPage } from "./public/pages/AuthPage";
import { ProtectedRoute } from "./common/components/ProtectedRoute";
import { ErrorPage } from "./public/pages/ErrorPage";
import { SplashScreenWrapper } from "./public/components/SplashScreen";
import {Players, Matches, Divisions, Profile, DivisionRewards, MyPredictions, PlayerDetails} from "@/users/pages/index";

const App = () => {  
  return (
    <div className="font-poppins bg-[#fcfcfc]">
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
            <Route path="/players/:id" element={<PlayerDetails />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/divisions" element={<Divisions />} />
            <Route path="/divisions/:leagueType" element={<DivisionRewards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/my-predictions" element={<MyPredictions/>} />
          </Route>
        </Route>

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App;
