import Pool from "../db";
import Database from "../db";

class UserService extends Database {
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

  // create new User
  signUpUser = async (newuserdata: string[]) => {
    return await this.pool.query(
      "INSERT INTO login (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      newuserdata
    );
  };
  // This function updates any column in any table based on column name, value, and id
  updateUser = async (tablename: string, values: string[]): Promise<{}> => {
    // Construct the dynamic SQL query to update the specified column for the given id
    const query = `UPDATE ${tablename} SET status = $1 WHERE id = $2`;
    // Execute the query with the provided values: [new value, record id]
    return await this.pool.query(query, values);
  };
}
export default new UserService();
