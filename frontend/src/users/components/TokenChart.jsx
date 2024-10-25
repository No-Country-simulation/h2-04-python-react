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

const tokenBurn = [
  { year: 2004, "Token liberados": 10000, "Token quemados": 0 },
  { year: 2005, "Token liberados": 9500, "Token quemados": 500 },
  { year: 2006, "Token liberados": 9000, "Token quemados": 1000 },
  { year: 2007, "Token liberados": 8500, "Token quemados": 1500 },
  { year: 2008, "Token liberados": 8000, "Token quemados": 2000 },
  { year: 2009, "Token liberados": 7500, "Token quemados": 2500 },
  { year: 2010, "Token liberados": 7000, "Token quemados": 3000 },
  { year: 2011, "Token liberados": 6500, "Token quemados": 3500 },
  { year: 2012, "Token liberados": 6000, "Token quemados": 4000 },
  { year: 2013, "Token liberados": 5500, "Token quemados": 4500 },
  { year: 2014, "Token liberados": 5000, "Token quemados": 5000 },
  { year: 2015, "Token liberados": 4500, "Token quemados": 5500 },
  { year: 2016, "Token liberados": 4000, "Token quemados": 6000 },
  { year: 2017, "Token liberados": 3500, "Token quemados": 6500 },
  { year: 2018, "Token liberados": 3000, "Token quemados": 7000 },
  { year: 2019, "Token liberados": 2500, "Token quemados": 7500 },
  { year: 2020, "Token liberados": 2000, "Token quemados": 8000 },
  { year: 2021, "Token liberados": 1500, "Token quemados": 8500 },
  { year: 2022, "Token liberados": 1000, "Token quemados": 9000 },
  { year: 2023, "Token liberados": 500, "Token quemados": 9500 },
];

export const TokenChart = () => {
  return (
    <Card className="w-full max-w-xl mx-auto border-none shadow-none">
      <CardHeader className="hidden">
        <CardTitle>Liberación Acumulada del Token Anual</CardTitle>
        <CardDescription>MESSI/USDT Token Release (2004-2023)</CardDescription>
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
                value: "Token liberados acumulados",
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

export const YearTokenChart = () => {
  return (
    <Card className="w-full max-w-xl mx-auto border-none shadow-none">
      <CardHeader className="hidden">
        <CardTitle>Liberación de Tokens Anual</CardTitle>
        <CardDescription>MESSI/USDT Token Release (2004-2022)</CardDescription>
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
                value: "Token liberados",
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
  return (
    <Card className="w-full max-w-xl mx-auto border-none shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-row gap-4 items-center justify-center">
          <div className="flex flex-row items-center gap-2">
            <div className="size-3 bg-purpleWaki" />
            <span className="text-xs font-normal text-[#555]">
              Token liberados
            </span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="size-3 bg-blueWaki" />
            <span className="text-xs font-normal text-[#555]">
              Token quemados
            </span>
          </div>
        </div>
        <ChartContainer
          config={{
            released: {
              label: "Token liberados",
              color: "hsl(var(--foreground))",
            },
            burned: {
              label: "Token quemados",
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
                value: "Token liberados",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip />

            <Bar
              dataKey="Token liberados"
              stackId="a"
              fill="hsl(var(--chart-6))"
            />
            <Bar
              dataKey="Token quemados"
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
