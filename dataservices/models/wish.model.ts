import { DataTypes, Model, Sequelize } from "sequelize";

export class Wishlist extends Model {
  public id!: number;
  public customer_id!: number;
  public product_id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Static method to define associations
  public associate(models: any) {
    // Associations for Wishlist Model
    Wishlist.belongsTo(models.Customer, { foreignKey: "customer_id" });
    Wishlist.belongsTo(models.Product, { foreignKey: "product_id" });
  }
}

export const WishModel = (sequelize: Sequelize) => {
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
        references: {
          model: "customers", // Ensure this references the correct table name
          key: "id",
        },
      },
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "products", // Ensure this references the correct table name
          key: "id",
        },
      },
      createdAt: {
        type:DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type:DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
     
    }
  );

  return Wishlist;
};
