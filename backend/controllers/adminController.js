import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import asyncHandlerMiddleware from '../middleware/asyncHandler.js';
import { Sequelize } from 'sequelize';

const { Op, fn, col } = Sequelize;

export default function adminController({ redisClient, sessionStore, invalidateCache }) {
  // @desc    Get dashboard statistics
  // @route   GET /api/admin/dashboard/stats
  // @access  Private/Admin
  const getDashboardStats = asyncHandlerMiddleware(async (req, res) => {
    const totalOrders = await Order.count();
    const totalProducts = await Product.count();
    const totalUsers = await User.count();
    const totalRevenue = await Order.sum('totalPrice', { where: { isPaid: true } }) || 0;

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: Number(totalRevenue)
    });
  });

  // @desc    Get all orders
  // @route   GET /api/admin/orders
  // @access  Private/Admin
  const getOrders = asyncHandlerMiddleware(async (req, res) => {
    const orders = await Order.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
    });
    res.json(orders);
  });

  // @desc    Get order by ID
  // @route   GET /api/admin/orders/:id
  // @access  Private/Admin
  const getOrderDetails = asyncHandlerMiddleware(async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  });

  // @desc    Update order status
  // @route   PUT /api/admin/orders/:id
  // @access  Private/Admin
  const updateOrderStatus = asyncHandlerMiddleware(async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      order.isDelivered = req.body.isDelivered;
      order.deliveredAt = req.body.isDelivered ? new Date() : null;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  });

  // @desc    Get all products
  // @route   GET /api/admin/products
  // @access  Private/Admin
  const getProducts = asyncHandlerMiddleware(async (req, res) => {
    const products = await Product.findAll({});
    res.json(products);
  });

  // @desc    Create a product
  // @route   POST /api/admin/products
  // @access  Private/Admin
  const createProduct = asyncHandlerMiddleware(async (req, res) => {
    const product = await Product.create({
      name: 'Sample name',
      price: 0.00,
      description: 'Sample description',
      category: 'Dark Chocolate',
      stock: 0,
      images: ['/images/sample.jpg']
    });

    await invalidateCache('products*');
    res.status(201).json({
      _id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      countInStock: product.stock,
      images: product.images
    });
  });

  // @desc    Update a product
  // @route   PUT /api/admin/products/:id
  // @access  Private/Admin
  const updateProduct = asyncHandlerMiddleware(async (req, res) => {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
    } = req.body;

    const product = await Product.findByPk(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      if (image) {
        product.images = [image];
      }
      product.category = category || product.category;
      product.stock = countInStock !== undefined ? countInStock : product.stock;

      const updatedProduct = await product.save();
      await invalidateCache('products*');
      res.json({
        _id: updatedProduct.id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        description: updatedProduct.description,
        category: updatedProduct.category,
        countInStock: updatedProduct.stock,
        images: updatedProduct.images
      });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  });

  // @desc    Delete a product
  // @route   DELETE /api/admin/products/:id
  // @access  Private/Admin
  const deleteProduct = asyncHandlerMiddleware(async (req, res) => {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      await product.destroy();
      await invalidateCache('products*');
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  });

  // @desc    Get all users
  // @route   GET /api/admin/users
  // @access  Private/Admin
  const getUsers = asyncHandlerMiddleware(async (req, res) => {
    const users = await User.findAll({});
    res.json(users);
  });

  // @desc    Register a new user
  // @route   POST /api/admin/users
  // @access  Private/Admin
  const registerUser = asyncHandlerMiddleware(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  });

  // @desc    Update user
  // @route   PUT /api/admin/users/:id
  // @access  Private/Admin
  const updateUser = asyncHandlerMiddleware(async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin !== undefined ? Boolean(req.body.isAdmin) : user.isAdmin;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });

  // @desc    Delete user
  // @route   DELETE /api/admin/users/:id
  // @access  Private/Admin
  const deleteUser = asyncHandlerMiddleware(async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error('Can not delete admin user');
      }
      await user.destroy();
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });

  // @desc    Get sales analytics
  // @route   GET /api/admin/dashboard/sales
  // @access  Private/Admin
  const getAnalytics = asyncHandlerMiddleware(async (req, res) => {
    const sales = await Order.findAll({
      where: {
        isPaid: true,
        createdAt: {
          [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      },
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d'), '_id'],
        [fn('SUM', col('totalPrice')), 'total'],
        [fn('COUNT', col('id')), 'count']
      ],
      group: [fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d')],
      order: [[fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d'), 'ASC']],
      raw: true
    });

    // Parse decimal strings back to floats
    const parsedSales = sales.map(s => ({
      _id: s._id,
      total: Number(s.total) || 0,
      count: Number(s.count) || 0
    }));

    res.json(parsedSales);
  });

  return {
    getDashboardStats,
    getOrders,
    getOrderDetails,
    updateOrderStatus,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getUsers,
    registerUser,
    updateUser,
    deleteUser,
    getAnalytics
  };
}