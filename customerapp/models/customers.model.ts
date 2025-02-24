import { sequelize } from "../db";
import { DataTypes} from "sequelize";
import Wishlist from "./wishlists.model";
import  Cart from "./cart.model";

export const defineCustomerModel = (schema:any) => {
    const customer_model = sequelize.define("customers", schema);
    return customer_model;
}


