import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/products/ProductFilters";
import { useProducts } from "../hooks/useProducts";
import { useRegion } from "../context/RegionContext";
import { Product } from "../types/product";

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
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Products</h1>

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

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
