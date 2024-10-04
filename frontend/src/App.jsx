import { Routes, Route } from "react-router-dom";
import Home from "./public/pages/Home";
import Auth from "./public/pages/Auth";
import ErrorPage from "./public/pages/ErrorPage";

function App() {
  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
