import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { Input } from "@/common/components/ui/input";
import useLanguageStore from "@/api/store/language-store";

const TradingView = () => {
  const { currentLanguage } = useLanguageStore();
  const [price, setPrice] = useState("67377,50");
  const [value, setValue] = useState("");

  const increment = () => setValue((prev) => Math.min(prev + 1, 9999));
  const decrement = () => setValue((prev) => Math.max(prev - 1, 0));

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      setValue(Math.max(0, Math.min(newValue, 9999)));
    }
  };

  const mockOrderBook = [
    { price: "67.378,00", amount: "0,05810" },
    { price: "67.378,00", amount: "0,05810" },
    { price: "67.378,00", amount: "0,05810" },
    { price: "67.378,00", amount: "0,05810" },
    { price: "67.378,00", amount: "0,05810" },
    { price: "67.378,00", amount: "0,05810" },
    { price: "67.378,00", amount: "0,05810" },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col items-start mb-2">
        <Select defaultValue="MESSI" disabled>
          <SelectTrigger className="w-48 border-none shadow-none p-0 text-xl font-semibold focus:ring-0 [&>span]:flex [&>span]:items-center [&>span]:gap-2">
            <SelectValue placeholder="Select trading pair" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="MESSI">MESSI / USDT</SelectItem>
              <SelectItem value="MBAPPE">MBAPPE / USDT</SelectItem>
              <SelectItem value="HAALAND">HAALAND / USDT</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <span className="text-purpleWaki text-sm">-0.44%</span>
      </div>
      <div className="flex flex-row justify-between">
        <div className="grid grid-cols-2 gap-4 mb-6 max-w-44">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-sm text-muted-foreground mb-2">
              Precio (USDT)
            </h3>
            {mockOrderBook.map((order, index) => (
              <div key={index} className="text-purpleWaki text-sm mb-2">
                {order.price}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-sm text-center text-muted-foreground mb-2">
              Monto (MESSI)
            </h3>
            {mockOrderBook.map((order, index) => (
              <div key={index} className="text-right text-[#555] text-sm mb-2">
                {order.amount}
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-44">
          <div className="flex gap-3 mb-6">
            <Button
              className="flex-1 max-w-20 bg-purpleWaki hover:bg-purple-600"
              disabled
            >
              {currentLanguage === "en" ? "Buy" : "Compra"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 max-w-20 text-purpleWaki border-purple-500 hover:bg-purple-50"
              disabled
            >
              {currentLanguage === "en" ? "Sell" : "Venta"}
            </Button>
          </div>
          <Select defaultValue="limit" className="max-w-[150px]" disabled>
            <SelectTrigger className="w-full mb-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="limit">Limit</SelectItem>
              <SelectItem value="market">Market</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <div className="w-full max-w-sm space-y-2">
              <label className="text-sm text-muted-foreground">
                {currentLanguage === "en" ? "Price (USDT)" : "Precio (USDT)"}
              </label>
              <div className="flex h-10 w-full overflow-hidden rounded-md border border-input shadow-sm">
                <Button
                  variant="ghost"
                  className="rounded-none border-0 px-2"
                  onClick={() =>
                    setPrice((prev) =>
                      String(Number(prev.replace(",", ".")) - 0.5).replace(
                        ".",
                        ","
                      )
                    )
                  }
                  aria-label="Decrease value"
                  disabled
                >
                  <Minus className="size-3" />
                </Button>
                <Input
                  id="number-input"
                  type="text"
                  value={price}
                  min={0}
                  max={9999}
                  className="flex-1 text-xs border-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={handleInputChange}
                  disabled
                />
                <Button
                  variant="ghost"
                  className="rounded-none border-0 px-2"
                  onClick={() =>
                    setPrice((prev) =>
                      String(Number(prev.replace(",", ".")) + 0.5).replace(
                        ".",
                        ","
                      )
                    )
                  }
                  aria-label="Increase value"
                  disabled
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-2">
              <div className="flex h-10 w-full overflow-hidden rounded-md border border-input shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none border-0 px-2"
                  onClick={decrement}
                  aria-label="Decrease value"
                  disabled
                >
                  <Minus className="size-3" />
                </Button>
                <Input
                  id="number-input"
                  type="number"
                  min={0}
                  max={9999}
                  className="flex-1 text-xs border-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={value}
                  placeholder="Monto (MESSI)"
                  onChange={handleInputChange}
                  disabled
                />
                <Button
                  variant="ghost"
                  className="rounded-none border-0 px-2"
                  onClick={increment}
                  aria-label="Increase value"
                  disabled
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md">
        <div className="mb-3">
          <h1 className="text-[22px] font-semibold mb-1">67.377,63</h1>
          <p className="text-muted-foreground text-sm">$67.377,63</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            {mockOrderBook.map((order, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-purple-500">{order.price}</span>
                <span className="text-[#555]">{order.amount}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex h-10 w-full overflow-hidden rounded-md border border-input shadow-sm">
              <Button
                variant="ghost"
                className="rounded-none border-0 px-2"
                disabled
              >
                <Minus className="size-3" />
              </Button>
              <Input
                id="number-input"
                type="text"
                value="Total (USDT)"
                className="flex-1 text-xs border-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                disabled
              />
              <Button variant="ghost" className="rounded-none border-0 px-2" disabled>
                <Plus className="size-3" />
              </Button>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {" "}
                {currentLanguage === "en" ? "In stock" : "Disponible"}
              </span>
              <span>0</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {currentLanguage === "en" ? "Est. commission" : "Comisión est."}
              </span>
              <span>USDT</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 py-4">
          <Select defaultValue="0.01" disabled>
            <SelectTrigger className="w-44 max-w-sm border-xl shadow-waki">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.01">0.01</SelectItem>
              <SelectItem value="0.1">0.1</SelectItem>
              <SelectItem value="1">1.0</SelectItem>
            </SelectContent>
          </Select>

          <Button className="flex-1 bg-purple-600 hover:bg-purple-700" disabled>
            {currentLanguage === "en" ? "Sell MESSI" : "Vender MESSI"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradingView;
