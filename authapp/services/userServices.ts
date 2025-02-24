import { where } from "sequelize";
import Pool from "../db";
import Database from "../db";

import { apiRequest } from "../utils/apiRequest";
import loginModel from "../models/login.model";
import LoginModel from "../models/login.model";
class UserService extends Database  {
  constructor() {
    super();
  }
  // find user based on email
  getUserByEmail = async (email: string) => {
    const result = await this.pool.query(
      "SELECT * FROM login WHERE email = $1",
      [email]
    );
    return result;
  };

async getCustomerModel() {
    const customer_model = await apiRequest("GET", "http://localhost:3009/customer-model", undefined, undefined, {});
    return customer_model;
}

  // create new User
  signUpUser = async (newuserdata: any) => {
    const loginSchema = await this.getCustomerModel();
    const login_model = loginModel.getLoginModel(loginSchema.data);
    const user = await login_model.create(newuserdata);
    const result = await user.save();
    return {status:201,msg:'register successfully',result:result.dataValues}
  };

  updateUser = async (status: string, userId: number) => {
    
    const [affectedRows] = await Login.update({ status: status }, {
      where: {
        id: userId.toString()
      }
    });
  
    if (affectedRows > 0) {
      console.log(`User with ID ${userId} updated successfully.`);
    } else {
      console.log(`No user found with ID ${userId}, or status is already the same.`);
    }
  
    return affectedRows;
  };

  async getUserById(userId:string) {
    const user = await Login.findOne({ where: { id: userId } });
    if (user) {
      return { status: 200, msg: 'success', result: user.dataValues };
    }
    return { status:404,msg:"user doesnot exist !"}
}

  // when other services subscribe the event this is fired;
  async SubscribeEvents(events:{event:string,payload:{user_id:string}}) {
    let { payload,event } = events;
    let result;
    switch (event) {
     case 'GET USER':
          result = await this.getUserById(payload.user_id);
}
    return result || {status:500,msg:"unknown error finding user"};
  }
  
}
export default new UserService();
