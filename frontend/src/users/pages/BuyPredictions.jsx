import useLanguageStore from "@/api/store/language-store";
import { mercadoPago } from "@/common/assets";
import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { t } from "i18next";
import { MoveLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BuyPredictions = () => {
    const { currentLanguage } = useLanguageStore();
  return (
    <section className="mb-28">
      <Link to="/profile/my-predictions">
        <div className="p-4 flex flex-row items-center gap-x-2 text-blueWaki text-sm font-normal">
          <MoveLeft /> {t("navigation.prediction")}
        </div>
      </Link>
      <div className="p-2">
        <Card className="w-full max-w-md border-none shadow-none bg-transparent">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-[#181818]">
              {currentLanguage === "en" ? "Premium Predictions Package" : "Paquete de Predicciones Premium"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-4xl font-semibold text-[#181818]">$20.000 ARS</span>
              <span className="text-sm text-muted-foreground">{currentLanguage === "en" ? "/month" : "/mes"}</span>
            </div>
            <ul className="space-y-2 text-[#181818]">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {currentLanguage === "en" ? "10 daily predictions" : "10 predicciones diarias"}
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {currentLanguage === "en" ? "Higher chances of ranking up" : "Mejores chances de escalar en el ranking"}
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {currentLanguage === "en" ? "Be eligible for physical rewards" : "Calificar a los premios físicos"}
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-purpleWaki hover:bg-purple-700" disabled>
            {currentLanguage === "en" ? "Buy now": "Comprar ahora"}
            </Button>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-muted-foreground">
              {currentLanguage === "en" ? "Secure payment with" : "Pago seguro con"}
              </span>
              <img
                src={mercadoPago}
                alt="Mercado Pago"
                className="w-auto h-6 object-cover"
              />
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default BuyPredictions;
