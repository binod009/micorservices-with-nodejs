
interface OrderItem {
    order_item_id: number;
    product_id: number;
    product_name: string;
    unit_price: string;
    product_image: string;
    total_price: string;
  }
  
  // Type for Customer Details
  interface CustomerDetails {
    customer_id: number;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
  }
  
  // Type for Grouped Order
  interface GroupedOrder {
    order_id: number;
    order_date: string;
    total_amount: string;
    order_status: string;
    payment_status: string;
    payment_method: string;
    shipping_address: string;
    billing_address: string;
    tracking_number: string;
    customer_details: CustomerDetails;
    order_items: OrderItem[];
  }
  
  // Type for Input Data Item
  interface InputDataItem {
    order_id: number;
    order_date: string;
      total_amount: string;
      product_image: string;
    order_status: string;
    payment_status: string;
    payment_method: string;
    shipping_address: string;
    billing_address: string;
    tracking_number: string;
    customer_id: number;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    order_item_id: number;
    product_id: number;
    product_name: string;
    unit_price: string;
    total_price: string;
  }
export const transformOrderData = (data: InputDataItem[]):GroupedOrder[] => {
    const result = [];
    // Group data by order_id
    const groupedOrders = data.reduce((acc: Record<number,GroupedOrder>, item:InputDataItem ) => {
      if (!acc[item.customer_id]) {
        acc[item.customer_id] = {
          order_id: item.order_id,
          order_date: item.order_date,
          total_amount: item.total_amount,
          order_status: item.order_status,
          payment_status: item.payment_status,
          payment_method: item.payment_method,
          shipping_address: item.shipping_address,
          billing_address: item.billing_address,
          tracking_number: item.tracking_number,
          customer_details: {
            customer_id: item.customer_id,
            customer_name: item.customer_name,
            customer_phone: item.customer_phone,
            customer_address: item.customer_address
          },
          order_items: []
        };
        }
  
      // Add order item details
      acc[item.customer_id].order_items.push({
        order_item_id: item.order_item_id,
          product_id: item.product_id,
          product_image:item.product_image,
        product_name: item.product_name,
        unit_price: item.unit_price,
        total_price: item.total_price
      });
       
      return acc;
    }, {});
    
   // Convert the grouped orders into an array
    for (const order in groupedOrders) {
      result.push(groupedOrders[order]);
    }
  
    return result;
  };