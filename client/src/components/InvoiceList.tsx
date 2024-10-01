import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import InvoiceCard from "./InvoiceCard";
import { useInvoiceStore } from "@/store";

const InvoiceList: React.FC = () => {
  const { invoices, loading, hasMore, fetchMoreInvoices } = useInvoiceStore();
  const [filter, setFilter] = useState<string>("all");

  const filteredInvoices = invoices.filter((invoice) => {
    if (filter === "all") return true;
    if (filter === "high") return invoice.total_amount >= 10000000;
    if (filter === "low") return invoice.total_amount < 10000000;
    return true;
  });

  return (
    <>
      <div className="mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter invoices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Invoices</SelectItem>
            <SelectItem value="high">High Value (≥Rp.10.000.000)</SelectItem>
            <SelectItem value="low">Low Value (&lt;Rp.10.000.000)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredInvoices.map((invoice) => (
          <InvoiceCard invoice={invoice} key={invoice.id} />
        ))}
        {loading && <p>Loading...</p>}
      </div>
      {!loading && hasMore && (
        <div className="flex items-center justify-center">
          <Button onClick={fetchMoreInvoices}>Load More</Button>
        </div>
      )}
    </>
  );
};

export default InvoiceList;
