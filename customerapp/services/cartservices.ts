
import { apiRequest } from "../utils/apiClient";
import ApiError from "../utils/ApiError";
import CartModelRegistery from "../models/cart.model";
import { Model, ModelStatic } from "sequelize";
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

   private modelRegistry: CartModelRegistery;
  public cartModel: ModelStatic<Model<any, any>> | null = null;

  constructor() {
    this.modelRegistry = CartModelRegistery.getInstance();
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
    if (!this.cartModel) {
      await this.modelRegistry.initModel(); // Wait for the model to initialize
      this.cartModel = this.modelRegistry.getCartModel(); // Now assign the model
    }
  }

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
      if (!this.cartModel) throw new ApiError("cartmodel not initialized", 500);
      const dbresult= await this.cartModel.create(cartdata);
      console.log(dbresult.dataValues);
      return {
        status: 201,
        msg: "success",
        result: dbresult.dataValues,
      };
    }
  }
  async getallCartData() {
    if (!this.cartModel) throw new ApiError("cart model not initalized", 500);
    const cartdata = await this.cartModel.findAll();
    if (!cartdata) {
      throw new ApiError("no cart data", 404);
    } else {
      console.log('this is cartdata',cartdata);
      return { status: 200, msg: "success", result: cartdata};
    }
  }
}

export default new cartServices();
