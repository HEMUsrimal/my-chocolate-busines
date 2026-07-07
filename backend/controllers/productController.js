import Product from '../models/Product.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { Sequelize } from 'sequelize';

const { Op } = Sequelize;

export default function productController({ invalidateCache }) {
  // @desc    Fetch all products
  // @route   GET /api/products
  // @access  Public
  const getProducts = asyncHandler(async (req, res) => {
    console.log('🔍 Fetching all products...');
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword;

    const where = keyword
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { description: { [Op.like]: `%${keyword}%` } },
            { category: { [Op.like]: `%${keyword}%` } }
          ]
        }
      : {};

    console.log('📝 Query parameters:', { page, pageSize, keyword });

    try {
      const count = await Product.count({ where });
      console.log('📊 Total products found:', count);

      if (count === 0) {
        console.log('⚠️ No products found in database');
        return res.json({ products: [], page, pages: 0 });
      }

      const products = await Product.findAll({
        where,
        limit: pageSize,
        offset: pageSize * (page - 1),
        order: [['createdAt', 'DESC']]
      });

      console.log('📦 Products retrieved:', products.length);

      // Transform products to match frontend expectations
      const transformedProducts = products.map(product => ({
        _id: product.id,
        name: product.name,
        image: product.images[0] || '/images/default.jpg',
        images: product.images || [],
        brand: 'Chocolate Bravo',
        category: product.category,
        description: product.description,
        price: product.price,
        countInStock: product.stock,
        rating: product.rating || 0,
        numReviews: product.numReviews || 0,
        reviews: [] // Reviews are stored separately or fetched dynamically in MySQL
      }));

      const response = { 
        products: transformedProducts, 
        page, 
        pages: Math.ceil(count / pageSize),
        totalProducts: count
      };
      
      res.json(response);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      res.status(500).json({ 
        message: 'Error fetching products',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // @desc    Fetch single product
  // @route   GET /api/products/:id
  // @access  Public
  const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      // transform single product to match frontend expectation of countInStock
      const transformed = {
        _id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        images: product.images,
        image: product.images[0] || '/images/default.jpg',
        category: product.category,
        countInStock: product.stock,
        rating: product.rating,
        numReviews: product.numReviews,
        brand: 'Chocolate Bravo'
      };
      res.json(transformed);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  });

  // @desc    Fetch products by category
  // @route   GET /api/products/category/:category
  // @access  Public
  const getProductsByCategory = asyncHandler(async (req, res) => {
    const category = req.params.category;
    const products = await Product.findAll({ where: { category } });
    
    const transformed = products.map(product => ({
      _id: product.id,
      name: product.name,
      image: product.images[0] || '/images/default.jpg',
      images: product.images || [],
      brand: 'Chocolate Bravo',
      category: product.category,
      description: product.description,
      price: product.price,
      countInStock: product.stock,
      rating: product.rating || 0,
      numReviews: product.numReviews || 0
    }));

    res.json(transformed);
  });

  // @desc    Search products
  // @route   GET /api/products/search
  // @access  Public
  const searchProducts = asyncHandler(async (req, res) => {
    const { keyword } = req.query;
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } }
        ]
      }
    });

    const transformed = products.map(product => ({
      _id: product.id,
      name: product.name,
      image: product.images[0] || '/images/default.jpg',
      images: product.images || [],
      brand: 'Chocolate Bravo',
      category: product.category,
      description: product.description,
      price: product.price,
      countInStock: product.stock,
      rating: product.rating || 0,
      numReviews: product.numReviews || 0
    }));

    res.json(transformed);
  });

  // @desc    Create a product
  // @route   POST /api/products
  // @access  Private/Admin
  const createProduct = asyncHandler(async (req, res) => {
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
  // @route   PUT /api/products/:id
  // @access  Private/Admin
  const updateProduct = asyncHandler(async (req, res) => {
    const {
      name,
      price,
      description,
      images,
      category,
      countInStock,
    } = req.body;

    const product = await Product.findByPk(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.images = images || product.images;
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
  // @route   DELETE /api/products/:id
  // @access  Private/Admin
  const deleteProduct = asyncHandler(async (req, res) => {
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

  // @desc    Create new review
  // @route   POST /api/products/:id/reviews
  // @access  Private
  const createProductReview = asyncHandler(async (req, res) => {
    // Reviews are managed in the reviewController and mapped through the Review table.
    // For legacy compat, we can define it or redirect to the reviews routes.
    res.status(400);
    throw new Error('Please use the /api/reviews endpoints to manage product reviews.');
  });

  // @desc    Get top rated products
  // @route   GET /api/products/top
  // @access  Public
  const getTopProducts = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 6;
    const products = await Product.findAll({
      order: [
        ['rating', 'DESC'],
        ['numReviews', 'DESC']
      ],
      limit
    });

    const transformedProducts = products.map(product => ({
      _id: product.id,
      name: product.name,
      image: product.images[0] || '/images/default.jpg',
      images: product.images || [],
      brand: 'Chocolate Bravo',
      category: product.category,
      description: product.description,
      price: product.price,
      countInStock: product.stock,
      rating: product.rating || 0,
      numReviews: product.numReviews || 0,
      reviews: []
    }));

    res.json(transformedProducts);
  });

  return {
    getProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts,
  };
}