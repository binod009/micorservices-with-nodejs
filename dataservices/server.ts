import express from "express";
const PORT = 3009
import routes from "./routes/index";
const app = express();

app.use(routes);

app.listen(PORT, () => {
    console.log('data-service is running on PORT', PORT);
})

