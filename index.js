import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import suppilerRoute from "./routes/suppilerRoute.js";
import productRoute from "./routes/productRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Test database connection
async function testDBConnection() {
  try {
    await db.query("SELECT 1");
    console.log("✅ Database connected successfully!");
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
    return false;
  }
}

testDBConnection();
//

app.use(authRoute);
app.use(suppilerRoute);
app.use(productRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
