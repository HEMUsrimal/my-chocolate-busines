import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faArrowLeft,
  faShoppingCart,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/productService';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const FavoritesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error('Received non-array data:', data);
          setProducts([]);
        }
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleFavoriteToggle = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] font-poppins">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#3D1E11] mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 font-semibold">Opening your favorite selections box...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] font-poppins">
        <div className="text-center bg-[#1E100A]/5 border border-chocolate-200 p-8 rounded-2xl max-w-md shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Occurred</h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  const favoriteProducts = products.filter(product => favorites.includes(product._id));

  return (
    <div className="container mx-auto px-4 py-10 font-poppins text-[#2B170E]">
      <div className="mb-10">
        <Link to="/shop" className="text-chocolate-600 hover:text-chocolate-850 flex items-center gap-2 text-sm font-semibold">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Shop</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#3D1E11] mt-4 tracking-tight">Your Favorite Chocolates</h1>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-3xl border border-[#FAF6F0] p-8 shadow-xs">
          <FontAwesomeIcon 
            icon={faHeart} 
            className="text-5xl text-chocolate-300 opacity-60 mb-4"
          />
          <h2 className="text-lg font-bold text-chocolate-900 mb-2">No Favorites Added Yet</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
            Explore our artisanal chocolate collections and tap the heart icon to save products to your personal favorites catalog.
          </p>
          <Link 
            to="/shop" 
            className="bg-[#3D1E11] hover:bg-[#4A2717] text-white font-bold py-2.5 px-6 rounded-full text-sm shadow-md transition-all inline-block"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {favoriteProducts.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-[#FAF6F0] overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative"
            >
              <Link to={`/product/${product._id}`} className="flex flex-col flex-grow">
                <div className="relative h-52 w-full bg-[#FCFAF7] flex items-center justify-center p-6 overflow-hidden">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=Chocolate'}
                    alt={product.name}
                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                  />
                  
                  {/* Stock tag */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                      <span className="bg-red-600 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleFavoriteToggle(e, product._id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all z-10"
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={isFavorite(product._id) ? 'text-red-500 scale-110 transition-transform' : 'text-gray-400'}
                    />
                  </button>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span className="bg-[#3D1E11]/5 px-2.5 py-1 rounded-full font-semibold">{product.category}</span>
                    
                    {/* Star Rating */}
                    <div className="flex items-center space-x-1 font-semibold text-gray-700">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                      <span>{product.rating ? product.rating.toFixed(1) : 'New'}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#3D1E11] group-hover:text-chocolate-600 transition-colors line-clamp-1 mb-2">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-grow">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#FAF6F0]">
                    <span className="text-lg font-extrabold text-[#3D1E11]">
                      ${product.price.toFixed(2)}
                    </span>

                    {/* Add to Cart button */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.stock === 0}
                      className="bg-[#3D1E11] hover:bg-gold-gradient hover:text-[#2B170E] disabled:bg-gray-200 disabled:text-gray-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow transition-all duration-300 hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Add to cart"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="text-xs" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;