import express from "express";
import Cookies from "cookie-parser";
import Cors from "cors";
import GlobalErrorHandler from "./controller/error.controller";
import Database from "./db";
import Routes from "./routes/index";
const db = new Database();

db.connectDB();

const app = express();
app.use(Cookies());

const PORT = 3008;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Cors());
app.use(Routes);


app.use(GlobalErrorHandler);

app.listen(PORT, () => {
  console.log("orderappservice is running on PORT", PORT);
});
