import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ParallaxCard = ({ title, category, description, imageUrl, shadowColor }) => {
  const cardRef = useRef(null);
  
  // Motion values for tracking cursor relative coordinates
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs for 3D card tilt rotation
  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), { damping: 25, stiffness: 180 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), { damping: 25, stiffness: 180 });

  // Floating effects for items inside the card using preserve-3d Z Translation
  const itemTranslateZ = "translateZ(50px)";
  const bgTranslateZ = "translateZ(-15px)";
  const textTranslateZ = "translateZ(30px)";

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative position between 0 and 1
    const mouseX = (e.clientX - rect.left) / width;
    const mouseY = (e.clientY - rect.top) / height;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    // Reset to neutral center position
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div 
      className="perspective-[1000px] w-full cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative h-[420px] w-full rounded-3xl p-8 overflow-hidden bg-gradient-to-b from-[#2E1A11] to-[#1C0D07] border border-white/5 shadow-2xl transition-all duration-300 hover:border-[#d4af37]/20"
      >
        {/* Reflection / Glossy Shine Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/2 to-white/10 pointer-events-none z-30" />

        {/* Dynamic Glow Layer */}
        <div 
          className="absolute -inset-10 opacity-30 blur-2xl pointer-events-none rounded-3xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${shadowColor}, transparent)`,
            transform: bgTranslateZ,
          }}
        />

        {/* Ambient grid design */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
          style={{ transform: bgTranslateZ }}
        />

        <div className="relative z-10 h-full flex flex-col justify-between" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Category & Title */}
          <div style={{ transform: textTranslateZ, transformStyle: 'preserve-3d' }}>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-full">
              {category}
            </span>
            <h3 className="text-2xl font-black text-[#FCFAF7] mt-3 tracking-tight">
              {title}
            </h3>
          </div>

          {/* 3D Floating Chocolate Item */}
          <div 
            className="flex items-center justify-center my-6 h-40 relative" 
            style={{ transform: itemTranslateZ, transformStyle: 'preserve-3d' }}
          >
            {/* Interactive shadow */}
            <div 
              className="absolute w-24 h-5 rounded-full bg-black/50 blur-md bottom-1 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ transform: "translateZ(-20px) scale(0.9)" }}
            />
            
            {/* Chocolate Image */}
            <img 
              src={imageUrl} 
              alt={title}
              className="w-32 h-32 object-contain drop-shadow-2xl select-none transform hover:scale-105 transition-transform duration-300"
              style={{ transform: "translateZ(15px)" }}
            />
          </div>

          {/* Description and Action button */}
          <div style={{ transform: textTranslateZ }} className="space-y-4">
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              {description}
            </p>
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <span className="text-xs font-black text-white/50 tracking-wider">PREMIUM COLLECTION</span>
              <a 
                href="/shop"
                className="bg-gold-gradient text-[#2B170E] font-black text-[10px] uppercase tracking-widest py-2 px-5 rounded-full transition-all hover:scale-105"
              >
                TREAT YOURSELF
              </a>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

const ThreeDChocolateSection = () => {
  const cards = [
    {
      title: "Truffle Classique",
      category: "Dark Chocolate",
      description: "Delicate raw cocoa dusting concealing a rich, velvety dark chocolate ganache crafted from grand-cru Belgian beans.",
      imageUrl: "https://images.unsplash.com/photo-1548907040-4d42b52125ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      shadowColor: "#d4af37"
    },
    {
      title: "Caramel Praliné",
      category: "Milk Chocolate",
      description: "Creamy Swiss milk chocolate housing a core of roasted Piemonte hazelnut praline and liquid salted caramel.",
      imageUrl: "https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      shadowColor: "#aa704e"
    },
    {
      title: "Framboise Blanc",
      category: "White Chocolate",
      description: "Smooth, organic cocoa butter base infused with Madagascar vanilla bean pods and pieces of tart freeze-dried raspberries.",
      imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      shadowColor: "#e6b4b4"
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 border-t border-chocolate-100 bg-[#FCFAF7] rounded-3xl mb-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-chocolate-600 uppercase tracking-widest bg-chocolate-50 px-3.5 py-1.5 rounded-full">
            3D Tasting Experience
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D1E11] tracking-tight">
            Explore Our Signature Chocolates
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Hover your cursor over the creations below. Move around to view the detailed depth and realistic layers of our premium chocolates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <ParallaxCard
              key={index}
              title={card.title}
              category={card.category}
              description={card.description}
              imageUrl={card.imageUrl}
              shadowColor={card.shadowColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeDChocolateSection;
