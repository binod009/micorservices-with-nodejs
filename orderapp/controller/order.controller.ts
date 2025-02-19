import { asyncHandler } from "../utils/asyncHandler";
import orderServices from "../services/order.services";
const order_svc = new orderServices();

export const createOrder = asyncHandler(async (req, res) => {
  const data = req.body;
  const token = req.cookies.Acs_tkn;
  
  const result = await order_svc.orderCreation(data, token,req.query.cart_id as string);
  res.status(result.status).json(result);
});

// fix the error for pagination ok..
export const getallOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const offset = parseInt(req.query.pageSize as string) || 10;
  const limit = (page - 1) * offset;
  const result = await order_svc.getAllOrders([offset,limit]);
  res.status(result?.status).json(result);
});

export const getOrder = asyncHandler(async (req, res) => {
  const id = req.params.id as string;
  const result = await order_svc.getSingleOrder(id);
  res.status(result?.status).json(result);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {

  const result = await order_svc.statusUpdater(req.params.order_id, req.query.status as string);
  res.status(result?.status).json(result);
})


export const deleteOrder = asyncHandler(async (req, res) => {
  const result = await order_svc.SubscribeEvents(req.body);
  res.status(result?.status).json(result);
})

