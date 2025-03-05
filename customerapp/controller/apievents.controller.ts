import { asyncHandler } from "../utils/asyncHandler";
import cart_svc from "../services/cartservices";

export const ApiEventHandler = asyncHandler(async (req, res) => {
  const result = await cart_svc.subscribeCarteEvents(req.body);
  res.status(result.status).json(result);
});
