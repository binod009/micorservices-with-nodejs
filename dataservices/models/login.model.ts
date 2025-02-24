import { Model, Sequelize, DataTypes } from "sequelize";
export class Login extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "login",
      timestamps: true,
    }
  );

  return Login;
};
