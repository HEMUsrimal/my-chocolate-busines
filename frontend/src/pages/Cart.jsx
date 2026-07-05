import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTrash, 
  faPlus, 
  faMinus, 
  faArrowLeft,
  faShoppingBag,
  faTag,
  faShieldHalved,
  faLock,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../components/ui/button";
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { 
    cart, 
    totalItems, 
    totalPrice, 
    removeFromCart, 
    updateQuantity,
    clearCart
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const handleQuantityChange = (productId, change) => {
    const item = cart.find(item => item._id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'CHOC10') {
      setDiscount(totalPrice * 0.1);
      setPromoApplied(true);
      toast.success('Promo code applied: 10% OFF!');
    } else {
      toast.error('Invalid promo code. Try CHOC10!');
    }
  };

  const shippingCost = totalPrice >= 50.0 ? 0 : 4.99;
  const grandTotal = totalPrice - discount + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 font-poppins text-[#2B170E]">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-24 h-24 bg-chocolate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faShoppingBag} className="text-4xl text-chocolate-400" />
          </div>
          <h2 className="text-2xl font-bold text-chocolate-900">Your Shopping Bag is Empty</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            Indulge in our exquisite collection of hand-crafted chocolates. Explore single-origin darks, hazelnut pralines, and gift boxes.
          </p>
          <Link to="/shop" className="inline-block mt-4">
            <Button className="bg-[#3D1E11] hover:bg-[#4A2717] text-white px-8 py-3 rounded-full font-bold shadow-md transition-all">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 font-poppins text-[#2B170E]">
      
      {/* Back & Title Header */}
      <div className="flex flex-col justify-start gap-3 mb-10">
        <Link to="/shop" className="text-chocolate-600 hover:text-chocolate-800 transition duration-300 text-sm font-semibold flex items-center gap-2">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Continue Shopping</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#3D1E11] tracking-tight">Your Shopping Bag</h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Left Column: Cart items list */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-[#FAF6F0] p-4 md:p-6 shadow-xs divide-y divide-[#FAF6F0]">
            {cart.map((item) => (
              <div 
                key={item._id} 
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-5 first:pt-2 last:pb-2"
              >
                {/* Item image */}
                <div className="w-24 h-24 bg-[#FCFAF7] border border-chocolate-100 rounded-2xl flex-shrink-0 flex items-center justify-center p-3">
                  <img
                    src={item.images?.[0] || item.image || '/placeholder-image.jpg'}
                    alt={item.name}
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow space-y-1">
                  <span className="bg-[#3D1E11]/5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-chocolate-700">
                    {item.category}
                  </span>
                  <h3 className="text-base font-extrabold text-[#3D1E11] pr-6">{item.name}</h3>
                  <p className="text-xs text-gray-400 font-medium">Unit Price: ${item.price?.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-6 justify-between w-full sm:w-auto">
                  <div className="flex items-center border border-chocolate-200 rounded-full bg-[#FCFAF7] px-3 py-1 space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item._id, -1)}
                      className="text-[#3D1E11] hover:text-[#aa704e] disabled:opacity-30 p-0.5 cursor-pointer"
                      disabled={item.quantity <= 1}
                    >
                      <FontAwesomeIcon icon={faMinus} className="text-xs" />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, 1)}
                      className="text-[#3D1E11] hover:text-[#aa704e] p-0.5 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-xs" />
                    </button>
                  </div>

                  {/* Total price & remove trash */}
                  <div className="flex items-center space-x-4">
                    <span className="text-base font-extrabold text-chocolate-800 w-20 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition cursor-pointer"
                      aria-label="Delete item"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Actions panel */}
          <div className="flex justify-between items-center">
            <button
              onClick={clearCart}
              className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
            >
              Clear Entire Bag
            </button>
          </div>
        </div>

        {/* Right Column: Order summary and checks */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Summary Box */}
          <div className="bg-white rounded-3xl border border-[#FAF6F0] p-6 shadow-xs sticky top-24 space-y-6">
            <h2 className="text-lg font-extrabold text-[#3D1E11] border-b border-chocolate-100 pb-3">
              Order Summary
            </h2>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              
              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faTag} className="text-xs" />
                    <span>Discount (10% Code)</span>
                  </span>
                  <span className="font-bold">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-bold">{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
              </div>

              {shippingCost > 0 && (
                <div className="p-3 bg-chocolate-50 rounded-xl text-[10px] text-gray-500 font-medium">
                  Add <strong>${(50.0 - totalPrice).toFixed(2)}</strong> more in products to qualify for free shipping!
                </div>
              )}

              <hr className="border-chocolate-100" />
              
              <div className="flex justify-between text-base text-[#3D1E11] pt-2">
                <span className="font-bold">Grand Total</span>
                <span className="text-xl font-black text-chocolate-900">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Box */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE (e.g. CHOC10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-chocolate-200 rounded-xl focus:outline-none focus:border-[#3D1E11] font-semibold"
              />
              <button
                type="submit"
                className="bg-[#3D1E11] hover:bg-[#4A2717] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                Apply
              </button>
            </form>

            <button className="w-full bg-gold-gradient text-[#2B170E] font-black py-4 rounded-xl flex items-center justify-center space-x-2.5 hover:shadow-lg hover:shadow-amber-500/10 active:scale-[0.98] transition cursor-pointer">
              <FontAwesomeIcon icon={faLock} className="text-xs" />
              <span>Secure Checkout</span>
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-2">
              <FontAwesomeIcon icon={faShieldHalved} className="text-green-600" />
              <span>SSL SECURED PAYMENT SYSTEM</span>
            </div>

            {/* Payment methods list */}
            <div className="flex justify-center gap-3 pt-1">
              <img src="https://img.icons8.com/color/28/000000/visa.png" alt="Visa" className="h-4 object-contain opacity-70" />
              <img src="https://img.icons8.com/color/28/000000/mastercard.png" alt="Mastercard" className="h-4 object-contain opacity-70" />
              <img src="https://img.icons8.com/color/28/000000/paypal.png" alt="Paypal" className="h-4 object-contain opacity-70" />
              <img src="https://img.icons8.com/color/28/000000/apple-pay.png" alt="Apple Pay" className="h-4 object-contain opacity-70" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;