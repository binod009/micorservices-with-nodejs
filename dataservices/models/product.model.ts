import { Model, Sequelize, DataTypes } from "sequelize";

export class Product extends Model {
  public id!: number;
  public customer_id!: number;
  public product_id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Static method to define associations
  public associate(models: any) {
    // Associations for Wishlist Model
  }
}

export const productModel = (sequelize: Sequelize) => {
  const Product = sequelize.define(
    "products",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      slug: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      product_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName:"products"
    }
  );

  return Product;
};
