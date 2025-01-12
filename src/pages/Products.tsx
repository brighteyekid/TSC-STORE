import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useRegion } from '../context/RegionContext';
import { Product } from '../types/product';
import { FaFilter } from 'react-icons/fa';

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'plushies', label: 'Plushies' },
  { id: 'anime', label: 'Anime' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'tech', label: 'Tech' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'clothing', label: 'Clothing' }
];

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { fetchProducts, isLoading } = useProducts();
  const { region } = useRegion();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await fetchProducts();
      const filtered = allProducts.filter(product => {
        const categoryMatch = selectedCategory === 'all' ? true : product.category === selectedCategory;
        const regionMatch = product.region === 'both' || product.region === region;
        return categoryMatch && regionMatch;
      });
      setProducts(filtered);
    };
    loadProducts();
  }, [fetchProducts, selectedCategory, region]);

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    if (newCategory === 'all') {
      navigate('/products');
    } else {
      navigate(`/products/${newCategory}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold capitalize">
            {selectedCategory === 'all' ? 'All Products' : selectedCategory}
          </h1>
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center space-x-2 px-4 py-2 bg-secondary rounded-lg"
          >
            <FaFilter className="text-accent" />
            <span>Filter</span>
          </button>

          {/* Desktop Category Filter */}
          <div className="hidden md:flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-accent text-white'
                    : 'bg-secondary text-white/60 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Mobile Category Filter */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden mb-6"
            >
              <div className="grid grid-cols-2 gap-2 p-2 bg-secondary rounded-lg">
                {CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => {
                      handleCategoryChange(cat.id);
                      setIsFilterOpen(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      selectedCategory === cat.id
                        ? 'bg-accent text-white'
                        : 'bg-white/5 text-white/60'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <h2 className="text-2xl font-semibold text-white/80 mb-4">
              No products available
            </h2>
            <p className="text-white/60">
              {selectedCategory === 'all'
                ? 'No products available for your region yet.'
                : `No ${selectedCategory} products available for your region yet.`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products; 