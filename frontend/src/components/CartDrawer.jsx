import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { 
  X, 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Gift 
} from "lucide-react";

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { 
    cart, 
    totalItems, 
    totalPrice, 
    removeFromCart, 
    updateQuantity 
  } = useCart();

  const SHIPPING_THRESHOLD = 50.0;
  const shippingLeft = SHIPPING_THRESHOLD - totalPrice;
  const isFreeShipping = shippingLeft <= 0;
  const shippingPercent = Math.min((totalPrice / SHIPPING_THRESHOLD) * 100, 100);

  const handleCheckoutClick = () => {
    onClose();
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#FCFAF7] shadow-2xl flex flex-col font-poppins text-[#2B170E]"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-chocolate-200 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="text-chocolate-600 w-6 h-6" />
                <h2 className="text-xl font-bold text-[#3D1E11]">Shopping Bag</h2>
                <span className="bg-chocolate-100 text-chocolate-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="p-4 bg-chocolate-50 border-b border-chocolate-100 px-6">
              <div className="flex items-center space-x-2 text-sm mb-2">
                <Truck className="w-4 h-4 text-chocolate-600" />
                <span className="font-medium">
                  {isFreeShipping ? (
                    <span className="text-green-600 font-bold">You qualify for Free Shipping! 🎉</span>
                  ) : (
                    <span>
                      Add <strong className="text-chocolate-800">${shippingLeft.toFixed(2)}</strong> more for FREE Shipping!
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gold-gradient h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${shippingPercent}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-20 h-20 bg-chocolate-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="text-chocolate-400 w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-chocolate-900 mb-1">Your bag is empty</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs">
                    Treat yourself to some of our hand-crafted luxury chocolates!
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-[#3D1E11] hover:bg-[#6b3a23] text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-md transition-colors duration-300"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item._id}
                    className="flex space-x-4 bg-white p-3 rounded-xl border border-[#FAF6F0] shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img
                        src={
                          (item.images?.[0] && !item.images[0].startsWith('/images/'))
                            ? item.images[0]
                            : (item.image && !item.image.startsWith('/images/'))
                            ? item.image
                            : 'https://images.unsplash.com/photo-1548907040-4d42b52125ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                        }
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-[#3D1E11] line-clamp-1 pr-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-chocolate-200 rounded-full bg-[#FCFAF7] px-2 py-0.5 space-x-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="text-[#3D1E11] hover:text-chocolate-600 disabled:opacity-30 p-0.5"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="text-[#3D1E11] hover:text-chocolate-600 p-0.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-bold text-chocolate-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-chocolate-100 space-y-4 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                {/* Gift Wrap Offer */}
                <div className="flex items-center justify-between p-3 bg-chocolate-50/50 rounded-xl border border-dashed border-chocolate-200 text-xs">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-chocolate-600" />
                    <div>
                      <span className="font-bold">Add luxury gift wrapping?</span>
                      <p className="text-[10px] text-gray-500">Perfect for gifts and celebrations</p>
                    </div>
                  </div>
                  <button className="text-chocolate-700 font-bold hover:underline">Add ($3.99)</button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span>{isFreeShipping ? "FREE" : "$4.99"}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-[#3D1E11] pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>${(totalPrice + (isFreeShipping ? 0 : 4.99)).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-gold-gradient text-[#2B170E] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full text-center text-sm font-semibold text-gray-500 hover:text-[#3D1E11] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
