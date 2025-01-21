import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import {
  FaPlus,
  FaTrash,
  FaSignOutAlt,
  FaEdit,
  FaImage,
  FaUpload,
  FaChevronDown,
  FaStar,
  FaStarHalfAlt,
  FaBox,
  FaLayerGroup,
  FaCog,
} from "react-icons/fa";
import { useProducts } from "../../hooks/useProducts";
import { validateImageUrl, validateAmazonUrl } from "../../utils/adminUtils";
import { Product, NewProduct } from "../../types/product";
import {
  collection as firestoreCollection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Collection } from "../../types/collection";
import { db } from "../../config/firebase";
import CollectionsManager from "../../components/CollectionsManager";
import ProductsManager from '../../components/admin/ProductsManager';
import CategoriesManager from '../../components/admin/CategoriesManager';
import Settings from '../../components/admin/Settings';

// Define product categories
const PRODUCT_CATEGORIES = [
  { id: "plushies", label: "Plushies" },
  { id: "anime", label: "Anime" },
  { id: "gaming", label: "Gaming" },
  { id: "tech", label: "Tech" },
  { id: "accessories", label: "Accessories" },
  { id: "clothing", label: "Clothing" },
] as const;

const PRODUCT_REGIONS = [
  { value: "global", label: "Global Only" },
  { value: "india", label: "India Only" },
  { value: "both", label: "Both Regions" },
] as const;

const CustomSelect = ({
  label,
  value,
  onChange,
  options,
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
          <option
            key={option.value}
            value={option.value}
            className="bg-secondary"
          >
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
    id: "plushies",
    title: "Plushies",
    image: "https://example.com/default-plushies.jpg",
    category: "plushies",
    description: "Cute and cuddly plushies",
  },
  {
    id: "anime",
    title: "Anime",
    image: "https://example.com/default-anime.jpg",
    category: "anime",
    description: "Anime merchandise and collectibles",
  },
  // Add more default collections
];

