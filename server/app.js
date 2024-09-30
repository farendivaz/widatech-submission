const express = require("express");
const bodyParser = require("body-parser");
const invoiceRoutes = require("./routes/invoiceRoutes");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(bodyParser.json()); // Parse incoming request bodies in JSON format

app.use("/api", invoiceRoutes); // Mount the invoice routes under /api

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
