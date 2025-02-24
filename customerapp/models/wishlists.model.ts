import { sequelize } from "../db";
import { DataTypes } from "sequelize";


const Wishlist = sequelize.define(
  "wishlists",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
        type: DataTypes.INTEGER,
    },
    product_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
    }
);


export default Wishlist;
