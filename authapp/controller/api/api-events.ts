import express, { NextFunction,Response,Request } from "express";
const app = express();

app.use("/app-events", async(req: Request, res: Response,neext:NextFunction) => {
    const { payload } = req.body;
    services.subscribeEvents(payload);
    console.log("auth event services is working");
    res.status(200).json({
        msg:"success",
    })
})