import { Model, ModelStatic, where } from "sequelize";
import LoginModelRegistery from "../models/login.model";
import ApiError from "../utils/ApiError";
import { userInfo } from "os";

class UserService {
  private modelRegistry: LoginModelRegistery;
  public loginModel: ModelStatic<Model<any, any>> | null = null;

  constructor() {
    this.modelRegistry = LoginModelRegistery.getInstance();
    this.initialize();
  }
  // find user based on email
  // getUserByEmail = async (email: string) => {
  //   const result = await this.pool.query(
  //     "SELECT * FROM login WHERE email = $1",
  //     [email]
  //   );
  //   return result;
  // };
  private async initialize() {
    // Initialize the model if it's not already initialized
    if (!this.loginModel) {
      await this.modelRegistry.initModel(); // Wait for the model to initialize
      this.loginModel = this.modelRegistry.getLoginModel(); // Now assign the model
    }
  }
  // create new User
  signUpUser = async (newuserdata: any) => {
    try {
      if (!this.loginModel) throw new ApiError("model not initialized", 500);
      const user = await this.loginModel.create(newuserdata);
      const result = await user.save();;
      if (result) {
        return {
          status: 201,
          msg: "register successfully",
          result: result.dataValues,
        }
      }
    return { status: 500, msg: "error creating user" };
    } catch (error:any) {
      console.log("creating usererror===>", error);
    }
  };

  updateUser = async (status: string, userId: number) => {
    if (!this.loginModel) throw new ApiError("model not initialized", 500);
    const [affectedRows] = await this.loginModel.update(
      { status: status },
      {
        where: {
          id: userId.toString(),
        },
      }
    );

    if (affectedRows > 0) {
      console.log(`User with ID ${userId} updated successfully.`);
    } else {
      console.log(
        `No user found with ID ${userId}, or status is already the same.`
      );
    }

    return affectedRows;
  };

  async getUserById(userId: string) {
    if (!this.loginModel) throw new ApiError("model not initialized", 500);
    const user = await this.loginModel.findOne({ where: { id: userId } });
    if (user) {
      return { status: 200, msg: "success", result: user.dataValues };
    }
    return { status: 404, msg: "user doesnot exist !" };
  }

  // when other services subscribe the event this is fired;
  async SubscribeEvents(events: {
    event: string;
    payload: { user_id: string };
  }) {
    let { payload, event } = events;

    let result;
    switch (event) {
      case "GET USER":
        result = await this.getUserById(payload.user_id);
    }
    return result || { status: 500, msg: "unknown error finding user" };
  }
}
export default UserService;
