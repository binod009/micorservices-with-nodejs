import { asyncHandler } from "../utils/asyncHandler";

export const ApiEventHandler = asyncHandler(async (req, res) => {
    const { payload, event } = req.body;
    // service.subscribeEvents(payload);
    console.log('====>customer event is running');
})