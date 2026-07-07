import express from 'express';
import productController from '../controllers/productController.js';
import { protect, admin, seller } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';

export default function createProductRouter(redisObjects) {
  const {
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  } = productController(redisObjects);

const router = express.Router();

// Get all products
router.get('/', getProducts);

// Get top products
router.get('/top', getTopProducts);

// Get popular products (sorted by rating)
router.get('/popular', getTopProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Search products
router.get('/search', searchProducts);

// Get product by ID - should be after all specific routes
router.get('/:id', getProductById);

// Product CRUD
router.route('/')
  .post(protect, seller, createProduct);

router.route('/:id/reviews')
  .post(protect, createProductReview);

router.route('/:id')
  .put(protect, seller, updateProduct)
  .delete(protect, seller, deleteProduct);

  return router;
}
