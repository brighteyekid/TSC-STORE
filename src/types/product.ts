export interface Product {
  id: string;
  title: string;
  price: {
    global?: string;
    india?: string;
  };
  image: string;
  category: string;
  amazonLink: {
    global?: string;
    india?: string;
  };
  rating: number;
  region: 'global' | 'india' | 'both';
}

export type NewProduct = Omit<Product, 'id'>; 