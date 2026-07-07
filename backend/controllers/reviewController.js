import Review from '../models/Review.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';

export default function reviewController({ invalidateCache }) {
  // Get reviews for a product
  const getProductReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [{ model: User, as: 'user', attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });
    
    // Format response to include standard Mongoose _id mapping
    const transformed = reviews.map(r => ({
      _id: r.id,
      rating: r.rating,
      comment: r.comment,
      user: r.user,
      createdAt: r.createdAt
    }));
    
    res.json(transformed);
  });

  // Add a review
  const addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ where: { userId, productId } });
    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this product');
    }

    // Create new review
    const review = await Review.create({
      userId,
      productId,
      rating,
      comment
    });

    // Update product average rating and review count
    const allReviews = await Review.findAll({ where: { productId } });
    const averageRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    product.rating = averageRating;
    product.numReviews = allReviews.length;
    await product.save();

    // Invalidate cache for this product
    await invalidateCache(`products*${productId}*`);

    // Fetch review with populated user details
    const populatedReview = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'user', attributes: ['name'] }]
    });

    res.status(201).json({
      _id: populatedReview.id,
      rating: populatedReview.rating,
      comment: populatedReview.comment,
      user: populatedReview.user,
      createdAt: populatedReview.createdAt
    });
  });

  // Update a review
  const updateReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user.id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this review');
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Update product average rating
    const product = await Product.findByPk(review.productId);
    const allReviews = await Review.findAll({ where: { productId: review.productId } });
    const averageRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    product.rating = averageRating;
    product.numReviews = allReviews.length;
    await product.save();

    // Invalidate cache for this product
    await invalidateCache(`products*${review.productId}*`);

    const populatedReview = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'user', attributes: ['name'] }]
    });

    res.json({
      _id: populatedReview.id,
      rating: populatedReview.rating,
      comment: populatedReview.comment,
      user: populatedReview.user,
      createdAt: populatedReview.createdAt
    });
  });

  // Delete a review
  const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user.id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    const productId = review.productId;
    await review.destroy();

    // Update product average rating and review count
    const product = await Product.findByPk(productId);
    const allReviews = await Review.findAll({ where: { productId } });
    const averageRating = allReviews.length > 0 
      ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length 
      : 0;
    product.rating = averageRating;
    product.numReviews = allReviews.length;
    await product.save();

    // Invalidate cache for this product
    await invalidateCache(`products*${productId}*`);

    res.json({ message: 'Review deleted successfully' });
  });

  return {
    getProductReviews,
    addReview,
    updateReview,
    deleteReview
  };
}