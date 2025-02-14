import { motion } from "framer-motion";
import {
  FaAmazon,
  FaStar,
  FaExternalLinkAlt,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { useRegion } from "../context/RegionContext";
import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { region } = useRegion();

  // Determine which link to use
  const getBuyLink = () => {
    if (region === "india") {
      return product.amazonLink.india || "#";
    } else {
      return product.amazonLink.global || "#";
    }
  };

  const buyLink = getBuyLink();

  const renderStars = (rating: number) => {
    const stars = [];
    const roundedRating = Math.floor(rating * 2) / 2; // Use Math.floor to avoid rounding up

    for (let i = 1; i <= 5; i++) {
      if (roundedRating >= i) {
        // Full star
        stars.push(
          <FaStar key={`star-${i}`} className="w-4 h-4 text-yellow-500" />
        );
      } else if (roundedRating >= i - 0.5) {
        // Half star
        stars.push(
          <FaStarHalfAlt
            key={`star-${i}`}
            className="w-4 h-4 text-yellow-500"
          />
        );
      } else {
        // Empty star
        stars.push(
          <FaRegStar key={`star-${i}`} className="w-4 h-4 text-yellow-500" />
        );
      }
    }
    return stars;
  };

  const getCategoryLabel = (category: string) => {
    if (category.startsWith('men-')) return 'Men\'s';
    if (category.startsWith('women-')) return 'Women\'s';
    if (category.startsWith('unisex-')) return 'Unisex';
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative bg-gradient-to-b from-white/[0.03] to-transparent rounded-3xl overflow-hidden border border-white/[0.05] backdrop-blur-3xl"
    >
      {/* Premium Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Ambient Light Effects */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />

      <div className="relative">
        {/* Image Container with Premium Border */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Premium Region Badge */}
          {region === "india" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-4 right-4 bg-black/30 backdrop-blur-xl text-white px-4 py-2 rounded-full text-xs font-medium border border-white/10 shadow-xl"
            >
              🇮🇳 India
            </motion.div>
          )}

          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>

        {/* Content Section */}
        <div className="relative p-6 space-y-4">
          {/* Title with Premium Typography */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-2 text-white group-hover:text-white transition-colors duration-300">
              {product.title}
            </h3>

            {/* Star Rating */}
            <div className="flex items-center space-x-1 mt-2">
              {renderStars(product.rating)}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-2 py-1 bg-primary/50 rounded-lg text-xs">
              {getCategoryLabel(product.category)}
            </span>
            {product.subcategory && (
              <span className="px-2 py-1 bg-primary/50 rounded-lg text-xs">
                {getCategoryLabel(product.subcategory)}
              </span>
            )}
          </div>

          {/* Premium Buy Button */}
          <motion.a
            href={buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative overflow-hidden rounded-2xl group/button">
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent to-accent/80 opacity-10 group-hover/button:opacity-20 transition-opacity duration-500" />
              <div className="relative px-6 py-3.5 flex items-center justify-center space-x-3 border border-accent/20 rounded-2xl bg-accent/5 group-hover/button:bg-accent/10 transition-all duration-500">
                <FaAmazon className="text-xl text-accent" />
                <span className="font-medium text-accent tracking-wide">
                  Buy Now
                </span>
                <FaExternalLinkAlt className="text-xs text-accent/50 group-hover/button:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
