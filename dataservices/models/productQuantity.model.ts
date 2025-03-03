import { DataTypes, Model, Sequelize } from "sequelize";

export class product_quantities extends Model {
  public id!: number;
  public product_id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Static method to define associations
  public associate(models: any) {
    // Associations for Wishlist Model
    product_quantities.belongsTo(models.Product, { foreignKey: "product_id" });
  }
}

// exporting moddel;
export const ProductquantitiesModel = (sequelize: Sequelize) => {
  const productquantitiesModel = sequelize.define(
    "product_quantities",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "products", // Ensure this references the correct table name
          key: "id",
        },
      },
    },
    {
      timestamps: true,
    }
  );

  return productquantitiesModel;
};
