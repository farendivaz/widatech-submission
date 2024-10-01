import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from "@/lib/rupiah";
import { useInvoiceStore } from "@/store";

const TimeSeriesGraph: React.FC = () => {
  const { revenueData, interval, setInterval } = useInvoiceStore();

  // Format the data for the chart
  const formattedData = revenueData.map((item) => ({
    ...item,
    total: parseFloat(item.total),
  }));

  const formatXAxis = (value: string | number) => {
    switch (interval) {
      case "daily":
        return new Date(value as string).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        });
      case "weekly":
        return `Week ${value}`;
      case "monthly":
        return new Date(2024, (value as number) - 1, 1).toLocaleDateString(
          "id-ID",
          {
            month: "short",
          }
        );
    }
  };

  const formatYAxis = (value: number) => {
    if (value >= 1e12) return `${value / 1e12} Triliun`;
    if (value >= 1e9) return `${value / 1e9} Miliar`;
    if (value >= 1e6) return `${value / 1e6} Juta`;
    if (value >= 1e3) return `${value / 1e3} Ribu`;
    return value.toString();
  };

  const getXAxisDataKey = () => {
    switch (interval) {
      case "daily":
        return "date";
      case "weekly":
        return "week";
      case "monthly":
        return "month";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Revenue Projection
          <Select value={interval} onValueChange={setInterval}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={getXAxisDataKey()}
                tickFormatter={formatXAxis}
                minTickGap={30}
              />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value: number) => [formatRupiah(value), "Revenue"]}
                labelFormatter={(label: string | number) => {
                  switch (interval) {
                    case "daily":
                      return `Date: ${new Date(
                        label as string
                      ).toLocaleDateString("id-ID")}`;
                    case "weekly":
                      return `Week: ${label}`;
                    case "monthly":
                      return `Month: ${new Date(
                        2024,
                        (label as number) - 1,
                        1
                      ).toLocaleDateString("id-ID", { month: "long" })}`;
                  }
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSeriesGraph;
