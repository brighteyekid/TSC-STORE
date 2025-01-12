import { motion } from 'framer-motion';
import { FaAmazon, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useRegion } from '../context/RegionContext';
import { Product } from '../types/product';

type ProductCardProps = Product;

const ProductCard = ({ title, price, image, amazonLink, rating = 5, region }: ProductCardProps) => {
  const { region: userRegion } = useRegion();
  
  // Get the appropriate price and link based on region
  const displayPrice = userRegion === 'india' ? price.india : price.global;
  const buyLink = userRegion === 'india' ? amazonLink.india : amazonLink.global;
  
  // Fallback to other region if preferred region is not available
  const finalBuyLink = buyLink || (userRegion === 'india' ? amazonLink.global : amazonLink.india) || '#';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-[#0D0D0D] rounded-xl overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-500" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-500" />
      
      {/* Border Gradient */}
      <div className="absolute inset-[1px] rounded-xl bg-gradient-to-b from-white/5 to-transparent" />

      <div className="relative">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Region Badge */}
          {userRegion === 'india' && (
            <div className="absolute top-4 right-4 bg-accent/80 text-white px-2 py-1 rounded-full text-xs font-medium">
              🇮🇳 India
            </div>
          )}
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80" />
          
          {/* Quick Buy Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <motion.a
              href={finalBuyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative px-6 py-3 bg-accent/10 rounded-lg overflow-hidden group/button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-accent opacity-0 group-hover/button:opacity-10 transition-opacity" />
              <div className="relative flex items-center space-x-2 text-accent">
                <FaAmazon className="text-xl" />
                <span className="font-semibold">Buy on Amazon {userRegion === 'india' ? 'India' : ''}</span>
              </div>
              <div className="absolute inset-0 border border-accent/20 rounded-lg" />
            </motion.a>
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative p-6">
          {/* Title */}
          <h3 className="font-display text-xl font-semibold mb-2 line-clamp-2 text-white/90 group-hover:text-accent transition-colors">
            {title}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-3 space-x-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? 'text-accent' : 'text-accent/20'
                }`}
              />
            ))}
          </div>

          {/* Price and Cart */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-white/50 font-mono">Price</p>
              <p className="text-2xl font-bold font-mono text-accent">
                {displayPrice}
              </p>
            </div>
            
            <motion.a
              href={finalBuyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-12 h-12 flex items-center justify-center group/cart"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="absolute inset-0 bg-accent/10 rounded-full opacity-0 group-hover/cart:opacity-100 transition-opacity" />
              <FaShoppingCart className="text-xl text-accent" />
            </motion.a>
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 