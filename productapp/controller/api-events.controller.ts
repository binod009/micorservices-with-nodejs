import { asyncHandler } from "../utils/asyncHandler";
import prodcutService from "../services/product.services";
const product_svc = new prodcutService();

export const apiEventController = asyncHandler(async (req, res) => {
  const payload = req.body;
  //sending payload to event subscriber;
  const result = await product_svc.SubscribeEvents(payload);

  res.status(400).json(result);
});
