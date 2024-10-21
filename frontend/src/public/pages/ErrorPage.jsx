import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const ErrorPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <main className="relative grid h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center z-10">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-blueWaki sm:text-4xl md:text-5xl">
        {t('errorPage.notFound')}
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#181818] sm:text-base md:text-lg">
        {t('errorPage.searchAnotherPage')}
        </p>

        <div className="mt-6">
          <button
            onClick={handleGoBack}
            className="rounded-md bg-purpleWaki px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t('errorPage.back')}
          </button>
        </div>
      </div>
    </main>
  );
};
