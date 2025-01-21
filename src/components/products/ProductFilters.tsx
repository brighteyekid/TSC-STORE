import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSort, FaChevronDown } from "react-icons/fa";

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (subcategory: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  totalProducts: number;
  filteredCount: number;
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
  { value: 'tech-audio', label: 'Audio & Headphones' },
  { value: 'tech-mobile', label: 'Mobile Accessories' },
  { value: 'tech-computer', label: 'Computer Accessories' },
  { value: 'tech-smart-home', label: 'Smart Home' },
  { value: 'tech-wearables', label: 'Wearables' },
  { value: 'tech-cameras', label: 'Cameras & Accessories' },
  { value: 'tech-storage', label: 'Storage & Drives' },
];

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'plushies', label: 'Plushies' },
  { value: 'anime', label: 'Anime Merch' },
  { value: 'gaming', label: 'Gaming' },
  { 
    value: 'tech', 
    label: 'Tech',
    subcategories: TECH_SUBCATEGORIES
  },
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

const ProductFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  showFilters,
  setShowFilters,
  totalProducts,
  filteredCount,
}: ProductFiltersProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const subDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (subDropdownRef.current && !subDropdownRef.current.contains(event.target as Node)) {
        setIsSubDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (category: string) => {
    if (category === 'tech') {
      setSelectedCategory('tech');
      setSelectedSubcategory('all');
      setIsSubDropdownOpen(true); // Open subcategory dropdown for tech
    } else {
      setSelectedCategory(category);
      setSelectedSubcategory('all');
      setIsDropdownOpen(false);
    }
  };

  const handleSubcategorySelect = (subcategory: string) => {
    if (selectedCategory === 'tech') {
      setSelectedCategory(subcategory); // For tech, use subcategory as main category
      setSelectedSubcategory('all');
    } else {
      setSelectedSubcategory(subcategory);
    }
    setIsSubDropdownOpen(false);
  };

  const getSelectedCategoryLabel = () => {
    if (selectedCategory === 'all') return 'All Categories';
    
    // Handle tech categories
    if (selectedCategory.startsWith('tech-')) {
      const techCategory = TECH_SUBCATEGORIES.find(sub => sub.value === selectedCategory);
      return `Tech - ${techCategory?.label || ''}`;
    }
    
    // Handle clothing categories
    if (selectedCategory.startsWith('clothing-')) {
      const type = selectedCategory.split('-')[1];
      return `${type.charAt(0).toUpperCase() + type.slice(1)}'s Clothing`;
    }
    
    const category = CATEGORIES.find(cat => cat.value === selectedCategory);
    return category ? category.label : 'All Categories';
  };

  const getSubcategories = () => {
    if (selectedCategory === 'tech' || selectedCategory.startsWith('tech-')) {
      return TECH_SUBCATEGORIES;
    }
    if (selectedCategory.startsWith('clothing-')) {
      return getClothingSubcategories();
    }
    return [];
  };

  const getClothingSubcategories = () => {
    if (selectedCategory === 'clothing-men') return CLOTHING_SUBCATEGORIES.men;
    if (selectedCategory === 'clothing-women') return CLOTHING_SUBCATEGORIES.women;
    if (selectedCategory === 'clothing-unisex') return CLOTHING_SUBCATEGORIES.unisex;
    return [];
  };

  const getSelectedSubcategoryLabel = () => {
    if (selectedCategory === 'tech' || selectedCategory.startsWith('tech-')) {
      const techCategory = TECH_SUBCATEGORIES.find(
        sub => sub.value === (selectedCategory.startsWith('tech-') ? selectedCategory : selectedSubcategory)
      );
      return techCategory ? techCategory.label : 'Select Type';
    }
    
    if (selectedSubcategory === 'all') return 'All Types';
    const subcategories = getSubcategories();
    const subcategory = subcategories.find(sub => sub.value === selectedSubcategory);
    return subcategory ? subcategory.label : 'Select Type';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Determine the final category and subcategory
    const finalCategory = selectedCategory;
    const finalSubcategory = (selectedCategory === 'tech' || selectedCategory.startsWith('clothing-'))
      ? selectedSubcategory 
      : undefined;

    const amazonLink = {
      global: (formData.get('amazonLinkGlobal') as string) || undefined,
      india: (formData.get('amazonLinkIndia') as string) || undefined,
    };

    // ... rest of the submit handler remains the same ...
  };

  return (
    <div className="mb-8 space-y-4 relative">
      {/* Active Filters Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">
            Showing {filteredCount} of {totalProducts} products
          </span>
          {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
                setSearchQuery('');
              }}
              className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
            >
              <FaTimes size={12} />
              Clear filters
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`text-sm flex items-center gap-2 ${
            showFilters ? 'text-accent' : 'text-white/60'
          } hover:text-accent`}
        >
          <FaSort size={14} />
          {showFilters ? 'Hide filters' : 'Show filters'}
        </button>
      </div>

      {/* Filters Panel */}
      <motion.div
        initial={false}
        animate={{
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-visible"
      >
        <div className="bg-secondary rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
              <button
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsSubDropdownOpen(false);
                }}
                className="w-full px-4 py-2.5 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent text-sm flex items-center justify-between group hover:border-accent/50"
              >
                <span>{getSelectedCategoryLabel()}</span>
                <FaChevronDown
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-[100] w-full mt-2 bg-primary border border-white/10 rounded-lg shadow-xl py-1 max-h-[300px] overflow-y-auto"
                    style={{ minWidth: '200px' }}
                  >
                    {CATEGORIES.map((cat) => (
                      <div key={cat.value}>
                        <button
                          onClick={() => handleCategorySelect(cat.value)}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${
                            (selectedCategory === cat.value || 
                            (cat.value === 'tech' && selectedCategory.startsWith('tech-')))
                              ? 'text-accent' 
                              : 'text-white'
                          }`}
                        >
                          {cat.label}
                        </button>
                        {cat.value === 'clothing' && cat.subcategories && (
                          <div className="pl-4 border-l border-white/10 ml-4 my-1">
                            {cat.subcategories.map((subCat) => (
                              <button
                                key={subCat.value}
                                onClick={() => handleSubcategorySelect(subCat.value)}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${
                                  selectedCategory === subCat.value ? 'text-accent' : 'text-white/80'
                                }`}
                              >
                                {subCat.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Show subcategories for tech */}
            {(selectedCategory === 'tech' || selectedCategory.startsWith('tech-')) && (
              <div className="relative" ref={subDropdownRef}>
                <label className="block text-sm font-medium text-white/80 mb-2">Type</label>
                <button
                  onClick={() => {
                    setIsSubDropdownOpen(!isSubDropdownOpen);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2.5 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent text-sm flex items-center justify-between group hover:border-accent/50"
                >
                  <span>{getSelectedSubcategoryLabel()}</span>
                  <FaChevronDown
                    className={`transition-transform duration-200 ${
                      isSubDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isSubDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-[100] w-full mt-2 bg-primary border border-white/10 rounded-lg shadow-xl py-1 max-h-[300px] overflow-y-auto"
                    >
                      {TECH_SUBCATEGORIES.map((sub) => (
                        <button
                          key={sub.value}
                          onClick={() => handleSubcategorySelect(sub.value)}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${
                            selectedCategory === sub.value ? 'text-accent' : 'text-white'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Search */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent text-sm"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductFilters; 