type DashboardTab = 'products' | 'collections' | 'categories' | 'settings';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<
    "global" | "india" | "both"
  >("both");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isEditingCollection, setIsEditingCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  const { fetchProducts, addProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();

  const [newProduct, setNewProduct] = useState<NewProduct>({
    title: "",
    price: { global: "", india: "" },
    image: "",
    category: "",
    amazonLink: { global: "", india: "" },
    rating: 0,
    region: "both",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const validateAmazonUrl = (
    url: string,
    region: "global" | "india"
  ): boolean => {
    if (!url) return true; // Empty URLs are valid (optional)

    const globalDomains = [
      "amazon.com",
      "amazon.co.uk",
      "amazon.de",
      "amazon.fr",
      "amazon.it",
      "amazon.es",
      "amazon.ca",
    ];
    const indiaDomain = "amazon.in";

    try {
      const urlObj = new URL(url);
      if (region === "global") {
        return globalDomains.some((domain) => urlObj.hostname.endsWith(domain));
      } else {
        return urlObj.hostname.endsWith(indiaDomain);
      }
    } catch {
      return false;
    }
  };

  const formatPrice = (price: string, region: "global" | "india"): string => {
    const numericPrice = price.replace(/[^0-9.]/g, "");
    if (!numericPrice) return "";

    const amount = parseFloat(numericPrice);
    if (isNaN(amount)) return "";

    return region === "global"
      ? `$${amount.toFixed(2)}`
      : `₹${amount.toFixed(2)}`;
  };

  const validateForm = async () => {
    setFormError(null);

    if (!newProduct.title.trim()) {
      setFormError("Title is required");
      return false;
    }

    // Validate image URL
    if (!newProduct.image) {
      setFormError("Image URL is required");
      return false;
    }

    // Basic URL validation
    if (selectedRegion === "global" || selectedRegion === "both") {
      if (
        newProduct.amazonLink.global &&
        !isValidUrl(newProduct.amazonLink.global)
      ) {
        setFormError("Please enter a valid URL for global link");
        return false;
      }
    }

    if (selectedRegion === "india" || selectedRegion === "both") {
      if (
        newProduct.amazonLink.india &&
        !isValidUrl(newProduct.amazonLink.india)
      ) {
        setFormError("Please enter a valid URL for India link");
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
        setImagePreview("");
      }
    } else {
      setImagePreview("");
    }
  };

  const getDisplayPrice = (product: Product) => {
    if (product.region === "india") {
      return product.price.india;
    } else if (product.region === "global") {
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

      const newProductWithRating = {
        ...newProduct,
        rating: parseFloat(newProduct.rating.toString()) || 0,
      };

      const result = await addProduct(newProductWithRating);
      if (result) {
        setProducts([...products, result]);
        setIsAddingProduct(false);
        // Reset form
        setNewProduct({
          title: "",
          price: { global: "", india: "" },
          image: "",
          category: "",
          amazonLink: { global: "", india: "" },
          rating: 0,
          region: "both",
        });
        setImagePreview("");
      }
    } catch (err) {
      setFormError("Failed to add product");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        setError("Failed to delete product");
      }
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const collectionsRef = firestoreCollection(db, "collections");
      const snapshot = await getDocs(collectionsRef);
      const fetchedCollections = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Collection[];
      setCollections(fetchedCollections);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const handleCollectionUpdate = async (collection: Collection) => {
    try {
      const collectionRef = doc(db, "collections", collection.id);
      // Create an object with only the updatable fields
      const updateData = {
        image: collection.image,
        description: collection.description || "",
        title: collection.title,
        category: collection.category,
      };

      await updateDoc(collectionRef, updateData);
      await fetchCollections();
      setIsEditingCollection(false);
      setSelectedCollection(null);
    } catch (error) {
      console.error("Error updating collection:", error);
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCollectionUpdate(selectedCollection);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={selectedCollection.image}
                  onChange={(e) =>
                    setSelectedCollection({
                      ...selectedCollection,
                      image: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-secondary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={selectedCollection.description}
                  onChange={(e) =>
                    setSelectedCollection({
                      ...selectedCollection,
                      description: e.target.value,
                    })
                  }
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
    setNewProduct((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const renderRatingInput = (
    rating: number,
    onChange: (rating: number) => void
  ) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <div key={i} className="flex items-center">
          {/* Full star button */}
          <button
            type="button"
            onClick={() => onChange(i)}
            className={`text-2xl transition-transform hover:scale-110 ${
              i <= rating ? "text-yellow-400" : "text-white/20"
            }`}
          >
            ★
          </button>

          {/* Half star button (if not last star) */}
          {i < rating + 0.5 && i >= rating && (
            <button
              type="button"
              onClick={() => onChange(i + 0.5)}
              className="text-2xl transition-transform hover:scale-110 relative w-4"
            >
              <span className="absolute inset-0 overflow-hidden w-1/2 text-yellow-400">
                ★
              </span>
              <span className="text-white/20">★</span>
            </button>
          )}
        </div>
      );
    }

    return <div className="flex gap-1">{stars}</div>;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const roundedRating = Math.floor(rating * 2) / 2;

    for (let i = 1; i <= 5; i++) {
      if (roundedRating >= i) {
        stars.push(
          <FaStar key={`star-${i}`} className="w-4 h-4 text-yellow-500" />
        );
      } else if (roundedRating >= i - 0.5) {
        stars.push(
          <FaStarHalfAlt
            key={`star-${i}`}
            className="w-4 h-4 text-yellow-500"
          />
        );
      } else {
        stars.push(
          <FaStar key={`star-${i}`} className="w-4 h-4 text-yellow-500" />
        );
      }
    }
    return stars;
  };

  const tabs = [
    { id: 'products', label: 'Products', icon: FaBox },
    { id: 'collections', label: 'Collections', icon: FaLayerGroup },
    { id: 'categories', label: 'Categories', icon: FaLayerGroup },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-secondary border-r border-white/10">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-accent-200 to-accent bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              className={`w-full px-6 py-4 flex items-center space-x-3 transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent/10 text-accent border-r-2 border-accent'
                  : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <tab.icon className="text-lg" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 px-6 py-3 flex items-center space-x-3 text-white/60 hover:text-white/80 transition-colors"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ProductsManager />
            </motion.div>
          )}

          {activeTab === 'collections' && (
            <motion.div
              key="collections"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CollectionsManager />
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CategoriesManager />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Settings />
            </motion.div>
          )}
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
