import { Model, DataTypes, Sequelize } from "sequelize";
import { Login } from "./login.model";

export class Customer extends Model {
  public id!: number; // ! indicates non-null assertion (Sequelize initializes it)
  public username!: string;
  public user_id!: number;
  public email!: string;
  public password?: string; // ? indicates optional
  public createdAt!: Date;
  public updatedAt!: Date;
  public associate(models: any) {
    // Associations for Wishlist Model
    Customer.belongsTo(models.Login, { foreignKey: "user_id" });
  }
}

export const customerModel = (sequelize: Sequelize) => {
  const Customer = sequelize.define(
    "customers",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "logins",
          key: "id",
        },
      },
      phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.TEXT,
        defaultValue: "inactive",
      },
    
    },
    {
      // Pass the Sequelize instance
      timestamps: true, // Automatically handle timestamps
    }
  );
  return Customer;
};
