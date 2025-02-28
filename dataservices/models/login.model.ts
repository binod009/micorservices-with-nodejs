import { Model, Sequelize, DataTypes } from "sequelize";
export class Login extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public status!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export const LoginModel = (sequelize: Sequelize) => {
  Login.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.TEXT,
        defaultValue: "inactive",
      },
    },
    {
      sequelize,

      timestamps: true,
    }
  );

  return Login;
};
