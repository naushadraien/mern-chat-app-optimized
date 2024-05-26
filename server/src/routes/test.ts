import { Router } from 'express';

import {
  createNewInventory,
  createNewOrders,
  getExtraOrderManipulation,
  getOrdersData,
  getUsersData,
} from '../controllers/test';
import { authenticateUser } from '../middlewares/authenticateUser';

const app = Router();

app.use(authenticateUser);
app.get('/', getUsersData);
app.get('/orders', getOrdersData);
app.get('/some-extra', getExtraOrderManipulation);
app.post('/order/new', createNewOrders);
app.post('/inventory/new', createNewInventory);

export default app;
