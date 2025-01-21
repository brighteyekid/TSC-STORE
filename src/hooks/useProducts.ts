import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Product, NewProduct } from "../types/product";

export const useProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
      return productsData;
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: NewProduct): Promise<Product | null> => {
    try {
      const docRef = await addDoc(collection(db, "products"), product);
      const newProduct = { ...product, id: docRef.id };
      return newProduct as Product;
    } catch (err) {
      setError("Failed to add product");
      return null;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, "products", id));
      return true;
    } catch (err) {
      setError("Failed to delete product");
      return false;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    try {
      await updateDoc(doc(db, "products", id), updates);
      return true;
    } catch (err) {
      setError("Failed to update product");
      return false;
    }
  };

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
    deleteProduct,
    updateProduct,
  };
};
