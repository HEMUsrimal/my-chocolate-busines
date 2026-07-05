import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { getProductReviews, addReview } from "../services/reviewService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeart, 
  faShoppingCart, 
  faTruck, 
  faShieldAlt, 
  faStar,
  faCalendarAlt,
  faBox,
  faExchangeAlt,
  faUser,
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faPercent,
  faGift
} from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const { addToCart } = useCart();
  const [review, setReview] = useState({
    rating: 5,
    comment: "",
  });
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        const [productData, reviewsData] = await Promise.all([
          getProductById(id),
          getProductReviews(id)
        ]);
        
        if (productData) {
          setProduct(productData);
          setThumbnail(productData.images[0]);
        } else {
          setError("Product not found");
        }
        
        if (reviewsData) {
          setReviews(reviewsData);
        }
      } catch (err) {
        setError("Failed to load product details");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      setInCart(true);
      toast.success(`${product.name} (x${quantity}) added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({ ...product, quantity });
      navigate("/cart");
    }
  };

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError(null);
      setReviewSuccess(false);

      const newReview = await addReview(id, review);
      setReviews([newReview, ...reviews]);
      setReview({ rating: 5, comment: "" });
      setReviewSuccess(true);
      toast.success("Review submitted!");
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setReviewSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Review submission error:', error);
      setReviewError(error.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] font-poppins">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#3D1E11] mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Unveiling our chocolate masterpiece...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] font-poppins">
        <div className="text-center bg-[#1E100A]/5 border border-chocolate-200 p-8 rounded-2xl max-w-md shadow-sm">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error || "Product not found"}</h2>
          <Link to="/shop" className="bg-[#3D1E11] hover:bg-[#4A2717] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition inline-block">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAF7] font-poppins text-[#2B170E] pb-16">
      
      {/* Breadcrumb section */}
      <div className="bg-[#FCFAF7] border-b border-chocolate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-xs font-semibold text-gray-400" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="hover:text-[#3D1E11] transition-colors">Home</Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-gray-300">/</span>
                <Link to="/shop" className="hover:text-[#3D1E11] transition-colors">Shop</Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-gray-300">/</span>
                <span className="text-[#3D1E11] font-bold">{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-3xl p-6 md:p-10 border border-[#FAF6F0] shadow-sm">
          
          {/* Left Column - Gallery */}
          <div className="lg:col-span-6 flex flex-col md:flex-row-reverse gap-4">
            
            {/* Main Image View */}
            <div className="flex-grow bg-[#FCFAF7] rounded-2xl overflow-hidden border border-[#FAF6F0] p-6 flex items-center justify-center h-[350px] md:h-[450px]">
              <img
                src={thumbnail || "/placeholder-image.jpg"}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-md hover:scale-102 transition-transform duration-500"
              />
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-3 flex-shrink-0">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-[#FCFAF7] rounded-xl overflow-hidden border p-1 transition-all ${
                    thumbnail === image 
                      ? 'border-[#d4af37] ring-2 ring-[#d4af37]/20 shadow-md' 
                      : 'border-chocolate-100 hover:border-chocolate-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product details */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#3D1E11]/5 px-3 py-1 rounded-full text-xs font-bold text-chocolate-800">
                  {product.category}
                </span>
                
                {product.stock > 0 ? (
                  <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                    Out of Stock
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-[#3D1E11] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Star rating summary */}
              <div className="flex items-center space-x-2 pb-2">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {product.rating ? product.rating.toFixed(1) : "New"} ({product.numReviews || 0} reviews)
                </span>
              </div>

              <hr className="border-chocolate-100" />

              {/* Price display */}
              <div className="py-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-chocolate-900">${product.price?.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 font-medium">Inclusive of all local import taxes</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-chocolate-900 uppercase tracking-wider">Product Info</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
              </div>

              {/* Trust highlights checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FCFAF7] p-4 rounded-2xl border border-[#FAF6F0] text-xs font-semibold text-gray-600">
                <div className="flex items-center space-x-2.5">
                  <FontAwesomeIcon icon={faTruck} className="text-[#d4af37] w-4" />
                  <span>Isothermal Packaging Included</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-[#d4af37] w-4" />
                  <span>Secure Premium Checkout</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-[#d4af37] w-4" />
                  <span>Freshness Guaranteed</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <FontAwesomeIcon icon={faExchangeAlt} className="text-[#d4af37] w-4" />
                  <span>30 Days Returns & Refund Policy</span>
                </div>
              </div>
            </div>

            {/* Quantity controls and Cart triggers */}
            <div className="space-y-4 pt-4 border-t border-chocolate-100">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                
                {/* Quantity selector */}
                <div className="flex items-center justify-between border border-chocolate-200 rounded-xl px-4 py-2.5 bg-[#FCFAF7] w-full sm:w-auto space-x-6">
                  <button
                    onClick={decrement}
                    disabled={quantity <= 1}
                    className="text-[#3D1E11] hover:text-[#aa704e] disabled:opacity-30 font-extrabold text-lg px-2 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-sm w-6 text-center">{quantity}</span>
                  <button
                    onClick={increment}
                    disabled={quantity >= product.stock}
                    className="text-[#3D1E11] hover:text-[#aa704e] disabled:opacity-30 font-extrabold text-lg px-2 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full sm:flex-grow bg-[#3D1E11] hover:bg-gold-gradient hover:text-[#2B170E] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/10 transition active:scale-[0.98] cursor-pointer"
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span>Add to Shopping Bag</span>
                </button>
              </div>

              {/* Quick Checkout */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full border border-chocolate-200 hover:border-[#3D1E11] hover:bg-white text-chocolate-800 font-bold py-3 px-6 rounded-xl text-sm transition cursor-pointer"
              >
                Express Checkout
              </button>
            </div>

          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-16 bg-white rounded-3xl border border-[#FAF6F0] p-6 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-chocolate-100">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#3D1E11]">Client Reviews</h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">What our luxury chocolate connoisseurs think</p>
            </div>
            
            <div className="flex items-center space-x-3 bg-[#FCFAF7] px-4 py-2.5 rounded-xl border border-[#FAF6F0]">
              <span className="text-2xl font-black text-chocolate-900">{product.rating ? product.rating.toFixed(1) : "New"}</span>
              <div className="flex flex-col">
                <div className="flex text-yellow-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.numReviews || 0} Ratings</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left side form */}
            <div className="lg:col-span-5 bg-[#FCFAF7] rounded-2xl p-6 border border-chocolate-200 h-fit">
              <h3 className="text-base font-bold text-[#3D1E11] mb-4">Share Your Taste Experience</h3>
              {!isAuthenticated ? (
                <div className="text-center py-6">
                  <p className="text-xs text-gray-500 font-semibold mb-4">Sign in to write a review for this product</p>
                  <Link
                    to="/login"
                    state={{ from: `/product/${id}` }}
                    className="inline-block bg-[#3D1E11] hover:bg-[#4A2717] text-white text-xs font-bold py-2.5 px-6 rounded-full shadow"
                  >
                    Log In
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReview({ ...review, rating: star })}
                          className="focus:outline-none cursor-pointer transform hover:scale-110 active:scale-95 transition"
                        >
                          <FontAwesomeIcon
                            icon={faStar}
                            className={`w-6 h-6 ${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Comment</label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={review.comment}
                      onChange={(e) => setReview({ ...review, comment: e.target.value })}
                      className="p-3 w-full rounded-xl bg-white border border-chocolate-200 text-sm text-[#2B170E] focus:outline-none focus:border-[#3D1E11] transition placeholder-gray-400"
                      placeholder="Describe the texture, smoothness, and flavor..."
                      required
                    />
                  </div>

                  {reviewError && (
                    <div className="flex items-center text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full bg-[#3D1E11] hover:bg-[#4A2717] text-white font-bold py-3 px-4 rounded-xl text-xs shadow hover:shadow-lg active:scale-[0.98] transition cursor-pointer"
                  >
                    {reviewLoading ? (
                      <span className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                        Submitting Review...
                      </span>
                    ) : (
                      'Publish Review'
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right side list */}
            <div className="lg:col-span-7 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-[#FCFAF7] rounded-2xl border border-dashed border-chocolate-200">
                  <p className="text-sm text-gray-500 font-medium">Be the first to review this chocolate bar! 🍫</p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-[#FCFAF7] rounded-2xl p-5 border border-[#FAF6F0] shadow-2xs">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-xs text-[#2B170E] font-extrabold uppercase">
                            {review.user?.name?.charAt(0) || "C"}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#3D1E11]">{review.user?.name || 'Anonymous client'}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              {new Date(review.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-yellow-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 leading-relaxed pl-1">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Product;
