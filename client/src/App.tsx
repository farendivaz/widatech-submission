import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Invoice, RevenueData } from "./types";
import AddInvoice from "./components/AddInvoice";
import InvoiceList from "./components/InvoiceList";
import TimeSeriesGraph from "./components/TimeSeriesGraph";

function App() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/revenue?interval=${interval}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch revenue data");
      }
      const data = await response.json();
      setRevenueData(data.data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [interval]);

  const handleIntervalChange = (
    newInterval: "daily" | "weekly" | "monthly"
  ) => {
    setInterval(newInterval);
  };

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/invoices`);
      const data = await response.json();
      setInvoices(data.invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(); // Fetch data when the current page changes
  }, []);

  return (
    <div className="container w-1/2 py-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Invoice Management</h1>

      <Tabs defaultValue="add-invoice">
        <TabsList className="gap-4">
          <TabsTrigger value="add-invoice">Add Invoice</TabsTrigger>
          <TabsTrigger value="invoice-list">Invoice List</TabsTrigger>
          <TabsTrigger value="revenue-graph">Revenue Graph</TabsTrigger>
        </TabsList>

        <TabsContent value="add-invoice">
          <AddInvoice
            onInvoiceAdded={fetchInvoices}
            revenueData={fetchRevenueData}
          />
        </TabsContent>

        <TabsContent value="invoice-list">
          <InvoiceList invoices={invoices} />{" "}
        </TabsContent>

        <TabsContent value="revenue-graph">
          <TimeSeriesGraph
            data={revenueData}
            interval={interval}
            onIntervalChange={handleIntervalChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
