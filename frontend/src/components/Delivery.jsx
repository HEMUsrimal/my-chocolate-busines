import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTruck, 
  faGift, 
  faGlobe, 
  faTemperatureLow, 
  faShieldHalved, 
  faClock, 
  faHeartCircleCheck 
} from "@fortawesome/free-solid-svg-icons";
import deliveryImage from "@/img/2.jpg";

const Delivery = () => {
  return (
    <div className="my-28 font-poppins text-[#2B170E]">
      <div className="flex flex-col items-center text-center space-y-3 mb-16">
        <span className="text-xs font-bold tracking-widest text-[#d4af37] uppercase">Premium Care</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D1E11] tracking-tight">Our Services</h2>
        <div className="w-12 h-1 bg-[#d4af37] rounded-full mt-2" />
      </div>

      {/* Grid of features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {[
          {
            icon: faTruck,
            title: "Temperature-Controlled Delivery",
            desc: "Shipped in custom insulated boxes to ensure your chocolate arrives in pristine, unmelted condition.",
          },
          {
            icon: faGift,
            title: "Artisanal Gift Wrapping",
            desc: "Beautiful custom wrapping, silk ribbons, and handwritten personalized gift cards for your special occasions.",
          },
          {
            icon: faGlobe,
            title: "Worldwide Shipping",
            desc: "We bring the finest chocolate treasures to dark chocolate lovers across the globe with tracking.",
          },
        ].map((service, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-[#FAF6F0] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-[#d4af37]/10 text-[#d4af37] rounded-full flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={service.icon} className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-[#3D1E11] mb-2">{service.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </div>

      {/* Premium detailed segment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 md:p-12 rounded-3xl border border-[#FAF6F0] shadow-sm">
        <div className="lg:col-span-6 w-full rounded-2xl overflow-hidden shadow-md">
          <img
            src={deliveryImage}
            alt="Artisanal Chocolate Box"
            className="w-full h-80 md:h-[450px] object-cover hover:scale-102 transition-transform duration-500"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-[#d4af37]/10 text-[#aa704e] px-3.5 py-1 rounded-full text-xs font-bold uppercase">
            <FontAwesomeIcon icon={faHeartCircleCheck} />
            <span>Guaranteed Satisfaction</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold text-[#3D1E11]">
            A Premium Chocolate Experience
          </h3>
          
          <p className="text-sm text-gray-500 leading-relaxed">
            We handle our chocolate selections with the utmost care. From sourcing rich single-origin cocoa beans from fairtrade farmers, to packaging in custom isothermal cases, we guarantee an exceptional, premium experience from our kitchen to your doorstep.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#FAF6F0]">
            <div className="flex items-center space-x-3 text-sm font-semibold text-[#3D1E11]">
              <div className="w-8 h-8 rounded-full bg-chocolate-50 flex items-center justify-center text-chocolate-700">
                <FontAwesomeIcon icon={faTemperatureLow} />
              </div>
              <span>Thermal Insulation</span>
            </div>
            <div className="flex items-center space-x-3 text-sm font-semibold text-[#3D1E11]">
              <div className="w-8 h-8 rounded-full bg-chocolate-50 flex items-center justify-center text-chocolate-700">
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>
              <span>Secure Shipping</span>
            </div>
            <div className="flex items-center space-x-3 text-sm font-semibold text-[#3D1E11]">
              <div className="w-8 h-8 rounded-full bg-chocolate-50 flex items-center justify-center text-chocolate-700">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <span>Real-time Tracking</span>
            </div>
            <div className="flex items-center space-x-3 text-sm font-semibold text-[#3D1E11]">
              <div className="w-8 h-8 rounded-full bg-chocolate-50 flex items-center justify-center text-chocolate-700">
                <FontAwesomeIcon icon={faGift} />
              </div>
              <span>Perfect Presentation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
