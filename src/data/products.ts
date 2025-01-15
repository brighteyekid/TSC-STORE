export interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  amazonLink: string;
  category: "plushies" | "anime" | "gaming" | "tech";
  rating: number;
}

export const products: Product[] = [
  {
    id: "1",
    title: "Kawaii Plush Cat",
    price: "$19.99",
    image: "/images/plush-cat.jpg", // You'll need to add these images to public/images/
    amazonLink: "https://amazon.com/your-product-link",
    category: "plushies",
    rating: 4.5,
  },
  // Add more products here
];
