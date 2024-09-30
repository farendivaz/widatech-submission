import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NewInvoice, Errors, Product } from "../types";
import { products } from "../data/products";
import { formatRupiah } from "@/lib/rupiah";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddInvoiceProps {
  onInvoiceAdded: (page: number) => void;
  revenueData: () => void;
}

const AddInvoice: React.FC<AddInvoiceProps> = ({
  onInvoiceAdded,
  revenueData,
}) => {
  const [newInvoice, setNewInvoice] = useState<NewInvoice>({
    date: "",
    customer_name: "",
    salesperson_name: "",
    notes: "",
    products: [],
  });
  const [date, setDate] = useState<Date | undefined>();
  const [productInput, setProductInput] = useState<string>("");
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setNewInvoice({ ...newInvoice, date: format(newDate, "yyyy-MM-dd") });
      setErrors({ ...errors, date: "" });
    }
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductInput(value);
    const suggestions = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setProductSuggestions(suggestions);
  };

  const addProduct = (product: Product) => {
    setNewInvoice({
      ...newInvoice,
      products: [...newInvoice.products, { ...product, quantity: 1 }],
    });
    setProductInput("");
    setProductSuggestions([]);
  };

  const removeProduct = (productId: number) => {
    setNewInvoice({
      ...newInvoice,
      products: newInvoice.products.filter((p) => p.id !== productId),
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!newInvoice.date) newErrors.date = "Date is required";
    if (!newInvoice.customer_name)
      newErrors.customer_name = "Customer name is required";
    if (!newInvoice.salesperson_name)
      newErrors.salesperson_name = "Salesperson name is required";
    if (newInvoice.products.length === 0)
      newErrors.products = "At least one product is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const totalAmount = newInvoice.products.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
      );

      const invoiceData: NewInvoice & { total_amount: number } = {
        ...newInvoice,
        total_amount: parseFloat(totalAmount.toFixed(2)),
      };

      try {
        const response = await fetch("http://localhost:3001/api/invoices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceData),
        });

        if (response.ok) {
          setNewInvoice({
            date: "",
            customer_name: "",
            salesperson_name: "",
            notes: "",
            products: [],
          });
          setDate(undefined);
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
          onInvoiceAdded(1);
          revenueData();
        } else {
          console.error("Failed to submit invoice", await response.text());
        }
      } catch (error) {
        console.error("Error submitting invoice:", error);
      }
    }
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add New Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                name="customer_name"
                value={newInvoice.customer_name}
                onChange={handleInputChange}
                placeholder="Customer Name"
              />
              {errors.customer_name && (
                <p className="text-sm text-red-500">{errors.customer_name}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                name="salesperson_name"
                value={newInvoice.salesperson_name}
                onChange={handleInputChange}
                placeholder="Salesperson Name"
              />
              {errors.salesperson_name && (
                <p className="text-sm text-red-500">
                  {errors.salesperson_name}
                </p>
              )}
            </div>
            <div>
              <Input
                type="text"
                name="notes"
                value={newInvoice.notes}
                onChange={handleInputChange}
                placeholder="Notes (optional)"
              />
            </div>
            <div>
              <Input
                type="text"
                value={productInput}
                onChange={handleProductInputChange}
                placeholder="Search for products"
              />
              {productSuggestions.length > 0 && (
                <ul className="mt-2 border rounded-md">
                  {productSuggestions.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => addProduct(product)}
                    >
                      <img
                        src={product.picture}
                        alt={product.name}
                        className="object-cover w-8 h-8 mr-2"
                      />
                      <p>
                        {product.name} - Price:
                        {formatRupiah(product.price)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Selected Products:</h3>
              <ul>
                {newInvoice.products.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <img
                      className="object-cover w-8 h-8"
                      src={product.picture}
                      alt={product.name}
                    />
                    <span>
                      {product.name} - Quantity: {product.quantity}
                    </span>
                    <Button
                      onClick={() => removeProduct(product.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
              {errors.products && (
                <p className="text-sm text-red-500">{errors.products}</p>
              )}
            </div>
            <Button type="submit">Submit Invoice</Button>
          </form>
        </CardContent>
      </Card>
      {showSuccessAlert && (
        <Alert className="mt-4">
          <AlertDescription>Invoice submitted successfully!</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AddInvoice;
