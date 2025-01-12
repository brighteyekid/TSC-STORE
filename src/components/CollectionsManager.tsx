import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Collection } from '../types/collection';
import { FaEdit, FaImage } from 'react-icons/fa';

const CollectionsManager = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingCollection, setIsEditingCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isTestingImage, setIsTestingImage] = useState(false);

  const DEFAULT_COLLECTIONS = [
    {
      id: 'plushies',
      title: 'Plushies',
      image: 'https://example.com/plushies.jpg',
      category: 'plushies',
      description: 'Cute and cuddly plushies collection'
    },
    {
      id: 'anime',
      title: 'Anime',
      image: 'https://example.com/anime.jpg',
      category: 'anime',
      description: 'Anime merchandise and collectibles'
    },
    {
      id: 'gaming',
      title: 'Gaming',
      image: 'https://example.com/gaming.jpg',
      category: 'gaming',
      description: 'Gaming merchandise and collectibles'
    },
    {
      id: 'tech',
      title: 'Tech',
      image: 'https://example.com/tech.jpg',
      category: 'tech',
      description: 'Tech gadgets and accessories'
    },
    {
      id: 'accessories',
      title: 'Accessories',
      image: 'https://example.com/accessories.jpg',
      category: 'accessories',
      description: 'Trendy accessories and add-ons'
    },
    {
      id: 'clothing',
      title: 'Clothing',
      image: 'https://example.com/clothing.jpg',
      category: 'clothing',
      description: 'Stylish apparel and fashion items'
    }
  ];

  const initializeCollections = async () => {
    try {
      setIsLoading(true);
      const collectionsRef = collection(db, 'collections');
      const snapshot = await getDocs(collectionsRef);
      
      // Get existing collection IDs
      const existingIds = new Set(snapshot.docs.map(doc => doc.id));
      
      // Create any missing collections
      for (const defaultCollection of DEFAULT_COLLECTIONS) {
        if (!existingIds.has(defaultCollection.id)) {
          console.log(`Creating collection: ${defaultCollection.id}`);
          const { id, ...collectionData } = defaultCollection;
          await setDoc(doc(db, 'collections', id), collectionData);
        }
      }

      // Fetch all collections after potential updates
      const updatedSnapshot = await getDocs(collectionsRef);
      const fetchedCollections = updatedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Collection[];

      console.log('Fetched collections:', fetchedCollections); // Debug log
      setCollections(fetchedCollections);
    } catch (error) {
      console.error('Error initializing collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeCollections();
  }, []);

  const handleCollectionUpdate = async (collection: Collection) => {
    try {
      const collectionRef = doc(db, 'collections', collection.id);
      const updateData = {
        image: collection.image,
        description: collection.description || '',
        title: collection.title,
        category: collection.category
      };
      
      await updateDoc(collectionRef, updateData);
      
      setCollections(prevCollections => 
        prevCollections.map(c => 
          c.id === collection.id ? { ...c, ...updateData } : c
        )
      );
      
      setIsEditingCollection(false);
      setSelectedCollection(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  };

  const fetchCollections = async () => {
    try {
      const collectionsRef = collection(db, 'collections');
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

  const testImageUrl = async (url: string) => {
    if (!url) return;
    
    setIsTestingImage(true);
    try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.startsWith('image/')) {
        setImagePreview(url);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsTestingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Featured Collections</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="bg-secondary rounded-xl overflow-hidden group"
          >
            <div className="relative aspect-video">
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  setSelectedCollection(collection);
                  setImagePreview(collection.image);
                  setIsEditingCollection(true);
                }}
                className="absolute top-2 right-2 p-2 bg-black/50 rounded-lg hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaEdit className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{collection.title}</h3>
              <p className="text-white/60 text-sm mt-1">{collection.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditingCollection && selectedCollection && (
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
                <h2 className="text-xl font-semibold mb-4">
                  Edit {selectedCollection.title} Collection
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCollectionUpdate(selectedCollection);
                  }}
                  className="space-y-4"
                >
                  {/* Image URL Input */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={selectedCollection.image}
                        onChange={(e) => {
                          setSelectedCollection({
                            ...selectedCollection,
                            image: e.target.value
                          });
                          if (imagePreview && e.target.value !== imagePreview) {
                            setImagePreview('');
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-secondary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => testImageUrl(selectedCollection.image)}
                        disabled={isTestingImage || !selectedCollection.image}
                        className={`px-4 py-2 rounded-lg ${
                          isTestingImage || !selectedCollection.image
                            ? 'bg-white/5 text-white/40 cursor-not-allowed'
                            : 'bg-accent text-white hover:bg-accent/80'
                        }`}
                      >
                        {isTestingImage ? 'Testing...' : 'Test'}
                      </button>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Description Input */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={selectedCollection.description || ''}
                      onChange={(e) => setSelectedCollection({
                        ...selectedCollection,
                        description: e.target.value
                      })}
                      className="w-full px-3 py-2 bg-secondary border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                      rows={3}
                      placeholder="Collection description..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingCollection(false);
                        setSelectedCollection(null);
                        setImagePreview('');
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionsManager; 
