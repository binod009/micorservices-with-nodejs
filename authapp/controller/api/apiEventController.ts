import asyncHandler from "../../utils/asyncHandler";
import UserService from "../../services/userServices";
const user_svc = new UserService();

export const apiEventController = asyncHandler(async (req, res) => {
    const event = req.body;
  
    const userresult= await user_svc.SubscribeEvents(event);
    res.status(userresult?.status).json(userresult)

})
