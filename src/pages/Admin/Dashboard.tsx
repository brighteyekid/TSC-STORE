import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { FaPlus, FaTrash, FaSignOutAlt, FaEdit, FaImage, FaUpload, FaChevronDown, FaStar } from 'react-icons/fa';
import { useProducts } from '../../hooks/useProducts';
import { validateImageUrl, validateAmazonUrl } from '../../utils/adminUtils';
import { Product, NewProduct } from '../../types/product';
import { collection as firestoreCollection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Collection } from '../../types/collection';
import { db } from '../../config/firebase';
import CollectionsManager from '../../components/CollectionsManager';

// Define product categories
const PRODUCT_CATEGORIES = [
  { id: 'plushies', label: 'Plushies' },
  { id: 'anime', label: 'Anime' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'tech', label: 'Tech' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'clothing', label: 'Clothing' }
] as const;

const PRODUCT_REGIONS = [
  { value: 'global', label: 'Global Only' },
  { value: 'india', label: 'India Only' },
  { value: 'both', label: 'Both Regions' }
] as const;

const CustomSelect = ({ 
  label, 
  value, 
  onChange, 
  options 
}: { 
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div className="relative">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 bg-secondary border border-white/10 rounded-lg focus:outline-none focus:border-accent appearance-none cursor-pointer text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-secondary">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-white/60">
        <FaChevronDown size={14} />
      </div>
      <div className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none" />
    </div>
  </div>
);

const DEFAULT_COLLECTIONS = [
  {
    id: 'plushies',
    title: 'Plushies',
    image: 'https://example.com/default-plushies.jpg',
    category: 'plushies',
    description: 'Cute and cuddly plushies'
  },
  {
    id: 'anime',
    title: 'Anime',
    image: 'https://example.com/default-anime.jpg',
    category: 'anime',
    description: 'Anime merchandise and collectibles'
  },
  // Add more default collections
];

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<'global' | 'india' | 'both'>('both');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isEditingCollection, setIsEditingCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const { fetchProducts, addProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();

  const [newProduct, setNewProduct] = useState<NewProduct>({
    title: '',
    price: { global: '', india: '' },
    image: '',
    category: '',
    amazonLink: { global: '', india: '' },
    rating: 0,
    region: 'both'
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const validateAmazonUrl = (url: string, region: 'global' | 'india'): boolean => {
    if (!url) return true; // Empty URLs are valid (optional)
    
    const globalDomains = [
      'amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.fr', 
      'amazon.it', 'amazon.es', 'amazon.ca'
    ];
    const indiaDomain = 'amazon.in';
    
    try {
      const urlObj = new URL(url);
      if (region === 'global') {
        return globalDomains.some(domain => urlObj.hostname.endsWith(domain));
      } else {
        return urlObj.hostname.endsWith(indiaDomain);
      }
    } catch {
      return false;
    }
  };

  const formatPrice = (price: string, region: 'global' | 'india'): string => {
    const numericPrice = price.replace(/[^0-9.]/g, '');
    if (!numericPrice) return '';
    
    const amount = parseFloat(numericPrice);
    if (isNaN(amount)) return '';
    
    return region === 'global' 
      ? `$${amount.toFixed(2)}`
      : `₹${amount.toFixed(2)}`;
  };

  const validateForm = async () => {
    setFormError(null);
    
    if (!newProduct.title.trim()) {
      setFormError('Title is required');
      return false;
    }
    
    // Validate image URL
    if (!newProduct.image) {
      setFormError('Image URL is required');
      return false;
    }

    // Basic URL validation
    if (selectedRegion === 'global' || selectedRegion === 'both') {
      if (newProduct.amazonLink.global && !isValidUrl(newProduct.amazonLink.global)) {
        setFormError('Please enter a valid URL for global link');
        return false;
      }
    }

    if (selectedRegion === 'india' || selectedRegion === 'both') {
      if (newProduct.amazonLink.india && !isValidUrl(newProduct.amazonLink.india)) {
        setFormError('Please enter a valid URL for India link');
        return false;
      }
    }

    return true;
  };

  // Simple URL validation
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleImagePreview = async (url: string) => {
    if (url.trim()) {
      const isValid = await validateImageUrl(url);
      if (isValid) {
        setImagePreview(url);
      } else {
        setImagePreview('');
      }
    } else {
      setImagePreview('');
    }
  };

  const getDisplayPrice = (product: Product) => {
    if (product.region === 'india') {
      return product.price.india;
    } else if (product.region === 'global') {
      return product.price.global;
    } else {
      return `${product.price.global} / ${product.price.india}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      if (!(await validateForm())) {
        return;
      }

      const result = await addProduct(newProduct);
      if (result) {
        setProducts([...products, result]);
        setIsAddingProduct(false);
        // Reset form
        setNewProduct({
          title: '',
          price: { global: '', india: '' },
          image: '',
          category: '',
          amazonLink: { global: '', india: '' },
          rating: 0,
          region: 'both'
        });
        setImagePreview('');
      }
    } catch (err) {
      setFormError('Failed to add product');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const collectionsRef = firestoreCollection(db, 'collections');
      const snapshot = await getDocs(collectionsRef);
      const fetchedCollections = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Collection[];
      setCollections(fetchedCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const handleCollectionUpdate = async (collection: Collection) => {
    try {
      const collectionRef = doc(db, 'collections', collection.id);
      // Create an object with only the updatable fields
      const updateData = {
        image: collection.image,
        description: collection.description || '',
        title: collection.title,
        category: collection.category
      };
      
      await updateDoc(collectionRef, updateData);
      await fetchCollections();
      setIsEditingCollection(false);
      setSelectedCollection(null);
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  };

  // Add Collection Edit Modal
  const CollectionEditModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-primary rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Collection</h2>
          {selectedCollection && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCollectionUpdate(selectedCollection);
            }}
            className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={selectedCollection.image}
                  onChange={(e) => setSelectedCollection({
                    ...selectedCollection,
                    image: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-secondary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={selectedCollection.description}
                  onChange={(e) => setSelectedCollection({
                    ...selectedCollection,
                    description: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-secondary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingCollection(false);
                    setSelectedCollection(null);
                  }}
                  className="px-4 py-2 text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  // Add rating selection handler
  const handleRatingChange = (value: number) => {
    setNewProduct(prev => ({
      ...prev,
      rating: value
    }));
  };

  return (
    <div className="min-h-screen bg-primary p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-secondary rounded-2xl p-6 shadow-lg border border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-accent-200 to-accent bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-white/60 mt-1">Manage your products and collections</p>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setIsAddingProduct(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-accent rounded-xl flex items-center gap-2 hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
              >
                <FaPlus className="text-sm" />
                <span>Add Product</span>
              </motion.button>
              
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl flex items-center gap-2 transition-colors"
              >
                <FaSignOutAlt className="text-sm" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white/90">Products</h2>
            <p className="text-white/60">{products.length} items</p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="group bg-secondary rounded-2xl p-6 border border-white/5"
              >
                <div className="space-y-4">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                    
                    {/* Rating Display */}
                    <div className="flex items-center space-x-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < (product.rating || 5) ? 'text-yellow-400' : 'text-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        product.amazonLink.global 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        Global
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        product.amazonLink.india 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        India
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Collections Section */}
        <div className="mt-12">
          <CollectionsManager />
        </div>

        {/* Add Product Modal */}
        <AnimatePresence>
          {isAddingProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-secondary max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl"
              >
                {/* Form Header */}
                <div className="p-6 bg-white/5">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-accent-200 to-accent bg-clip-text text-transparent">
                    Add New Product
                  </h2>
                  <p className="text-white/60 mt-1">Fill in the details for your new product</p>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                  {/* Title Input */}
                  <div className="group">
                    <label className="block text-sm font-medium mb-2 text-white/80 group-focus-within:text-accent transition-colors">
                      Product Title
                    </label>
                    <input
                      type="text"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent/50 focus:bg-white/[0.07] transition-all"
                      placeholder="Enter product title..."
                    />
                  </div>

                  {/* Image URL with Preview */}
                  <div className="group">
                    <label className="block text-sm font-medium mb-2 text-white/80 group-focus-within:text-accent transition-colors">
                      Image URL
                    </label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent/50 focus:bg-white/[0.07] transition-all"
                          placeholder="Enter image URL..."
                        />
                      </div>
                      {imagePreview && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Region and Category Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Region Select */}
                    <div className="group relative">
                      <label className="block text-sm font-medium mb-2 text-white/80 group-focus-within:text-accent transition-colors">
                        Region
                      </label>
                      <div className="relative">
                        <select
                          value={newProduct.region}
                          onChange={(e) => setNewProduct({
                            ...newProduct,
                            region: e.target.value as 'global' | 'india' | 'both'
                          })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent/50 
                          focus:bg-white/[0.07] transition-all appearance-none cursor-pointer text-white"
                        >
                          {PRODUCT_REGIONS.map((region) => (
                            <option 
                              key={region.value} 
                              value={region.value}
                              className="bg-secondary hover:bg-white/10"
                            >
                              {region.label}
                            </option>
                          ))}
                        </select>
                        {/* Custom Dropdown Arrow */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <FaChevronDown className="text-accent/50 group-hover:text-accent transition-colors" />
                        </div>
                      </div>
                    </div>

                    {/* Category Select */}
                    <div className="group relative">
                      <label className="block text-sm font-medium mb-2 text-white/80 group-focus-within:text-accent transition-colors">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({
                            ...newProduct,
                            category: e.target.value
                          })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent/50 
                          focus:bg-white/[0.07] transition-all appearance-none cursor-pointer text-white"
                        >
                          <option value="" disabled className="bg-secondary">Select a category</option>
                          {PRODUCT_CATEGORIES.map((category) => (
                            <option 
                              key={category.id} 
                              value={category.id}
                              className="bg-secondary hover:bg-white/10"
                            >
                              {category.label}
                            </option>
                          ))}
                        </select>
                        {/* Custom Dropdown Arrow */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <FaChevronDown className="text-accent/50 group-hover:text-accent transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div className="group">
                    <label className="block text-sm font-medium mb-2 text-white/80">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewProduct({ ...newProduct, rating: star })}
                          className={`text-2xl transition-transform hover:scale-110 ${
                            star <= newProduct.rating ? 'text-yellow-400' : 'text-white/20'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amazon Links */}
                  {(newProduct.region === 'global' || newProduct.region === 'both') && (
                    <div className="group">
                      <label className="block text-sm font-medium mb-2 text-white/80 group-focus-within:text-accent transition-colors">
                        Global Amazon Link
                      </label>
                      <input
                        type="url"
                        value={newProduct.amazonLink.global}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          amazonLink: { ...newProduct.amazonLink, global: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent/50 focus:bg-white/[0.07] transition-all"
                        placeholder="https://amazon.com/..."
                      />
                    </div>
                  )}

                  {(newProduct.region === 'india' || newProduct.region === 'both') && (
                    <div className="group">
                      <label className="block text-sm font-medium mb-2 text-white/80 group-focus-within:text-accent transition-colors">
                        India Amazon Link
                      </label>
                      <input
                        type="url"
                        value={newProduct.amazonLink.india}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          amazonLink: { ...newProduct.amazonLink, india: e.target.value }
                        })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent/50 focus:bg-white/[0.07] transition-all"
                        placeholder="https://amazon.in/..."
                      />
                    </div>
                  )}
                </div>

                {/* Form Footer */}
                <div className="p-6 bg-white/5 flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddingProduct(false)}
                    className="px-6 py-2.5 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 transition-colors flex items-center gap-2"
                  >
                    <span>Add Product</span>
                    <FaPlus className="text-sm" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collection Edit Modal */}
        <AnimatePresence>
          {isEditingCollection && selectedCollection && <CollectionEditModal />}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Add this to your global CSS or component styles
const styles = `
  @layer components {
    select option {
      @apply bg-secondary text-white py-2;
    }
    
    select:focus + div {
      @apply border-accent;
    }
  }
`;

export default Dashboard; 