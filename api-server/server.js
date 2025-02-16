const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");
const cors = require("cors"); // Import the CORS package

dotenv.config();
connectDB();

const app = express();
app.use(cors());
// Body parser middleware
app.use(express.json());


// Middleware
app.use(bodyParser.json());
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
