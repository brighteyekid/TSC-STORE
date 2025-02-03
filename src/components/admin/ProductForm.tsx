import { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types/product';
import { validateImageUrl, validateAmazonUrl } from '../../utils/adminUtils';

interface ProductFormProps {
  product: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
  isNew?: boolean;
}

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

const TECH_SUBCATEGORIES = [
  { value: 'tech-gaming', label: 'Gaming Accessories' },
  { value: 'tech-smartphones', label: 'Smartphones' },
  { value: 'tech-pc-laptops', label: 'PC/Laptops' },
  { value: 'tech-audio', label: 'Audio & Headphones' },
  { value: 'tech-mobile', label: 'Mobile Accessories' },
  { value: 'tech-computer', label: 'Computer Accessories' },
  { value: 'tech-smart-home', label: 'Smart Home' },
  { value: 'tech-wearables', label: 'Wearables' },
  { value: 'tech-cameras', label: 'Cameras & Accessories' },
  { value: 'tech-storage', label: 'Storage & Drives' },
];

const ProductForm = ({ product, onSave, onCancel, isNew = false }: ProductFormProps) => {
  const [imagePreview, setImagePreview] = useState(product?.image || '');
  const [isTestingImage, setIsTestingImage] = useState(false);
  
  const [selectedMainCategory, setSelectedMainCategory] = useState(() => {
    if (!product?.category) return '';
    if (product.category.startsWith('tech-')) return 'tech';
    if (product.category.startsWith('clothing-')) return 'clothing';
    return product.category;
  });
  
  const [selectedClothingType, setSelectedClothingType] = useState(() => {
    if (!product?.category) return '';
    return product.category.startsWith('clothing-') ? product.category : '';
  });
  
  const [selectedSubcategory, setSelectedSubcategory] = useState(() => {
    if (!product?.category) return '';
    if (product.category.startsWith('tech-')) return product.category;
    return product.subcategory || '';
  });

  const getClothingSubcategories = (type: string) => {
    if (type === 'clothing-men') return CLOTHING_SUBCATEGORIES.men;
    if (type === 'clothing-women') return CLOTHING_SUBCATEGORIES.women;
    if (type === 'clothing-unisex') return CLOTHING_SUBCATEGORIES.unisex;
    return [];
  };

  const getSubcategories = () => {
    if (selectedMainCategory === 'tech') {
      return TECH_SUBCATEGORIES;
    }
    if (selectedClothingType) {
      return getClothingSubcategories(selectedClothingType);
    }
    return [];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // For tech products, use the tech subcategory as the category
    let finalCategory = selectedMainCategory;
    if (selectedMainCategory === 'tech') {
      if (!selectedSubcategory) {
        alert('Please select a tech category');
        return;
      }
      finalCategory = selectedSubcategory; // This will be 'tech-gaming', 'tech-audio', etc.
    } else if (selectedMainCategory === 'clothing') {
      finalCategory = selectedClothingType;
    }

    const productData: Partial<Product> = {
      id: product?.id,
      title: formData.get('title') as string,
      category: finalCategory,
      subcategory: selectedMainCategory === 'clothing' ? selectedSubcategory : undefined,
      image: formData.get('image') as string,
      region: formData.get('region') as "global" | "india" | "both",
      rating: parseFloat(formData.get('rating') as string),
      amazonLink: {
        global: (formData.get('amazonLinkGlobal') as string) || undefined,
        india: (formData.get('amazonLinkIndia') as string) || undefined
      }
    };

    // Validate required fields
    if (!productData.title || !productData.image || !productData.category) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate clothing category selection
    if (selectedMainCategory === 'clothing' && !selectedClothingType) {
      alert('Please select a clothing type');
      return;
    }

    // Validate clothing subcategory
    if (selectedClothingType && !selectedSubcategory) {
      alert('Please select a clothing subcategory');
      return;
    }

    // Validate image URL
    const isImageValid = await validateImageUrl(productData.image);
    if (!isImageValid) {
      alert('Please enter a valid image URL');
      return;
    }

    // Validate Amazon URLs
    if (productData.amazonLink?.global && !validateAmazonUrl(productData.amazonLink.global)) {
      alert('Please enter a valid global Amazon URL');
      return;
    }
    if (productData.amazonLink?.india && !validateAmazonUrl(productData.amazonLink.india)) {
      alert('Please enter a valid India Amazon URL');
      return;
    }

    onSave(productData);
  };

  const handleTestImage = async (url: string) => {
    setIsTestingImage(true);
    const isValid = await validateImageUrl(url);
    setImagePreview(isValid ? url : '');
    setIsTestingImage(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-secondary rounded-xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col"
    >
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold">
          {isNew ? 'Add New Product' : 'Edit Product'}
        </h2>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar">
        <form
          id="productForm"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="title"
              defaultValue={product?.title}
              className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
              required
            />
          </div>

          {/* Main Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={selectedMainCategory}
              onChange={(e) => {
                setSelectedMainCategory(e.target.value);
                if (e.target.value !== 'clothing') setSelectedClothingType('');
                if (e.target.value !== 'tech') setSelectedSubcategory('');
              }}
              className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
              required
            >
              <option value="">Select a category</option>
              <option value="plushies">Plushies</option>
              <option value="anime">Anime Merch</option>
              <option value="gaming">Gaming</option>
              <option value="tech">Tech</option>
              <option value="accessories">Accessories</option>
              <option value="clothing">Clothing</option>
              <option value="amazon-finds">Amazon Finds</option>
            </select>
          </div>

          {/* Tech Subcategories */}
          {selectedMainCategory === 'tech' && (
            <div>
              <label className="block text-sm font-medium mb-1">Tech Category</label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                required
              >
                <option value="">Select tech category</option>
                {TECH_SUBCATEGORIES.map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clothing Type */}
          {selectedMainCategory === 'clothing' && (
            <div>
              <label className="block text-sm font-medium mb-1">Clothing Type</label>
              <select
                value={selectedClothingType}
                onChange={(e) => {
                  setSelectedClothingType(e.target.value);
                  setSelectedSubcategory('');
                }}
                className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                required
              >
                <option value="">Select clothing type</option>
                <option value="clothing-men">Men's Clothing</option>
                <option value="clothing-women">Women's Clothing</option>
                <option value="clothing-unisex">Unisex Clothing</option>
              </select>
            </div>
          )}

          {/* Clothing Subcategory */}
          {selectedClothingType && (
            <div>
              <label className="block text-sm font-medium mb-1">Subcategory</label>
              <select
                name="subcategory"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                required
              >
                <option value="">Select subcategory</option>
                {getSubcategories().map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <div className="flex gap-2">
              <input
                name="image"
                defaultValue={product?.image}
                onChange={(e) => setImagePreview(e.target.value)}
                className="flex-1 px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                required
              />
              <button
                type="button"
                onClick={() => handleTestImage(imagePreview)}
                className="px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20"
                disabled={isTestingImage}
              >
                {isTestingImage ? 'Testing...' : 'Test'}
              </button>
            </div>
            {imagePreview && (
              <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-white/5">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium mb-1">Region</label>
            <select
              name="region"
              defaultValue={product?.region}
              className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
              required
            >
              <option value="global">Global Only</option>
              <option value="india">India Only</option>
              <option value="both">Both Regions</option>
            </select>
          </div>

          {/* Amazon Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Global Amazon Link</label>
              <input
                name="amazonLinkGlobal"
                defaultValue={product?.amazonLink?.global}
                className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                placeholder="https://amazon.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">India Amazon Link</label>
              <input
                name="amazonLinkIndia"
                defaultValue={product?.amazonLink?.india}
                className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                placeholder="https://amazon.in/..."
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="rating"
                defaultValue={product?.rating || 5}
                min="0"
                max="5"
                step="any"
                className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                onChange={(e) => {
                  // Ensure value is between 0 and 5
                  const value = parseFloat(e.target.value);
                  if (value < 0) e.target.value = '0';
                  if (value > 5) e.target.value = '5';
                }}
              />
              <span className="text-white/60">★</span>
            </div>
            <p className="mt-1 text-sm text-white/40">
              Enter any decimal value between 0 and 5
            </p>
          </div>
        </form>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="p-6 border-t border-white/10 bg-secondary">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-white/60 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="productForm"
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80"
          >
            {isNew ? 'Add Product' : 'Save Changes'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductForm; 