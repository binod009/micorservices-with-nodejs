import Database from "../db";
import { transformOrderData } from "../helpers/orderDataFormate";
import ApiError from "../utils/ApiError";
import { apiRequest } from "../utils/apiRequest";

type productServicePayloadTypes = {
  event: string;
  data: { product_id: string; qty: number; operation: string };
};

interface IorderItemData {
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

type AxiosResponseTypes = {
  status: number;
  msg: string;
};


interface IEvents{
  payload: { customer_id: string, order_id: string }
  event:string
}

class orderServices extends Database {
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

    return apiresponse;
  }

  async orderCreation(data: any, token: string, cart_id: string) {
    const query = `INSERT INTO orders (customer_id,order_date,total_amount,order_status,payment_status,payment_method,shipping_address,billing_address,tracking_number) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;

    const values = [
      data.customer_id,
      data.order_date,
      data.total_amount,
      data.order_status,
      data.payment_status,
      data.payment_method,
      data.shipping_address,
      data.billing_address,
      data.tracking_number,
    ];
    const result = await this.pool.query(query, values);
    console.log("result from ordercreate", result.rows[0]);

    if (result.rows.length > 0) {
      const orderitemData = {
        order_id: result.rows[0].order_id,
        product_id: data.product_id,
        quantity: data.quantity,
        unit_price: data.price,
        total_price: data.total_amount,
      };

      await this.createOrderItems(orderitemData, cart_id);

      const payload: productServicePayloadTypes = {
        event: "ORDER CREATED",
        data: {
          operation: "REDUCE",
          product_id: data?.product_id,
          qty: data?.quantity,
        },
      };

      const productservice_response = await this.sendToProductService(
        payload,
        token
      );
      if (productservice_response.status === 200) {
        return {
          status: productservice_response.status,
          msg: "Order created successfully",
          result: result.rows[0],
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
    const result = await this.pool.query(query, values);
    const totalCountResult = await this.pool.query(
      "SELECT COUNT(*) FROM ORDERS"
    );
    const totalCount = parseInt(totalCountResult.rows[0].count, 10);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / values[0]);

    return {
      status: 200,
      result: result.rows,
      totalPages: totalPages,
      totalCount: totalCount,
    };
  }

  async getSingleOrder(id: string) {
    const query = `SELECT 
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
	oi.order_item_id,
	oi.unit_price,
	oi.total_price,
	c.phone AS customer_phone,
	l.email AS customer_Address,
	c.address AS customer_address,
	l.username AS customer_name,
    p.name AS product_name-- Adding product name from the products table
   
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id  -- Joining order_items with orders
JOIN products p ON oi.product_id = p.id  -- Joining products with order_items using product_id
JOIN customers c ON o.customer_id = c.id
JOIN login l on c.user_id = l.id
WHERE o.customer_id = $1`;

    const result = await this.pool.query(query, [id]);
    const finalResult = transformOrderData(result.rows);
    if (result.rowCount === 0) {
      throw ApiError.notFound("given id does not exist");
    } else {
      return {
        status: 200,
        result: finalResult,
      };
    }
  }

  async statusUpdater(order_id: string, order_status: string) {
    const query = `UPDATE orders 
  SET order_status= $1
  WHERE order_id= $2
    `;
    const values = [order_status, order_id];
    const result = await this.pool.query(query, values);
    if (result.rowCount !== 0) {
      return { status: 200, msg: "order status update successfully" };
    } else {
      return { status: 404, msg: "Unknown Error try again later" };
    }
  }





  async createOrderItems(orderitem: IorderItemData, cart_id: string) {
    const createorder_item_query = `
    INSERT INTO orders_items (order_id, product_id, quantity, unit_price, total_price)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
    const values = [
      orderitem.order_id,
      orderitem.product_id,
      orderitem.quantity,
      orderitem.unit_price,
      orderitem.total_price,
    ];

    const createorder_item_result = await this.pool.query(
      createorder_item_query,
      values
    );
    if (createorder_item_result.rowCount === 0) {
      throw new ApiError(500, "Failed to create order item");
    }
    const isCartDeleted = await this.deleteFromCart(cart_id);
    if (isCartDeleted) return true;
  }

  async deleteFromCart(cart_id: string) {
    const removefromcartQuery = `DELETE FROM cart WHERE cart_id=$1`;
    const removecartValue = [cart_id];
    const CartReuslt = await this.pool.query(
      removefromcartQuery,
      removecartValue
    );
    if (CartReuslt.rowCount === 0) {
      console.log("-------------am here--------");
      throw new ApiError(401, `cart with ID ${cart_id} not found`);
    } else {
      return true;
    }
  }


  async deleteOrder(payload: { customer_id: string, order_id: string }) {
    try {
      const query = `DELETE FROM orders where order_id=$1 AND customer_id=$2`;
      const values = [payload.order_id, payload.customer_id];
      const order_delete_result = await this.pool.query(query, values);
      if (order_delete_result.rowCount === 0) {
        throw ApiError.notFound('cusomter id or order_id doesnot Exist');
      } else {
        return { status: 200, msg: "order deleted successfully" }
      }
    } catch (error) {
      throw error;
    }
}

  async SubscribeEvents(events: IEvents) {
    const { payload, event } = events;
    let result;
    switch (event) {
      case 'DELETE ORDER':
        result = await this.deleteOrder(payload);
    }
    return result || { status: 500, msg: "Internal server error" } ;
  }

}

export default orderServices;
