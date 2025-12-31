import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import { db } from "./config/db.js";
import { connectMongoDB } from "./config/db_mongo.js";
import authRoute from "./routes/authRoute.js";
import suppilerRoute from "./routes/suppilerRoute.js";
import productRoute from "./routes/productRoute.js";
import transactionRoute from "./routes/transactionRoute.js";
import feedbackRoute from "./routes/feedbackRoute.js";
import customerRoute from "./routes/customerRoute.js";
import notificationRoute from "./routes/notificationRoute.js";

// dotenv.config();

const app = express();
// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-domain.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Test database SQL connection
async function testDBConnection() {
  try {
    await db.query("SELECT 1");
    console.log("✅ Database SQL connected successfully!");
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
    return false;
  }
}

testDBConnection();
//

// Test database MongoDB connection
connectMongoDB();
//

app.get("/", (req, res) => {
  res.send("Welcome to the CellTrack API");
});

app.use(authRoute);
app.use(suppilerRoute);
app.use(productRoute);
app.use(transactionRoute);
app.use(feedbackRoute);
app.use(customerRoute);
app.use(notificationRoute);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
