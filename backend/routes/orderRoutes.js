import express from 'express';
import {
    getMyOrders,
    getOrderById,
    getOrders,
    createOrder,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get my orders
router.route('/myorders').get(protect, getMyOrders);

// Get order by ID
router.route('/:id').get(protect, getOrderById);

// Order creation & list
router.route('/')
    .get(protect, admin, getOrders)
    .post(protect, createOrder);

export default router;