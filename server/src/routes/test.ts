import { Router } from 'express';

import {
  createNewInventory,
  createNewOrders,
  getOrdersData,
  getUsersData,
} from '../controllers/test';
import { authenticateUser } from '../middlewares/authenticateUser';

const app = Router();

app.use(authenticateUser);
app.get('/', getUsersData);
app.get('/orders', getOrdersData);
app.post('/order/new', createNewOrders);
app.post('/inventory/new', createNewInventory);

export default app;
