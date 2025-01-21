import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, updateDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

const CategoriesManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const categoriesRef = collection(db, 'categories');
      const snapshot = await getDocs(categoriesRef);
      const fetchedCategories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (category: Category) => {
    try {
      const categoryRef = doc(db, 'categories', category.id);
      await updateDoc(categoryRef, {
        name: category.name,
        description: category.description,
        slug: category.name.toLowerCase().replace(/\s+/g, '-')
      });
      
      await fetchCategories();
      setIsEditing(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleAdd = async (category: Omit<Category, 'id'>) => {
    try {
      const slug = category.name.toLowerCase().replace(/\s+/g, '-');
      const newCategoryRef = doc(collection(db, 'categories'));
      await setDoc(newCategoryRef, {
        ...category,
        slug,
        id: newCategoryRef.id
      });
      
      await fetchCategories();
      setIsAddingNew(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await deleteDoc(doc(db, 'categories', id));
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            className="bg-secondary p-6 rounded-xl"
            layout
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{category.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsEditing(true);
                  }}
                  className="p-2 text-white/60 hover:text-white"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-white/60 hover:text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="text-white/60">{category.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {(isEditing || isAddingNew) && (
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
              className="bg-secondary rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {isAddingNew ? 'Add New Category' : 'Edit Category'}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const categoryData = {
                      name: formData.get('name') as string,
                      description: formData.get('description') as string,
                      slug: ''
                    };

                    if (isAddingNew) {
                      handleAdd(categoryData);
                    } else if (selectedCategory) {
                      handleSave({ ...categoryData, id: selectedCategory.id });
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      name="name"
                      defaultValue={selectedCategory?.name}
                      className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={selectedCategory?.description}
                      className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setIsAddingNew(false);
                        setSelectedCategory(null);
                      }}
                      className="px-4 py-2 text-white/60 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80"
                    >
                      {isAddingNew ? 'Add Category' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoriesManager; 