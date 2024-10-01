import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddInvoice from "./components/AddInvoice";
import InvoiceList from "./components/InvoiceList";
import TimeSeriesGraph from "./components/TimeSeriesGraph";
import { useInvoiceStore } from "./store";

function App() {
  const { fetchInvoices, fetchRevenueData, interval } = useInvoiceStore();

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    fetchRevenueData();
  }, [interval]);

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
          <AddInvoice />
        </TabsContent>

        <TabsContent value="invoice-list">
          <InvoiceList />{" "}
        </TabsContent>

        <TabsContent value="revenue-graph">
          <TimeSeriesGraph />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
