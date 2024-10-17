/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { fetchData } from "@/api/services/fetchData";
import useAuthStore from "@/api/store/authStore";
import useUserDataStore from "@/api/store/userStore";
import { betIcon } from "@/common/assets";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/common/components/ui/sheet";
import { Ticket, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BetCoupon = ({ selections, setSelections, removeSelection }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user } = useUserDataStore();
  const [totalOdds, setTotalOdds] = useState(1);
  const [potentialEarning, setPotentialEarning] = useState(0);

  useEffect(() => {
    const newTotalOdds = selections.reduce(
      (total, selection) => total * parseFloat(selection.odds),
      1
    );
    setTotalOdds(newTotalOdds.toFixed(2));
    setPotentialEarning(Number((newTotalOdds * 10).toFixed(2)));
  }, [selections]);

  const realizarPrediccion = async () => {
    if (selections.length === 0) {
      toast.error(
        "Por favor, realiza al menos una selección antes de hacer tu predicción."
      );
      return;
    }

    const dataToSend = {
      user: user.id,
      bet_type: selections.length > 1 ? "combinada" : "simple",
      details: selections.map((selection) => ({
        match: selection.matchId,
        prediction_text: selection.selectedTeam,
        selected_odds: parseFloat(selection.odds),
        potential_gain: parseFloat(
          (parseFloat(selection.odds) * 10).toFixed(2)
        ),
      })),
    };

    console.log("Data being sent:", JSON.stringify(dataToSend, null, 2));

    try {
      const response = await fetchData(
        "prediccion/",
        "POST",
        dataToSend,
        accessToken
      );
      console.log("Full API response:", response);

      if (response.status_code !== 201) {
        console.error("API error response:", response.errors);
        throw new Error(
          `Error enviando la predicción: ${JSON.stringify(response.errors)}`
        );
      }

      console.log("Predicción enviada con éxito:", response.data);
      toast.success("¡Predicción realizada con éxito!");
      setSelections([]);
    } catch (error) {
      console.error("Error enviando predicción:", error);
      toast.error(
        `Ha ocurrido un error al enviar la predicción: ${error.message}`
      );
    }
  };

  const renderSelections = () => (
    <div className="space-y-2">
      {selections.map((selection, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-100 p-2 rounded"
        >
          <div>
            <div className="font-normal text-xs flex flex-row text-[#181818]">
              {selection.homeTeam}{" "}
              <img
                src={selection.homeTeamLogo}
                alt=""
                className="size-4 mx-1"
              />{" "}
              vs {selection.awayTeam}
              <img
                src={selection.awayTeamLogo}
                alt=""
                className="size-4 mx-1"
              />
            </div>
            <p className="text-xs text-[#555]">
              {selection.selectedTeam} - {selection.odds}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeSelection(index)}
          >
            <X className="size-4 hover:bg-zinc-200 hover:size-5 rounded-full" />
          </Button>
        </div>
      ))}
    </div>
  );

  const side = "bottom";
  return (
    <Sheet>
      <SheetTrigger asChild>
        {selections.length > 0 && (
          <Button className="fixed bottom-24 right-3 z-50 size-12 rounded-full p-3 waki-gradient">
            {/* <Ticket className="h-6 w-6" /> */}
            <img src={betIcon} alt="" className="h-6 w-6" />
            {selections.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-blueWaki">
                {selections.length}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetHeader className="hidden">
        <SheetTitle>Predicciones</SheetTitle>
        <SheetDescription>Mis selecciones</SheetDescription>
      </SheetHeader>
      <SheetContent side={side} className="rounded-t-lg cupon">
        <Card className="border-0 shadow-none lg:shadow">
          <CardHeader className="py-6 px-3">
            <CardTitle className="font-medium text-[#181818]">Resumen de Predicciones</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            {selections.length > 0 ? (
              <>
                {renderSelections()}
                <div className="mt-4">
                  {/* <p>Cuota total: {totalOdds}</p> */}
                  <div className="flex flex-row gap-1 mt-2 font-bold text-blueWaki">
                    <p>Puntos totales:</p>
                    <span>{potentialEarning}</span>
                  </div>
                </div>
              </>
            ) : (
              <p>No hay selecciones en el cupón</p>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <Button
              onClick={realizarPrediccion}
              className="w-full max-w-40 bg-purpleWaki hover:bg-purple-700"
              disabled={selections.length === 0}
            >
              Predecir
            </Button>
          </CardFooter>
        </Card>
      </SheetContent>
    </Sheet>
  );
};

export default BetCoupon;
