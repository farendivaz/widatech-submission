import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Invoice } from "../types";
import InvoiceCard from "./InvoiceCard";

interface InvoiceListProps {
  invoices: Invoice[];
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("all");
  const itemsPerPage = 3;

  const filteredInvoices = invoices.filter((invoice) => {
    if (filter === "all") return true;
    if (filter === "high") return invoice.total_amount >= 10000000;
    if (filter === "low") return invoice.total_amount < 10000000;
    return true;
  });

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        {paginatedInvoices.map((invoice) => (
          <InvoiceCard invoice={invoice} />
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of{" "}
          {Math.ceil(filteredInvoices.length / itemsPerPage)}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(filteredInvoices.length / itemsPerPage)
              )
            )
          }
          disabled={
            currentPage === Math.ceil(filteredInvoices.length / itemsPerPage)
          }
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default InvoiceList;
