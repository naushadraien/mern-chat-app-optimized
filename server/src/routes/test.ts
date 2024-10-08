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
import { UserRole } from '../Types/types';
import { onlyAdmin } from '../utils/onlyAdmin';

const router = Router();

router.use(authenticateUser);
router.get('/', getUsersData);
router.get('/orders', onlyAdmin([UserRole.USER, UserRole.ADMIN]), getOrdersData);
router.get('/orders', getOrdersData);
router.get('/orders-pipelined', getPipelinedOrdersData);
router.get('/some-extra', getExtraOrderManipulation);
router.post('/order/new', createNewOrders);
router.post('/inventory/new', createNewInventory);

export default router;
