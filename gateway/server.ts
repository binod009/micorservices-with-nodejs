import express from "express";
import Cors from "cors";
import proxy from "express-http-proxy";
const PORT = 3007;

const app = express();

app.use(express.json());

app.use(Cors());
app.use("/customer", proxy("http://localhost:3006"));
app.use("/product", proxy("http://localhost:3005"));
app.use("/auth", proxy("http://localhost:3003"));
app.listen(PORT, () => {
  console.log("gateway is running on PORT",PORT);
});
