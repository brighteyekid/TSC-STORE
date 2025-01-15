import { useState, useCallback } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Product, NewProduct } from "../types/product";

export const useProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        rating: doc.data().rating || 0,
      })) as Product[];
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProduct = useCallback(
    async (product: NewProduct): Promise<Product | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const docRef = await addDoc(collection(db, "products"), product);
        return { id: docRef.id, ...product };
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, "products", id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    fetchProducts,
    addProduct,
    deleteProduct,
  };
};
