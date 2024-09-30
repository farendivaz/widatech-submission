const db = require("../config/db");

// Create new invoice
exports.createInvoice = async (
  date,
  customer_name,
  salesperson_name,
  notes,
  products,
  total_amount
) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [invoiceResult] = await connection.query(
      `INSERT INTO invoices (date, customer_name, salesperson_name, notes, total_amount)
      VALUES (?, ?, ?, ?, ?)`,
      [date, customer_name, salesperson_name, notes, total_amount]
    );

    const invoiceId = invoiceResult.insertId;

    // Insert products sold in this invoice
    for (const product of products) {
      await connection.query(
        `INSERT INTO invoice_products (invoice_id, product_name, quantity, price)
        VALUES (?, ?, ?, ?)`,
        [invoiceId, product.name, product.quantity, product.price]
      );
    }

    await connection.commit();
    return { success: true, invoiceId };
  } catch (error) {
    console.error("Error in createInvoice:", error);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.getAllInvoices = async () => {
  const [invoices] = await db.query(`SELECT * FROM invoices`); // Fetch all invoices
  return invoices;
};

// Get invoice totals for time-series revenue graph
exports.getRevenueData = async (interval) => {
  let query = "";
  switch (interval) {
    case "daily":
      query = `SELECT DATE(date) as date, SUM(total_amount) as total 
               FROM invoices 
               GROUP BY DATE(date) 
               ORDER BY DATE(date)`;
      break;
    case "weekly":
      query = `SELECT WEEK(date) as week, SUM(total_amount) as total 
               FROM invoices 
               GROUP BY WEEK(date) 
               ORDER BY WEEK(date)`;
      break;
    case "monthly":
      query = `SELECT MONTH(date) as month, SUM(total_amount) as total 
               FROM invoices 
               GROUP BY MONTH(date) 
               ORDER BY MONTH(date)`;
      break;
  }
  const [data] = await db.query(query);
  return data;
};
