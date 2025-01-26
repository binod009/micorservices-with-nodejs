const { Pool } = require("pg");
const Database = require("../db");
class UserService extends Database {
  constructor() {
    super();
  }

  // find user based on email
  getUserByEmail = async (email) => {
    const result = await this.pool.query(
      "SELECT * FROM login WHERE email = $1",
      [email]
    );
    return result;
  };

  // create new User
  signUpUser = async (newuserdata) => {
    return await this.pool.query(
      "INSERT INTO login (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      newuserdata
    );
  };
  // This function updates any column in any table based on column name, value, and id
  updateUser = async (tablename, values) => {
    // Construct the dynamic SQL query to update the specified column for the given id
    const query = `UPDATE ${tablename} SET status = $1 WHERE id = $2`;
    // Execute the query with the provided values: [new value, record id]
    return await this.pool.query(query, values);
  };
}

module.exports = new UserService();
