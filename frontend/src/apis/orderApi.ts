import baseApi from "./baseApi"

export interface Order { 
orderId :string
customerId :string
userId :string
promoId :string
promoCode : string
orderDate :string
totalAmount :number
status :string
createdAt :string
updatedAt :string
}
export interface OrderItem {  
orderItemId :string
orderId : Order | number
productId :  number
productName :string
barcode :string
quantity :number
price :number
subtotal :number
createdAt :string
updatedAt :string
} 
export const getAllOrders = async ()=> {
try{
const {data} = await baseApi.get('/Orders');
return data;
}catch(error){
    console.error('Error fetching orders:', error);
    throw error;
}

}