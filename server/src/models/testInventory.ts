import { model, Schema } from 'mongoose';

const inventorySchema = new Schema({
  _id: Number,
  sku: String,
  description: String,
  instock: Number,
});

const Inventory = model('Inventory', inventorySchema);
export default Inventory;
