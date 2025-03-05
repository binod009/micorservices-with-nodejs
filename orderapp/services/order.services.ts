import { Model, ModelStatic, QueryTypes } from "sequelize";

import { InputDataItem, transformOrderData } from "../helpers/orderDataFormate";
import OrderModelRegistery from "../model/order.model";
import ApiError from "../utils/ApiError";
import { apiRequest } from "../utils/apiRequest";
import OrderItemModelRegistery from "../model/orderItem.model";
import { sequelize } from "../db";

type productServicePayloadTypes = {
  event: string;
  data: { product_id: string; qty: number; operation: string };
};

type createOrderItemsType = { status: number; msg: string } | boolean;

type orderItemDataType = {
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type apiResponseType = {
  status: number;
  msg: string;
};

type AxiosResponseTypes = {
  status: number;
  msg: string;
};

interface IEvents {
  payload: { customer_id: string; order_id: string };
  event: string;
}

class orderServices {
  private modelRegistry: OrderModelRegistery;
  private orderItemmodelRegistry: OrderItemModelRegistery;
  public orderModel: ModelStatic<Model<any, any>> | null = null;
  public orderItemModel: ModelStatic<Model<any, any>> | null = null;

  constructor() {
    this.modelRegistry = OrderModelRegistery.getInstance();
    this.orderItemmodelRegistry = OrderItemModelRegistery.getInstance();
    this.initialize();
  }
  // find user based on email
  // getUserByEmail = async (email: string) => {
  //   const result = await this.pool.query(
  //     "SELECT * FROM login WHERE email = $1",
  //     [email]
  //   );
  //   return result;
  // };
  private async initialize() {
    // Initialize the model if it's not already initialized
    if (!this.orderModel) {
      await this.modelRegistry.initModel(); // Wait for the model to initialize
      this.orderModel = this.modelRegistry.getOrderModel(); // Now assign the model
    }
    if (!this.orderItemModel) {
      await this.orderItemmodelRegistry.initModel();
      this.orderItemModel = this.orderItemmodelRegistry.getOrderItemModel();
    }
  }
  async sendToProductService(
    payload: productServicePayloadTypes,
    token: string
  ) {
    const apiresponse = await apiRequest<AxiosResponseTypes>(
      "PATCH",
      "http://localhost:3007/product/api/v1/api-event",
      token,
      undefined,
      payload
    );
    console.log('productevent response', apiresponse);
    return apiresponse;
  }

  async orderCreation(data: any, token: string, cart_id: string) {
   
    // const query = `INSERT INTO orders (customer_id,order_date,total_amount,order_status,payment_status,payment_method,shipping_address,billing_address,tracking_number) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;

    // const values = [
    //   data.customer_id,
    //   data.order_date,
    //   data.total_amount,
    //   data.order_status,
    //   data.payment_status,
    //   data.payment_method,
    //   data.shipping_address,
    //   data.billing_address,
    //   data.tracking_number,
    // ];
    const result = await this.orderModel?.create(data);
  
    if (result) {
      const orderitemData = {
        order_id: result.dataValues.order_id,
        product_id: data.product_id,
        quantity: data.quantity,
        unit_price: data.price,
        total_price: data.total_amount,
      };

      await this.createOrderItems(orderitemData, cart_id, token);

      const payload: productServicePayloadTypes = {
        event: "ORDER CREATED",
        data: {
          operation: "REDUCE",
          product_id: data?.product_id,
          qty: data?.quantity,
        },
      };
console.log("this is payload-0-0->",payload)
      const productservice_response = await this.sendToProductService(
        payload,
        token
      );
      console.log("This is productservices events response", productservice_response);
      if (productservice_response.status === 200) {
        return {
          status: productservice_response.status,
          msg: "Order created successfully",
          result: result.dataValues,
        };
      } else {
        return { status: 404, msg: "Unknow Error, Try Again !" };
      }
    } else {
      return { status: 400, msg: "order creation failed" };
    }
  }

  async getAllOrders(values: number[]) {
    const query = `SELECT * FROM orders LIMIT $1  OFFSET $2`;
    const result = await this.orderModel?.findAll({
      limit: values[0],
      offset: values[1],
    });
    const totalCount = await this.orderModel?.count();
    // Calculate total pages
    const totalPages = Math.ceil(totalCount! / values[0]);

    return {
      status: 200,
      result: result,
      totalPages: totalPages,
      totalCount: totalCount,
    };
    return { status: 200, msg: "yes" };
  }

  async getSingleOrder(id: string) {
    const query = ` SELECT 
    o.order_id,
    o.customer_id,
    o.order_date,
    o.total_amount,
    o.order_status,
    o.payment_status,
    o.payment_method,
    o.shipping_address,
    o.billing_address,
    o.tracking_number,
    oi.product_id,
    p.product_image,
	oi.order_items_id,
	oi.unit_price,
	oi.total_price,
	c.phone AS customer_phone,
	l.email AS customer_Address,
	c.address AS customer_address,
	l.username AS customer_name,
    p.name AS product_name-- Adding product name from the products table
   
FROM orders o
JOIN orders_items oi ON o.order_id = oi.order_id  -- Joining order_items with orders
JOIN products p ON oi.product_id = p.id  -- Joining products with order_items using product_id
JOIN customers c ON o.customer_id = c.id
JOIN logins l on c.user_id = l.id
WHERE o.customer_id = :id`;

    const [results] = await sequelize.query(query, {
      replacements: { id },
      type: QueryTypes.SELECT, // Use SELECT since it's a read operation
      raw: true, // Optional: Returns plain JSON data
    });
 
    const finalResult = transformOrderData(Array.isArray(results) ? results : [results]);
    if (!results) {
      throw ApiError.notFound("given id does not exist");
    } else {
      return {
        status: 200,
        result: finalResult,
      };
    }
    return { status: 200, msg: "yes" };
  }

  async statusUpdater(order_id: string, order_status: string) {
    //   const query = `UPDATE orders
    // SET order_status= $1
    // WHERE order_id= $2
    //   `;
    //   const values = [order_status, order_id];
    const result = await this.orderModel?.update(
      { order_status: order_status },
      {
        where: {
          order_id: order_id,
        },
      }
    );
    if (result) {
      return { status: 200, msg: "order status update successfully" };
    } else {
      return { status: 404, msg: "Unknown Error try again later" };
    }
  }

  async createOrderItems(
    orderitem: orderItemDataType,
    cart_id: string,
    token: string
  ): Promise<createOrderItemsType> {
    //   const createorder_item_query = `createOrderItems
    //   INSERT INTO orders_items (order_id, product_id, quantity, unit_price, total_price)
    //   VALUES ($1, $2, $3, $4, $5)
    //   RETURNING *;
    // `;
    //   const values = [
    //     orderitem.order_id,
    //     orderitem.product_id,
    //     orderitem.quantity,
    //     orderitem.unit_price,
    //     orderitem.total_price,
    //   ];

    if (!this.orderItemModel) throw ApiError.internal("Model not initialized");
     const createorder_item_result = await this.orderItemModel.create(orderitem);

    if (!createorder_item_result) {
      throw new ApiError(500, "Failed to create order item");
    }
    const isCartDeleted:createOrderItemsType = await this.deleteFromCart(cart_id, token);
    return isCartDeleted ? true : isCartDeleted;

  }

  async deleteFromCart(
    cart_id: string,
    token: string
  ): Promise<createOrderItemsType> {
    try {
      const result = await apiRequest<apiResponseType>(
        "DELETE",
        "http://localhost:3007/customer/api/v1/cart",
        token,
        undefined,
        { event: "DELETE FROM CART", payload: { cart_id: cart_id } }
      );
      if (result.status === 200) return true;
      else return result.data;
    } catch (error) {
      // return { status: 500, msg: "Internal server error" };
      throw ApiError.internal("Internal server error");
    }
  }



  async deleteOrder(payload: { customer_id: string; order_id: string }) {
    try {
      // const query = `DELETE FROM orders where order_id=$1 AND customer_id=$2`;
      // const values = [payload.order_id, payload.customer_id];
      const order_delete_result = await this.orderModel?.destroy({
        where: {
          order_id: payload.order_id,
          customer_id: payload.customer_id,
        },
      });
      if (!order_delete_result) {
        throw ApiError.notFound("cusomter id or order_id doesnot Exist");
      } else {
        return { status: 200, msg: "order deleted successfully" };
      }
    } catch (error) {
      throw error;
    }
  }

  async SubscribeEvents(events: IEvents) {
    const { payload, event } = events;
    let result;
    switch (event) {
      case "DELETE ORDER":
        result = await this.deleteOrder(payload);
    }
    return result || { status: 500, msg: "Internal server error" };
  }
}

export default orderServices;
