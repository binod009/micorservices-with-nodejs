
import { apiRequest } from "../utils/apiClient";
import axios from "axios";
import ApiError from "../utils/ApiError";
import Cart from "../models/cart.model";
type cartdataTypes= {
  customer_id: number;
  product_id: number;
  quantity: number;
  price: number;
}
interface StockResponse {
  msg: string; // Response message
  stock: number; // Available stock
}

class cartServices{

  async getcustomerandproductetails(customer_id:string, product_id:string){
    const [customerResponse, productResponse] = await Promise.all([
      apiRequest("GET", `http://localhost:3007/product/api/v1/products/${product_id}`, undefined, undefined),
      apiRequest("GET", 'http://localhost:3007/customer /api/v1/customer/${customer_id}', undefined, undefined),
    ]);
    return [customerResponse, productResponse];
   }

  async addtocartService(cartdata: cartdataTypes, token: string) {
  
    const stockres = await apiRequest<StockResponse>(
      "GET",
      `http://localhost:3007/product/api/v1/products/stock/${cartdata.product_id}`,
      token
    );

    if (cartdata.quantity > stockres.data.stock) {
      return {
        status: 400,
        msg: `Not enough in the stock, Available stock ${stockres.data.stock}`,
        stock: stockres.data.stock,
      };
    } else {
      // if some of the value is not accurate req goes on with no error thrown.
      
      const dbresult= await Cart.create(cartdata);
   
      console.log(dbresult.dataValues);
      return {
        status: 201,
        msg: "success",
        result: dbresult.dataValues,
      };
    }
  }
  async getallCartData() {
    const cartdata = await Cart.findAll();
    if (!cartdata) {
      throw new ApiError("no cart data", 404);
    } else {
      console.log('this is cartdata',cartdata);
      return { status: 200, msg: "success", result: cartdata};
    }
  }
}

export default new cartServices();
