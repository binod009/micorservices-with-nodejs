import asyncHandler from "../../utils/asyncHandler";
import user_svc from "../../services/userServices";
export const apiEventController = asyncHandler(async (req, res) => {
    const event = req.body;
    const userresult= await user_svc.SubscribeEvents(event);
    res.status(userresult?.status).json(userresult)
    
})
