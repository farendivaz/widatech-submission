const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

router.post("/invoices", invoiceController.createInvoice); // POST to create a new invoice
router.get("/invoices", invoiceController.getInvoices); // GET invoices with pagination
router.get("/revenue", invoiceController.getRevenueData); // GET revenue data for the chart

module.exports = router;
