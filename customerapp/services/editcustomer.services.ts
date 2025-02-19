import Database from "../db";

interface Idata {
  id: string;
  username: string;
  password: string;
  email: string;
}

interface Icustomer {
  user_id: string;
  phone: string;
  address: string;
  status: string;
}

interface IwishlistData {
  customer_id: string;
  product_id: string;
}

interface Ipayload{
  event: {},
  data:{}
}

class EditCustomerServices extends Database {
  async createCustomer(data: Icustomer) {
    const query = `INSERT INTO customers (user_id,phone,address,status) VALUES($1,$2,$3,$4) RETURNING *`;
    const createuser = await this.pool.query(query, [
      data.user_id,
      data.status,
      data.address,
      data.phone,
    ]);
    return createuser.rows[0];
  }

  //add data to wishlist
  async addWhishList(data: IwishlistData) {
    const query = `INSERT INTO wishlists (customer_id, product_id) VALUES($1,$2) RETURNING *`;
    const result = await this.pool.query(query, [
      data.customer_id,
      data.product_id,
    ]);
    return result.rows[0];
  }

  async deleteWishList(id: string) {
    const query = `DELETE FROM wishlists WHERE id = $1 RETURNING *`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0]; // This will return the deleted row (if any) after the delete operation
  }

  async getWishList(customerid: string) {
    const query = `
       SELECT 
    w.id AS wishlist_id,
    w.customer_id,
    p.id AS product_id,
    p.name AS product_name,
    p.description,
    p.price,
    w.added_at
FROM wishlists w
JOIN products p ON w.product_id = p.id
WHERE w.customer_id = 1;
    `;
    const result = await this.pool.query(query, [customerid]);
    return result.rows[0];
  }

  // update customer data
  async updateCustomer(data: Idata) {
    await this.findById(data.id);
    const query = `
        UPDATE login
        SET email = $1, password = $2, username = $3
        WHERE id = $4 RETURNING *
      `;
    const values = [data.email, data.password, data.username, data.id];
    const updated = await this.pool.query(query, values);
    return updated.rows[0];
  }

  async findById(userId: string) {
    const user = await this.pool.query("SELECT * FROM login WHERE ID= $1", [
      userId,
    ]);
    console.log("this is user", user.rows[0]);
    return user.rows[0];
  }
  
  async ManageProduct() {
  
}


  async SubscribeEvents(payload:Ipayload) {
    const { event, data } = payload;
    switch (event) {
      case 'GET PRODUCT':
        this.ManageProduct();
        break;
}

}






}

export default EditCustomerServices;
