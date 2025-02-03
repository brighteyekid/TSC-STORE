import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/products/ProductFilters";
import { useProducts } from "../hooks/useProducts";
import { useRegion } from "../context/RegionContext";
import { Product } from "../types/product";
import { gridPattern } from "../assets/gridPattern";

const Products = () => {
  const { category } = useParams();
  const { region } = useRegion();
  const { isLoading, products, fetchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const filteredProducts = products.filter((product: Product) => {
    const matchesRegion = product.region === region || product.region === "both";
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || 
      product.category === selectedCategory ||
      (selectedCategory === 'clothing' && product.category.startsWith('clothing-'));
    const matchesSubcategory =
      selectedSubcategory === "all" || product.subcategory === selectedSubcategory;

    return matchesRegion && matchesSearch && matchesCategory && matchesSubcategory;
  });

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 bg-repeat opacity-5 z-0"
        style={{ backgroundImage: `url("${gridPattern}")` }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-white via-accent-200 to-accent bg-clip-text text-transparent">
            Our Products
          </h1>
          <motion.div 
            className="h-1 w-24 bg-accent/50 mx-auto mt-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
          />
          <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
            Discover our curated collection of premium products, carefully selected for enthusiasts like you.
          </p>
        </motion.div>

        {/* Filters Section */}
        <div className="mb-8">
          <ProductFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            totalProducts={products.length}
            filteredCount={filteredProducts.length}
          />
        </div>

        {/* Products Grid with Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
            <p className="text-white/60 animate-pulse">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-secondary rounded-2xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-white/60">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}

        {/* Results Summary */}
        {!isLoading && filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center text-white/60"
          >
            Showing {filteredProducts.length} of {products.length} products
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;
