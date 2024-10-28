/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/common/components/ui/chart";
import useLanguageStore from "@/api/store/language-store";

const data = [
  { year: 2004, tokens: 10000 },
  { year: 2005, tokens: 22000 },
  { year: 2006, tokens: 28000 },
  { year: 2007, tokens: 35000 },
  { year: 2008, tokens: 45000 },
  { year: 2009, tokens: 52000 },
  { year: 2010, tokens: 58000 },
  { year: 2011, tokens: 65000 },
  { year: 2012, tokens: 70000 },
  { year: 2013, tokens: 75000 },
  { year: 2014, tokens: 80000 },
  { year: 2015, tokens: 85000 },
  { year: 2016, tokens: 90000 },
  { year: 2017, tokens: 95000 },
  { year: 2018, tokens: 100000 },
  { year: 2019, tokens: 105000 },
  { year: 2020, tokens: 108000 },
  { year: 2021, tokens: 110000 },
  { year: 2022, tokens: 112000 },
  { year: 2023, tokens: 115000 },
];

const tokenYear = [
  { year: 2004, tokens: 10000 },
  { year: 2005, tokens: 9500 },
  { year: 2006, tokens: 8300 },
  { year: 2007, tokens: 8600 },
  { year: 2008, tokens: 8000 },
  { year: 2009, tokens: 3800 },
  { year: 2010, tokens: 2300 },
  { year: 2012, tokens: 1500 },
  { year: 2013, tokens: 4200 },
  { year: 2014, tokens: 4000 },
  { year: 2015, tokens: 2000 },
  { year: 2016, tokens: 5400 },
  { year: 2017, tokens: 6700 },
  { year: 2018, tokens: 2200 },
  { year: 2019, tokens: 6680 },
  { year: 2020, tokens: 5660 },
  { year: 2021, tokens: 4700 },
  { year: 2022, tokens: 2000 },
];


