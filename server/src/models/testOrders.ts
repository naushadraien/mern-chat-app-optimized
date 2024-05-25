import { model, Schema } from 'mongoose';

const ordersSchema = new Schema(
  {
    _id: Number,
    name: String,
    size: String,
    price: Number,
    quantity: Number,
    date: Date,
  },
  { timestamps: true }
);

const Orders = model('Order', ordersSchema);

export default Orders;
