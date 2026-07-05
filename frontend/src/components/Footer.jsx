import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt, faAward, faTruck, faGift, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faYoutube, faPinterest } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className='bg-[#1a0f0a] text-white border-t-2 border-[#d4af37]/20 font-poppins pt-16 pb-8 px-4 sm:px-6 lg:px-8'>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand details & trust badges */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gold-gradient tracking-tight">Chocolate Bravo</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              We curate the world's most exquisite, premium chocolate treasures. Indulge in artisanal recipes handcrafted with love, sustainable cocoa, and precision.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-gray-300">
                <FontAwesomeIcon icon={faAward} className="text-[#d4af37]" />
                <span>Fairtrade Certified</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-gray-300">
                <FontAwesomeIcon icon={faTruck} className="text-[#d4af37]" />
                <span>Temperature-Controlled</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-200 tracking-wide border-b border-[#d4af37]/15 pb-2.5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Shop Collection', path: '/shop' },
                { label: 'Our Story', path: '/about' },
                { label: 'My Orders', path: '/my-orders' },
                { label: 'Account Settings', path: '/settings' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="text-sm text-gray-400 hover:text-[#d4af37] transition duration-300 flex items-center space-x-1 hover:translate-x-1 transform"
                  >
                    <span>&rsaquo;</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-200 tracking-wide border-b border-[#d4af37]/15 pb-2.5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <FontAwesomeIcon icon={faPhone} className="text-[#d4af37] mt-1 flex-shrink-0" />
                <span>+94 77 007 7077</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#d4af37] mt-1 flex-shrink-0" />
                <span>support@chocolatebravo.com</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#d4af37] mt-1 flex-shrink-0" />
                <span>Colombo 03, Sri Lanka</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-200 tracking-wide border-b border-[#d4af37]/15 pb-2.5">
              Newsletter
            </h3>
            <p className="text-sm text-gray-400">
              Subscribe to receive exclusive deals, tasting updates, and special launch invites.
            </p>
            {submitted ? (
              <div className="p-3.5 bg-green-950/40 border border-green-500/30 text-green-300 rounded-xl text-xs font-semibold animate-pulse">
                Thank you for subscribing! Check your email for a special discount code. 🍫
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#d4af37]/70 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold-gradient text-[#2B170E] font-bold py-2.5 px-4 rounded-xl text-sm transition hover:shadow-lg hover:shadow-amber-500/10 active:scale-[0.98] duration-300"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-white/10 my-8" />

        {/* Footer Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Chocolate Bravo. Crafted with precision, indulgence, and fine cocoa.
          </p>

          {/* Payment Badges */}
          <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mr-2">Secure Checkout</span>
            <img src="https://img.icons8.com/color/36/000000/visa.png" alt="Visa" className="h-5 w-auto object-contain opacity-80" />
            <img src="https://img.icons8.com/color/36/000000/mastercard.png" alt="Mastercard" className="h-5 w-auto object-contain opacity-80" />
            <img src="https://img.icons8.com/color/36/000000/paypal.png" alt="Paypal" className="h-5 w-auto object-contain opacity-80" />
            <img src="https://img.icons8.com/color/36/000000/apple-pay.png" alt="Apple Pay" className="h-5 w-auto object-contain opacity-80" />
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            {[
              { icon: faFacebookF, url: "#" },
              { icon: faInstagram, url: "#" },
              { icon: faYoutube, url: "#" },
              { icon: faPinterest, url: "#" }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 hover:border-[#d4af37]/35 transition-all duration-300"
              >
                <FontAwesomeIcon icon={social.icon} className="text-sm" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
