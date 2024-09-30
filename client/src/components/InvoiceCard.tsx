import { formatRupiah } from "@/lib/rupiah";
import React from "react";
import { Invoice } from "../types";

interface InvoiceCardProps {
  invoice: Invoice;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  return (
    <div
      key={invoice.id}
      className="p-4 transition-shadow duration-300 bg-white border rounded-lg shadow-md hover:shadow-xl"
    >
      <div className="pb-4 mb-4 border-b">
        <h3 className="text-xl font-semibold text-gray-800">
          {invoice.customer_name}
        </h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <strong className="text-gray-800">Date:</strong>{" "}
          {formatDate(invoice.date)}
        </p>
        <p className="text-sm text-gray-600">
          <strong className="text-gray-800">Salesperson:</strong>{" "}
          {invoice.salesperson_name}
        </p>
        <p className="text-sm text-gray-600">
          <strong className="text-gray-800">Total Amount:</strong>{" "}
          {formatRupiah(invoice.total_amount)}
        </p>
        <p className="text-sm text-gray-600">
          <strong className="text-gray-800">Notes:</strong>{" "}
          {invoice.notes || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default InvoiceCard;
