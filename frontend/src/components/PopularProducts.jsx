import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopularProducts } from '@/services/productService';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getPopularProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Invalid response format:', data);
          setError('Failed to load popular products');
        }
      } catch (err) {
        console.error('Error fetching popular products:', err);
        setError('Failed to fetch popular products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleFavoriteClick = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  };

  if (loading) {
    return (
      <div className="my-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chocolate-600 mx-auto"></div>
        <p className="mt-4 text-gray-500 text-sm">Selecting our finest creations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-24 text-center">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <div className='my-28 font-poppins text-[#2B170E]'>
      <div className="flex flex-col items-center text-center space-y-3 mb-12">
        <span className="text-xs font-bold tracking-widest text-[#d4af37] uppercase">Customer Favorites</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D1E11] tracking-tight">Popular Products</h2>
        <div className="w-12 h-1 bg-[#d4af37] rounded-full mt-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, idx) => {
          const isFav = isFavorite(product._id);
          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-[#FAF6F0] overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative"
            >
              {/* Product Page Link Wrapper */}
              <Link to={`/product/${product._id}`} className="flex flex-col flex-grow">
                {/* Image & Favorite Toggle Frame */}
                <div className="relative h-60 w-full bg-[#FCFAF7] flex items-center justify-center p-6 overflow-hidden">
                  <img 
                    src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=Chocolate'}
                    alt={product.name}
                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                  />
                  
                  {/* Floating tags */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-1.5">
                    {product.stock === 0 ? (
                      <span className="bg-red-50 text-red-600 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                        Out of Stock
                      </span>
                    ) : product.price < 15 ? (
                      <span className="bg-[#dfb15b]/20 text-[#3D1E11] text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#d4af37]/35 shadow-sm">
                        Best Seller
                      </span>
                    ) : null}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleFavoriteClick(e, product._id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all z-10"
                    aria-label="Add to favorites"
                  >
                    <FontAwesomeIcon 
                      icon={faHeart} 
                      className={isFav ? 'text-red-500 scale-110 transition-transform' : 'text-gray-400'} 
                    />
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span className="bg-[#3D1E11]/5 px-2.5 py-1 rounded-full font-semibold">{product.category}</span>
                    
                    {/* Star Rating */}
                    <div className="flex items-center space-x-1 font-semibold text-gray-700">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                      <span>{product.rating ? product.rating.toFixed(1) : "New"}</span>
                      {product.numReviews > 0 && (
                        <span className="text-gray-400 font-normal">({product.numReviews})</span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#3D1E11] group-hover:text-chocolate-600 transition-colors line-clamp-1 mb-2">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-grow">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#FAF6F0]">
                    <span className="text-xl font-extrabold text-[#3D1E11]">
                      ${product.price.toFixed(2)}
                    </span>

                    {/* Add to Cart button */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.stock === 0}
                      className="bg-[#3D1E11] hover:bg-gold-gradient hover:text-[#2B170E] disabled:bg-gray-200 disabled:text-gray-400 text-[#FCFAF7] w-10 h-10 rounded-full flex items-center justify-center shadow transition-all duration-300 hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
                      aria-label="Add to cart"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="text-sm" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularProducts;
