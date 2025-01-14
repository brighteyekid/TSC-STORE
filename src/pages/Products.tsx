import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { useRegion } from "../context/RegionContext";
import { Product } from "../types/product";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";

const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "plushies", label: "Plushies" },
  { id: "anime", label: "Anime" },
  { id: "gaming", label: "Gaming" },
  { id: "tech", label: "Tech" },
  { id: "accessories", label: "Accessories" },
  { id: "clothing", label: "Clothing" },
];

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { fetchProducts, isLoading } = useProducts();
  const { region } = useRegion();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(searchQuery.length > 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await fetchProducts();

      const filtered = allProducts.filter((product) => {
        const categoryMatch =
          selectedCategory === "all"
            ? true
            : product.category === selectedCategory;
        const regionMatch =
          product.region === region ||
          product.region === "both" ||
          (region === "global" && product.amazonLink.global) ||
          (region === "india" && product.amazonLink.india);

        const searchMatch =
          debouncedSearchQuery === "" ||
          product.title
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase());

        return categoryMatch && regionMatch && searchMatch;
      });

      setProducts(filtered);
    };

    loadProducts();
  }, [fetchProducts, selectedCategory, region, debouncedSearchQuery]);

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    if (newCategory === "all") {
      navigate("/products");
    } else {
      navigate(`/products/${newCategory}`);
    }
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-primary pt-20">
      {/* Header Section */}
      <div className="sticky top-20 z-30 bg-primary/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search and Filter Section */}
          <div className="flex flex-col space-y-4">
            {/* Title and Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <motion.h1
                className="text-2xl md:text-3xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Discover Products
              </motion.h1>

              {/* Enhanced Search Bar */}
              <div className="relative w-full md:w-80">
                <div
                  className={`
                  relative overflow-hidden rounded-xl transition-all duration-300
                  ${
                    searchFocused
                      ? "ring-2 ring-accent ring-offset-1 ring-offset-primary"
                      : ""
                  }
                `}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search products..."
                    className="w-full px-5 py-2.5 pl-11 bg-secondary/50 border border-white/10 
                             focus:outline-none focus:bg-secondary/80 transition-all duration-300
                             placeholder:text-white/30"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <AnimatePresence mode="wait">
                      {isSearching ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin"
                        />
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <FaSearch
                            className={`text-sm transition-colors duration-300 ${
                              searchFocused ? "text-accent" : "text-white/40"
                            }`}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => {
                        setSearchQuery("");
                        setIsSearching(false);
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 
                               hover:text-white/60 transition-colors"
                    >
                      <FaTimes className="text-sm" />
                    </motion.button>
                  )}
                </div>

                {/* Search Results Count */}
                {isSearching && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 left-0 text-sm text-white/60"
                  >
                    {products.length}{" "}
                    {products.length === 1 ? "result" : "results"} found
                  </motion.div>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-1.5 rounded-lg whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? "bg-accent text-white"
                      : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/5 rounded-xl aspect-[4/3]" />
                <div className="mt-4 space-y-3">
                  <div className="h-6 bg-white/5 rounded-lg w-3/4" />
                  <div className="h-4 bg-white/5 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto">
                  <FaSearch className="mx-auto text-3xl text-white/20 mb-4" />
                  <h2 className="text-xl font-semibold text-white/80 mb-2">
                    No products found
                  </h2>
                  <p className="text-white/60">
                    {searchQuery
                      ? `No results for "${searchQuery}" in ${
                          selectedCategory === "all"
                            ? "any category"
                            : selectedCategory
                        }`
                      : `No products available in ${
                          selectedCategory === "all"
                            ? "any category"
                            : selectedCategory
                        } for your region`}
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
