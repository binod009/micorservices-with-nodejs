import { DataTypes, Model, Sequelize } from "sequelize";

import { Customer } from "./customer.model";
import { Product } from "./product.model";

export class Wish extends Model {
  public id!: number;
  public customer_id!: number;
  public product_id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export const WishModel = (sequelize: Sequelize) => {
  Wish.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Customer,
          key: "id",
        },
      },
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Product,
          key: "id",
        },
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Wish", // Optional, just the model name
      tableName: "wishlists", // Explicitly specify the actual table name
    }
  );

  return Wish;
};
