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
}

export const customerModel = (sequelize: Sequelize) => {
  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Login,
          key: "id",
        },
      },
      phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "inactive",
      },
    },
    {
      sequelize, // Pass the Sequelize instance
      timestamps: true, // Automatically handle timestamps
    }
  );
  return Customer;
};
