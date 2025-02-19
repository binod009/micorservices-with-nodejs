import { QueryResult } from "pg";
import Database from "../db";

class PostServices extends Database {
  constructor() {
    super();
  }
  createPostService = async (
    values: string[]
  ): Promise<QueryResult> => {
    const query =
      "INSERT INTO post (title, description) VALUES ($1, $2) RETURNING *";
    const result = await this.pool.query(query, values);
    return result;
  };

  getAllPostDataService = async (): Promise<{}> => {
    const query = "SELECT * from post";
    const result = await this.pool.query(query);
    return result.rows;
  };
}

export default new PostServices();
