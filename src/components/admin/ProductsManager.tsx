import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, updateDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { Product } from '../../types/product';
import ProductForm from './ProductForm';

const CLOTHING_SUBCATEGORIES = {
  men: [
    { value: 'men-tshirts', label: 'T-Shirts' },
    { value: 'men-hoodies', label: 'Hoodies & Sweatshirts' },
    { value: 'men-jackets', label: 'Jackets' },
    { value: 'men-pants', label: 'Pants & Shorts' },
    { value: 'men-accessories', label: 'Accessories' },
  ],
  women: [
    { value: 'women-tshirts', label: 'T-Shirts' },
    { value: 'women-hoodies', label: 'Hoodies & Sweatshirts' },
    { value: 'women-jackets', label: 'Jackets' },
    { value: 'women-pants', label: 'Pants & Shorts' },
    { value: 'women-accessories', label: 'Accessories' },
  ],
  unisex: [
    { value: 'unisex-tshirts', label: 'T-Shirts' },
    { value: 'unisex-hoodies', label: 'Hoodies & Sweatshirts' },
    { value: 'unisex-jackets', label: 'Jackets' },
    { value: 'unisex-accessories', label: 'Accessories' },
  ],
};

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'plushies', label: 'Plushies' },
  { value: 'anime', label: 'Anime Merch' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'tech', label: 'Tech' },
  { value: 'accessories', label: 'Accessories' },
  { 
    value: 'clothing', 
    label: 'Clothing',
    subcategories: [
      { value: 'clothing-men', label: 'Men\'s Clothing', subcategories: CLOTHING_SUBCATEGORIES.men },
      { value: 'clothing-women', label: 'Women\'s Clothing', subcategories: CLOTHING_SUBCATEGORIES.women },
      { value: 'clothing-unisex', label: 'Unisex Clothing', subcategories: CLOTHING_SUBCATEGORIES.unisex },
    ]
  },
  { value: 'amazon-finds', label: 'Amazon Finds' },
];

const REGIONS = [
  { value: 'all', label: 'All Regions' },
  { value: 'global', label: 'Global Only' },
  { value: 'india', label: 'India Only' },
  { value: 'both', label: 'Both Regions' },
];

const TECH_SUBCATEGORIES = [
  { value: 'tech-gaming', label: 'Gaming Accessories' },
  { value: 'tech-audio', label: 'Audio & Headphones' },
  { value: 'tech-mobile', label: 'Mobile Accessories' },
  { value: 'tech-computer', label: 'Computer Accessories' },
  { value: 'tech-smart-home', label: 'Smart Home' },
  { value: 'tech-wearables', label: 'Wearables' },
  { value: 'tech-cameras', label: 'Cameras & Accessories' },
  { value: 'tech-storage', label: 'Storage & Drives' },
];

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'rating'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory, selectedRegion, sortBy, sortOrder]);

  const filterProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'tech') {
        // Filter tech products by checking if category starts with 'tech-'
        filtered = filtered.filter(product => product.category.startsWith('tech-'));
      } else if (selectedCategory === 'clothing') {
        // Filter clothing products
        filtered = filtered.filter(product => product.category.startsWith('clothing-'));
      } else if (selectedCategory.startsWith('tech-')) {
        // Filter specific tech subcategory
        filtered = filtered.filter(product => product.category === selectedCategory);
      } else {
        // Filter other categories
        filtered = filtered.filter(product => product.category === selectedCategory);
      }
    }

    // Apply region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(product => 
        product.region === selectedRegion || product.region === 'both'
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        return sortOrder === 'asc'
          ? (a.rating || 0) - (b.rating || 0)
          : (b.rating || 0) - (a.rating || 0);
      }
    });

    setFilteredProducts(filtered);
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (productData: Partial<Product>) => {
    try {
      // Clean the data before saving to Firebase
      const cleanData = {
        ...productData,
        subcategory: productData.subcategory || null, // Convert undefined to null
        amazonLink: {
          global: productData.amazonLink?.global || null,
          india: productData.amazonLink?.india || null
        }
      };

      if (isAddingNew) {
        const newProduct = {
          ...cleanData,
          id: crypto.randomUUID(),
        };
        const productRef = doc(db, 'products', newProduct.id);
        await setDoc(productRef, newProduct);
      } else if (productData.id) {
        const productRef = doc(db, 'products', productData.id);
        const { id, ...updateData } = cleanData;
        await updateDoc(productRef, updateData);
      }
      
      await fetchProducts();
      setIsEditing(false);
      setIsAddingNew(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      if (!window.confirm('Are you sure you want to delete this product?')) {
        return;
      }

      setIsLoading(true);
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      
      // Update local state to remove the deleted product
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      setIsLoading(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      setIsLoading(false);
    }
  };

  const getDisplayCategory = (product: Product) => {
    // For tech products
    if (product.category.startsWith('tech-')) {
      const techCategory = TECH_SUBCATEGORIES.find(sub => sub.value === product.category);
      return techCategory ? techCategory.label : product.category;
    }
    
    // For other categories
    return product.category;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-secondary rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
            >
              {CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
            >
              {REGIONS.map(region => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-white/60">Sort by:</span>
          <button
            onClick={() => setSortBy('title')}
            className={`px-3 py-1 rounded-lg ${
              sortBy === 'title' ? 'bg-accent text-white' : 'bg-primary text-white/60'
            }`}
          >
            Title
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`px-3 py-1 rounded-lg ${
              sortBy === 'rating' ? 'bg-accent text-white' : 'bg-primary text-white/60'
            }`}
          >
            Rating
          </button>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1 bg-primary text-white/60 rounded-lg"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-white/60">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-secondary rounded-xl overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.title}</h3>
                <p className="text-sm text-white/60 mb-2">
                  Category: {getDisplayCategory(product)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsEditing(true);
                    }}
                    className="px-3 py-1.5 bg-accent/20 hover:bg-accent/30 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      <AnimatePresence>
        {(isEditing || isAddingNew) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <ProductForm
              product={selectedProduct}
              onSave={handleFormSubmit}
              onCancel={() => {
                setIsEditing(false);
                setIsAddingNew(false);
                setSelectedProduct(null);
              }}
              isNew={isAddingNew}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsManager; 