export const TokenChart = ({lastName}) => {
  const { currentLanguage } = useLanguageStore();
  return (
    <Card className="w-full max-w-xl mx-auto border-none shadow-none">
      <CardHeader className="hidden">
        <CardTitle>Liberación Acumulada del Token Anual</CardTitle>
        <CardDescription>{lastName}/USDT Token Release (2004-2023)</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={{
            tokens: {
              label: "Tokens Liberados",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="min-h-[240px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
          >
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "hsl(var(--foreground))",
                angle: -90,
                textAnchor: "end",
                dy: 5,
                style: { fontSize: "9px" },
              }}
              height={60}
              label={{ value: "Año", position: "insideBottom", offset: 0 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "hsl(var(--foreground))",
                style: { fontSize: "9px" },
              }}
              tickMargin={10}
              tickFormatter={(value) => `${value.toLocaleString()}`}
              label={{
                value: currentLanguage === "en" ? "Cumulative Released Tokens" : "Token liberados acumulados",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                style: { textAnchor: "middle" },
              }}
            />
            <CartesianGrid vertical={false} />
            <ChartTooltip />
            <Line
              type="monotone"
              dataKey="tokens"
              strokeWidth={1}
              stroke="hsl(var(--chart-6))"
              dot={{
                fill: "hsl(var(--chart-6))",
              }}
              activeDot={{
                r: 8,
                style: { fill: "hsl(var(--chart-6))" },
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export const YearTokenChart = ({lastName}) => {
  const { currentLanguage } = useLanguageStore();
  return (
    <Card className="w-full max-w-xl mx-auto border-none shadow-none">
      <CardHeader className="hidden">
        <CardTitle>Liberación de Tokens Anual</CardTitle>
        <CardDescription>{lastName}/USDT Token Release (2004-2022)</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={{
            tokens: {
              label: "Tokens Liberados",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="min-h-[240px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={tokenYear}
            margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
          >
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "hsl(var(--foreground))",
                angle: -90,
                textAnchor: "end",
                dy: 5,
                style: { fontSize: "9px" },
              }}
              height={60}
              label={{ value: "Año", position: "insideBottom", offset: 0 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "hsl(var(--foreground))",
                style: { fontSize: "9px" },
              }}
              tickMargin={10}
              tickFormatter={(value) => `${value.toLocaleString()}`}
              label={{
                value: currentLanguage === "en" ? "Released Tokens" : "Token liberados",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                style: { textAnchor: "middle" },
              }}
            />
            <CartesianGrid vertical={false} />
            <ChartTooltip />
            <Line
              type="monotone"
              dataKey="tokens"
              strokeWidth={1}
              stroke="hsl(var(--chart-6))"
              dot={{
                fill: "hsl(var(--chart-6))",
              }}
              activeDot={{
                r: 8,
                style: { fill: "hsl(var(--chart-6))" },
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export const TokenDistributionChart = () => {
  const { currentLanguage } = useLanguageStore();
  const Burned = currentLanguage === "en" ? "Burned Tokens" : "Token quemados";
  const Released = currentLanguage === "en" ? "Released Tokens" : "Token liberados"

const tokenBurn = [
  { year: 2004, "Released": 10000, "Burned": 0 },
  { year: 2005, "Released": 9500, "Burned": 500 },
  { year: 2006, "Released": 9000, "Burned": 1000 },
  { year: 2007, "Released": 8500, "Burned": 1500 },
  { year: 2008, "Released": 8000, "Burned": 2000 },
  { year: 2009, "Released": 7500, "Burned": 2500 },
  { year: 2010, "Released": 7000, "Burned": 3000 },
  { year: 2011, "Released": 6500, "Burned": 3500 },
  { year: 2012, "Released": 6000, "Burned": 4000 },
  { year: 2013, "Released": 5500, "Burned": 4500 },
  { year: 2014, "Released": 5000, "Burned": 5000 },
  { year: 2015, "Released": 4500, "Burned": 5500 },
  { year: 2016, "Released": 4000, "Burned": 6000 },
  { year: 2017, "Released": 3500, "Burned": 6500 },
  { year: 2018, "Released": 3000, "Burned": 7000 },
  { year: 2019, "Released": 2500, "Burned": 7500 },
  { year: 2020, "Released": 2000, "Burned": 8000 },
  { year: 2021, "Released": 1500, "Burned": 8500 },
  { year: 2022, "Released": 1000, "Burned": 9000 },
  { year: 2023, "Released": 500, "Burned": 9500 },
];

  return (
    <Card className="w-full max-w-xl mx-auto border-none shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-row gap-4 items-center justify-center">
          <div className="flex flex-row items-center gap-2">
            <div className="size-3 bg-purpleWaki" />
            <span className="text-xs font-normal text-[#555]">
              {currentLanguage === "en" ? "Released Tokens" : "Token liberados"}
            </span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="size-3 bg-blueWaki" />
            <span className="text-xs font-normal text-[#555]">
              {currentLanguage === "en" ? "Burned Tokens" : "Token quemados"}
            </span>
          </div>
        </div>
        <ChartContainer
          config={{
            released: {
              label: currentLanguage === "en" ? "Released Tokens" : "Token liberados",
              color: "hsl(var(--foreground))",
            },
            burned: {
              label: currentLanguage === "en" ? "Burned Tokens" : "Token quemados",
              color: "hsl(var(--foreground))",
            },
          }}
          className="min-h-[250px] w-full"
        >
          <BarChart
            data={tokenBurn}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "hsl(var(--foreground))",
                angle: -90,
                textAnchor: "end",
                dy: 10,
                style: { fontSize: "9px" },
              }}
              height={60}
              label={{ value: "Año", position: "insideBottom", offset: -40 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "hsl(var(--foreground))",
                style: { fontSize: "9px" },
              }}
              tickMargin={10}
              tickFormatter={(value) => `${value.toLocaleString()}`}
              label={{
                value: currentLanguage === "en" ? "Released Tokens" : "Token liberados",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip />

            <Bar
              dataKey="Released"
              stackId="a"
              fill="hsl(var(--chart-6))"
            />
            <Bar
              dataKey="Burned"
              stackId="a"
              fill="hsl(var(--chart-7))"
              color="black"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
