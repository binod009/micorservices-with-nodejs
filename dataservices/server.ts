import express from "express";
import {connectDB} from  "./db";
const PORT = 3009
import routes from "./routes/index";
const app = express();
connectDB();
app.use(routes);

app.listen(PORT, () => {
    console.log('data-service is running on PORT', PORT);
})

