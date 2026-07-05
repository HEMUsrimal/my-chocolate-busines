import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faFilter,
  faSearch,
  faShoppingCart,
  faSort,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { getProducts, searchProducts, getProductsByCategory } from '../services/productService';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ShopComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [imageError, setImageError] = useState({});

  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts();
      const productsData = Array.isArray(response) ? response : response.products || [];
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please check your server connection.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (productId) => {
    setImageError(prev => ({ ...prev, [productId]: true }));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (searchTerm) {
        data = await searchProducts(searchTerm);
      } else if (category !== 'All') {
        data = await getProductsByCategory(category);
      } else {
        const response = await getProducts();
        data = Array.isArray(response) ? response : response.products || [];
      }
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Failed to find matching products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCategoryChange = async (newCategory) => {
    setCategory(newCategory);
    try {
      setLoading(true);
      setError(null);
      let data;
      if (newCategory === 'All') {
        const response = await getProducts();
        data = Array.isArray(response) ? response : response.products || [];
      } else {
        data = await getProductsByCategory(newCategory);
      }
      setProducts(data);
    } catch (err) {
      console.error('Error changing category:', err);
      setError('Failed to filter products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    let sortedProducts = [...products];
    switch (newSort) {
      case 'price-low':
        sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        sortedProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        break;
    }
    setProducts(sortedProducts);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] font-poppins text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#3D1E11] mx-auto mb-4"></div>
          <p className="text-sm">Fetching premium collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] font-poppins">
        <div className="text-center bg-[#1E100A]/5 border border-chocolate-200 p-8 rounded-2xl max-w-md shadow-sm">
          <h3 className="text-lg font-bold text-red-600 mb-2">Error Occurred</h3>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-[#3D1E11] hover:bg-[#4A2717] text-white font-bold py-2.5 px-6 rounded-full text-sm shadow-md transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-poppins text-[#2B170E]">
      
      {/* Immersive Shop Hero */}
      <div className="relative bg-[#1E100A] text-white py-16 px-8 rounded-3xl mb-12 text-center overflow-hidden shadow-xl border border-white/5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent)] pointer-events-none" />
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Artisanal Chocolates</h1>
        <p className="text-sm md:text-lg text-gray-300 max-w-xl mx-auto mb-8 font-medium">
          Indulge in premium quality chocolates crafted by master chocolatiers from fine organic fairtrade cacao.
        </p>

        {/* Search bar inside hero */}
        <div className="max-w-lg mx-auto bg-white rounded-full p-1.5 shadow-lg flex items-center border border-chocolate-200">
          <FontAwesomeIcon icon={faSearch} className="text-[#3D1E11] ml-4 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search chocolate bars, gift sets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-3 py-2 text-sm text-[#2B170E] bg-transparent outline-none placeholder-gray-400"
          />
          <button
            onClick={handleSearch}
            className="bg-[#3D1E11] hover:bg-[#4A2717] text-[#FCFAF7] font-bold text-xs py-2.5 px-5 rounded-full shadow transition"
          >
            Find
          </button>
        </div>
      </div>

      {/* Modern Filter Pill Panel */}
      <div className="bg-white rounded-2xl border border-[#FAF6F0] p-5 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Category Pills list */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Dark Chocolate', 'Milk Chocolate', 'White Chocolate', 'Nut Chocolate', 'Gift Box'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                category === cat
                  ? 'bg-[#3D1E11] text-[#FCFAF7] shadow-md'
                  : 'bg-[#FCFAF7] text-[#2B170E]/70 hover:bg-[#3D1E11]/5 hover:text-[#3D1E11]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-4 flex-shrink-0">
          
          {/* Sorting Dropdown */}
          <div className="flex items-center space-x-2 border border-chocolate-200 rounded-xl px-3 py-2 bg-[#FCFAF7]">
            <FontAwesomeIcon icon={faSort} className="text-chocolate-600 text-xs" />
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-xs font-bold text-[#2B170E] bg-transparent focus:outline-none border-none outline-none cursor-pointer"
            >
              <option value="featured">Featured Selections</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 border ${
              showFilters 
                ? 'bg-chocolate-50 border-[#3D1E11] text-[#3D1E11]' 
                : 'border-chocolate-200 hover:bg-gray-50 text-gray-600'
            }`}
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>Options</span>
          </button>
        </div>
      </div>

      {/* Expanded filters options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-[#FCFAF7] rounded-2xl border border-chocolate-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-bold text-[#3D1E11] mb-2.5">Sourcing Standards</h4>
                <div className="space-y-2 text-xs text-gray-500 font-semibold">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-chocolate-600" />
                    <span>Fairtrade Certified</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-chocolate-600" />
                    <span>100% Organic Cacao</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#3D1E11] mb-2.5">Dietary / Allergens</h4>
                <div className="space-y-2 text-xs text-gray-500 font-semibold">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-chocolate-600" />
                    <span>Vegan Friendly</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-chocolate-600" />
                    <span>Gluten Free</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#3D1E11] mb-2.5">Packaging Options</h4>
                <div className="space-y-2 text-xs text-gray-500 font-semibold">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-chocolate-600" />
                    <span>Gift Ribbon Included</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main product catalog grid */}
      <h2 className="text-2xl font-bold mb-6 text-[#3D1E11]">Chocolate Catalogue</h2>
      {products.length === 0 ? (
        <div className="text-center py-20 bg-[#FCFAF7] rounded-3xl border border-dashed border-chocolate-200">
          <p className="text-gray-500 font-medium">No luxury chocolates match your description.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const isFav = isFavorite(product._id);
            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-[#FAF6F0] overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative"
              >
                {/* Product Detail Page Link */}
                <Link to={`/product/${product._id}`} className="flex flex-col flex-grow">
                  
                  {/* Image container frame */}
                  <div className="relative h-52 w-full bg-[#FCFAF7] flex items-center justify-center p-6 overflow-hidden">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=Chocolate'}
                      alt={product.name || 'Product'}
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                      onError={() => handleImageError(product._id)}
                    />

                    {/* Stock status overlay */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center backdrop-blur-xs">
                        <span className="bg-red-600 text-white text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}

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

                  {/* Card textual info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                      <span className="bg-[#3D1E11]/5 px-2.5 py-1 rounded-full font-semibold">{product.category}</span>
                      
                      {/* Ratings stars count */}
                      <div className="flex items-center space-x-1 font-semibold text-gray-700">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                        <span>{product.rating ? product.rating.toFixed(1) : "New"}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#3D1E11] group-hover:text-chocolate-600 transition-colors line-clamp-1 mb-2">
                      {product.name || 'Unnamed Selection'}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-grow">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#FAF6F0]">
                      <span className="text-lg font-extrabold text-[#3D1E11]">
                        ${product.price?.toFixed(2) || '0.00'}
                      </span>

                      {/* Add to Cart button */}
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock === 0}
                        className="bg-[#3D1E11] hover:bg-gold-gradient hover:text-[#2B170E] disabled:bg-gray-200 disabled:text-gray-400 text-[#FCFAF7] w-10 h-10 rounded-full flex items-center justify-center shadow transition-all duration-300 hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
                        aria-label="Add to cart"
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="text-xs" />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopComponent;