"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { MonthlyRevenueDto } from "@/app/_data-access/dashboard/get-dashboard";

interface RevenueChartProps {
  data: MonthlyRevenueDto[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Receita</CardTitle>
        <CardDescription>Receita total dos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[150px]">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} initialDimension={{ width: 320, height: 180 }}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickMargin={8}
              />
              <Tooltip 
                cursor={{ fill: "transparent" }}
                formatter={(value) => 
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(value))
                }
              />
              <Bar 
                dataKey="revenue" 
                fill="currentColor" 
                radius={[4, 4, 0, 0]} 
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
