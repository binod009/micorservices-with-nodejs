const express = require("express");
const cookieParser = require('cookie-parser');
const PORT = 3000;
const pg = require("./db");

const app = express();
app.use(cookieParser());
const Routes = require("./routes/index");
const globalErrorHandler = require("./controller/errorController");
// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(Routes);
 

app.use(globalErrorHandler);
const server = app.listen(PORT, () => {
  console.log("server is listening...");
});
