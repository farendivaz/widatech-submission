const Invoice = require("../models/invoiceModel");

exports.createInvoice = async (req, res) => {
  try {
    const {
      date,
      customer_name,
      salesperson_name,
      notes,
      products,
      total_amount,
    } = req.body;
    const result = await Invoice.createInvoice(
      date,
      customer_name,
      salesperson_name,
      notes,
      products,
      total_amount
    );
    res
      .status(201)
      .json({ message: "Invoice created", invoiceId: result.invoiceId }); // Send success response
  } catch (error) {
    res.status(500).json({ message: "Error creating invoice", error }); // Send error response
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.getAllInvoices(); // Call the model to get all invoices
    res.status(200).json({ invoices });
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error });
  }
};

exports.getRevenueData = async (req, res) => {
  const { interval } = req.query; // Get the time interval (daily, weekly, monthly) from query params
  try {
    const data = await Invoice.getRevenueData(interval); // Call the model to get revenue data
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching revenue data", error });
  }
};
