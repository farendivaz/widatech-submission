export interface Product {
  id: number;
  name: string;
  picture: string;
  stock: number;
  price: number;
}

export interface InvoiceProduct extends Product {
  quantity: number;
}

export interface Invoice {
  id: number;
  date: string;
  customer_name: string;
  salesperson_name: string;
  total_amount: number;
  notes?: string;
  products?: InvoiceProduct[];
}

export interface NewInvoice {
  date: string;
  customer_name: string;
  salesperson_name: string;
  notes?: string;
  products: InvoiceProduct[];
}

export interface Errors {
  date?: string;
  customer_name?: string;
  salesperson_name?: string;
  products?: string;
}

export interface RevenueData {
  date: string;
  total: string;
}
