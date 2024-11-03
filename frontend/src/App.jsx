import { Routes, Route, useLocation } from "react-router-dom";
import UserLayout from "./common/components/layout/UserLayout";
import Home from "./public/pages/Home";
import { AuthPage } from "./public/pages/AuthPage";
import { ProtectedRoute } from "./common/components/ProtectedRoute";
import { ErrorPage } from "./public/pages/ErrorPage";
import { SplashScreenWrapper } from "./public/components/SplashScreen";
import {Players, Matches, Divisions, Profile, DivisionRewards, MyPredictions, PlayerDetails, MatchDetail, BuyPredictions} from "@/users/pages/index";
import { useEffect } from "react";

const App = () => { 
  const ScrollToTop = () => {
    const { pathname } = useLocation()
  
    useEffect(() => {
      window.scrollTo(0, 0)
    }, [pathname])
  
    return null
  }

  return (
    <div className="font-poppins">
      <ScrollToTop />
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
            <Route path="/profile/buy-predictions" element={<BuyPredictions />} />
            <Route path="/match/:slug/:id" element={<MatchDetail />} />
          </Route>
        </Route>

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App;
