import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { BEST_DEALS } from "@/constants/HeroCard";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Hero = () => {
  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  return (
    <div className="w-full relative bg-[#1E100A] text-white rounded-3xl overflow-hidden py-16 px-6 md:px-12 lg:px-20 mb-16 shadow-2xl border border-white/5">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#aa704e]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Intro Text Column */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#dfb15b] px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisanal Confectionery</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#FCFAF7] leading-tight font-poppins"
          >
            Indulge in <br />
            <span className="text-gold-gradient">Premium Chocolate</span> <br />
            Treasures
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm md:text-base text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0"
          >
            Discover our exquisite collections carefully curated from world-renowned chocolatiers. 
            From elegant gift sets to rich single-origin dark assortments, we bring you the finest 
            selections perfect for gifting or pure self-indulgence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <a
              href="/shop"
              className="bg-gold-gradient text-[#2B170E] font-extrabold px-8 py-3.5 rounded-full flex items-center space-x-2.5 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/about"
              className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-[#FCFAF7] font-bold px-8 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto text-center"
            >
              Our Story
            </a>
          </motion.div>
        </div>

        {/* Right Carousel Column */}
        <div className="lg:col-span-7 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full relative"
          >
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {BEST_DEALS.map((deal) => (
                  <CarouselItem key={deal.id}>
                    <div className="p-2">
                      <div className="glass-panel-dark rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-white/15 transition-all duration-500 overflow-hidden relative group">
                        
                        {/* Hover glow glow */}
                        <div className="absolute -inset-y-12 -inset-x-12 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl pointer-events-none" />

                        {/* Image Frame */}
                        <div className="relative w-44 h-44 md:w-56 md:h-56 flex-shrink-0 flex items-center justify-center bg-[#FCFAF7]/5 rounded-xl border border-white/5 group-hover:scale-105 transition-transform duration-500">
                          <img
                            src={deal.image}
                            alt={deal.title}
                            className="w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
                          />
                        </div>

                        {/* Text Content */}
                        <div className="flex-grow space-y-4 text-center md:text-left flex flex-col justify-center">
                          <div className="flex items-center justify-center md:justify-start space-x-1.5 text-amber-400 text-xs font-bold uppercase tracking-widest">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>Bestseller Deal</span>
                          </div>
                          
                          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                            {deal.title}
                          </h3>
                          
                          <p className="text-xs md:text-sm text-gray-300 leading-relaxed line-clamp-2">
                            {deal.description}
                          </p>

                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                            <span className="text-2xl font-bold text-[#FCFAF7]">
                              {deal.price}
                            </span>
                            <span className="bg-[#dfb15b] text-[#2B170E] text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                              {deal.discount}
                            </span>
                          </div>

                          <div className="pt-2">
                            <a
                              href="/shop"
                              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#dfb15b] hover:text-[#d4af37] hover:translate-x-1 transition-all duration-300"
                            >
                              <span>Shop This Deal</span>
                              <ArrowRight className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation buttons */}
              <div className="absolute right-4 bottom-4 flex space-x-2 z-20">
                <CarouselPrevious className="bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20 transition-all rounded-full w-9 h-9 flex items-center justify-center" />
                <CarouselNext className="bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20 transition-all rounded-full w-9 h-9 flex items-center justify-center" />
              </div>
            </Carousel>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
