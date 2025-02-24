import { sequelize } from "../db";
import { DataTypes, Sequelize } from "sequelize";

const productQtyModel = sequelize.define(
  "product_quantity",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
    },
    last_update: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "product_quantity",
    timestamps: false,
  }
);

export default productQtyModel;
