import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <main className="relative grid h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center z-10">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          Página no encontrada
        </h1>
        <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base md:text-lg">
          Por favor, intenta buscar otra página.
        </p>

        <div className="mt-6">
          <button
            onClick={handleGoBack}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Volver
          </button>
        </div>
      </div>
    </main>
  );
};
