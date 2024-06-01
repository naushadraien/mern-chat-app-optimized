import { Router } from 'express';

import {
  createNewInventory,
  createNewOrders,
  getExtraOrderManipulation,
  getOrdersData,
  getPipelinedOrdersData,
  getUsersData,
} from '../controllers/test';
import { authenticateUser } from '../middlewares/authenticateUser';

const app = Router();

app.use(authenticateUser);
app.get('/', getUsersData);
app.get('/orders', getOrdersData);
app.get('/orders-pipelined', getPipelinedOrdersData);
app.get('/some-extra', getExtraOrderManipulation);
app.post('/order/new', createNewOrders);
app.post('/inventory/new', createNewInventory);

export default app;
