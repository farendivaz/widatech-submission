// server.js
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3001;

// Middleware
// CORS configuration
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fariz2002@",
  database: "invoice_management",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// API Endpoints

// Get all invoices
app.get("/api/invoices", (req, res) => {
  const query = "SELECT * FROM invoices";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error fetching invoices" });
      return;
    }
    res.json(results);
  });
});

// Add a new invoice
app.post("/api/invoices", (req, res) => {
  // Match field names with frontend
  const {
    date,
    customer_name,
    salesperson_name,
    notes,
    products,
    total_amount,
  } = req.body;

  // Insert invoice details first
  const query =
    "INSERT INTO invoices (date, customer_name, salesperson_name, notes, total_amount) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [date, customer_name, salesperson_name, notes, total_amount],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error creating invoice" });
        return;
      }

      const invoiceId = result.insertId;

      // Insert products for this invoice
      const productQuery =
        "INSERT INTO invoice_products (invoice_id, product_name, quantity, price) VALUES ?";
      const productValues = products.map((product) => [
        invoiceId,
        product.name,
        product.quantity,
        product.price,
      ]);

      db.query(productQuery, [productValues], (err) => {
        if (err) {
          res.status(500).json({ error: "Error adding products to invoice" });
          return;
        }
        res
          .status(201)
          .json({ message: "Invoice created successfully", invoiceId });
      });
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
