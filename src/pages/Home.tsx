import { motion, useScroll, useTransform } from 'framer-motion';
import { FaDiscord, FaArrowRight, FaUsers, FaBox, FaStar, FaHeart, FaGem, FaRocket, FaCrown, FaHeadset, FaCheckCircle } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { gridPattern } from '../assets/gridPattern';
import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types/product';
import { useRegion } from '../context/RegionContext';
import { Collection } from '../types/collection';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { DISCORD_SERVER_LINK } from '../constants/links';

const FEATURED_CATEGORIES = [
  {
    id: 'plushies',
    title: 'Plushies',
    description: 'Cute and cuddly plushies collection',
    image: 'https://example.com/plushies.jpg'
  },
  {
    id: 'anime',
    title: 'Anime',
    description: 'Anime merchandise and collectibles',
    image: 'https://example.com/anime.jpg'
  },
  {
    id: 'gaming',
    title: 'Gaming',
    description: 'Gaming accessories and merchandise',
    image: 'https://example.com/gaming.jpg'
  },
  {
    id: 'tech',
    title: 'Tech',
    description: 'Tech gadgets and accessories',
    image: 'https://example.com/tech.jpg'
  },
  {
    id: 'accessories',
    title: 'Accessories',
    description: 'Trendy accessories and add-ons',
    image: 'https://example.com/accessories.jpg'
  },
  {
    id: 'clothing',
    title: 'Clothing',
    description: 'Stylish apparel and fashion items',
    image: 'https://example.com/clothing.jpg'
  }
];

const CommunitySection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div 
        className="absolute inset-0 bg-repeat opacity-5"
        style={{ backgroundImage: `url("${gridPattern}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
      
      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl"
        animate={{
          x: [-100, 100],
          y: [-100, 100],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"
        animate={{
          x: [100, -100],
          y: [100, -100],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-accent-200 to-accent bg-clip-text text-transparent">
              Join Our Growing Community
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Connect with fellow enthusiasts, get early access to new products, and participate in exclusive events.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { icon: FaUsers, value: "10,000+", label: "Members" },
              { icon: FaBox, value: "20+", label: "Products" },
              { icon: FaStar, value: "4.9/5", label: "Rating" },
              { icon: FaHeart, value: "100%", label: "Satisfaction" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-accent/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative p-6">
                  <stat.icon className="w-8 h-8 text-accent mb-4 mx-auto" />
                  <h3 className="text-3xl font-bold font-mono mb-2 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </h3>
                  <p className="text-white/60">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Discord Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.a
              href={DISCORD_SERVER_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] transition-all rounded-xl font-semibold text-white shadow-lg hover:shadow-[#5865F2]/25 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
              
              <FaDiscord className="text-2xl" />
              <span className="relative">Join Discord</span>
              
              {/* Button Border Gradient */}
              <div className="absolute inset-0 rounded-xl border border-white/10" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const stats = [
    { value: '1k+', label: 'Active Members' },
    { value: '20+', label: 'Products' },
    { value: '24/7', label: 'Support' },
    { value: '100%', label: 'Satisfaction' }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `url("${gridPattern}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-transparent to-primary" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-accent-200 to-accent bg-clip-text text-transparent mb-2">
                {stat.value}
              </h3>
              <p className="text-white/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-white/80 leading-relaxed">
              Our Discord server was created with the mission of helping people connect and help them spend quality time in a safe, non-toxic environment. Maintaining this community takes a lot of effort and dedication, which is why we've launched this blog.
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              By shopping through our Amazon affiliate links you, directly support the server, allowing us to continue improving and expanding our community. Your support helps us ensure that our server remains a welcoming place for everyone.
            </p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl font-medium text-accent"
            >
              Thank you for being part of our journey and for your continued support!
            </motion.p>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="pt-8"
          >
            <motion.a
              href={DISCORD_SERVER_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-accent/10 hover:bg-accent/20 rounded-xl group transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDiscord className="text-[#5865F2] text-xl" />
              <span className="font-medium text-accent">Join Our Community</span>
              <motion.span
                className="text-accent"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { region } = useRegion();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const allProducts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Product))
          .filter(product => 
            product.region === region || 
            product.region === 'both'
          );
        
        // Get 4 random products for featured section
        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, [region]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

const Home = () => {
  const { scrollYProgress } = useScroll();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { fetchProducts, isLoading } = useProducts();
  const { region } = useRegion();
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      const allProducts = await fetchProducts();
      // Filter products based on region
      const regionProducts = allProducts.filter(product => 
        product.region === 'both' || 
        product.region === region ||
        (region === 'global' && product.amazonLink.global) ||
        (region === 'india' && product.amazonLink.india)
      );
      
      // Randomly select featured products
      const featured = regionProducts
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
      
      setFeaturedProducts(featured);
    };
    
    loadFeaturedProducts();
  }, [fetchProducts, region]); // Add region as dependency

  useEffect(() => {
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

    fetchCollections();
  }, []);

  // Enhanced parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // You can use FEATURED_CATEGORIES as a fallback if collections haven't loaded yet
  const displayCollections = collections.length > 0 ? collections : FEATURED_CATEGORIES;

  return (
    <div className="min-h-screen bg-[#080808] overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 bg-repeat opacity-5"
            style={{ backgroundImage: `url("${gridPattern}")` }}
          />
          
          {/* Animated Gradient Orbs */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[500px] h-[500px] rounded-full"
              style={{
                background: `radial-gradient(circle, ${
                  i % 2 === 0 ? 'rgba(99,102,241,0.1)' : 'rgba(139,92,246,0.1)'
                } 0%, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 30, 0],
                y: [0, 30, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}

          {/* Animated Lines */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute h-px bg-accent/20"
              style={{
                left: 0,
                right: 0,
                top: `${(i + 1) * 10}%`,
              }}
              animate={{
                scaleX: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}

          {/* Noise Overlay */}
          <div className="absolute inset-0 bg-noise opacity-[0.03]" />
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-20 text-center px-4 max-w-6xl mx-auto"
          style={{ scale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Enhanced Title with Glitch Effect */}
            <div className="relative">
              <motion.h1 
                className="font-display text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-accent-200 to-accent bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['200% 0', '-200% 0'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                The Social Club Store
              </motion.h1>
              {/* Glitch Layers */}
              {[...Array(2)].map((_, i) => (
                <motion.h1
                  key={i}
                  className="absolute top-0 left-0 w-full font-display text-6xl md:text-8xl font-bold text-accent/30"
                  animate={{
                    x: [-2, 2, -2],
                    opacity: [0.5, 0.3, 0.5],
                  }}
                  transition={{
                    duration: 0.2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  The Social Club Store
                </motion.h1>
              ))}
            </div>

            {/* Enhanced Subtitle */}
            <motion.p
              className="font-mono text-xl md:text-2xl text-accent/80 tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Premium Gaming & Anime Collections
            </motion.p>

            {/* Enhanced CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {/* Explore Button */}
              <motion.a 
                href="#products" 
                className="group relative px-8 py-4 bg-accent/10 rounded-xl font-semibold overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative flex items-center space-x-2">
                  <span className="text-accent">Explore Products</span>
                  <FaArrowRight className="text-accent group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 border border-accent/20 rounded-xl" />
                {/* Enhanced Shine Effect */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                  animate={{
                    background: [
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                      'linear-gradient(90deg, transparent 100%, rgba(255,255,255,0.1) 150%, transparent 200%)',
                    ],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              </motion.a>

              {/* Discord Button */}
              <motion.a 
                href={DISCORD_SERVER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-[#5865F2]/10 rounded-xl font-semibold overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-[#5865F2] opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative flex items-center space-x-2">
                  <FaDiscord className="text-[#5865F2]" />
                  <span className="text-[#5865F2]">Join Community</span>
                </div>
                <div className="absolute inset-0 border border-[#5865F2]/20 rounded-xl" />
                {/* Enhanced Shine Effect */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                  animate={{
                    background: [
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                      'linear-gradient(90deg, transparent 100%, rgba(255,255,255,0.1) 150%, transparent 200%)',
                    ],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
            opacity: [1, 0.5, 1],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-accent/30 flex items-start justify-center p-2">
            <motion.div 
              className="w-1 h-1 rounded-full bg-accent"
              animate={{ 
                y: [0, 16, 0],
                opacity: [1, 0.5, 1],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Collections Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Featured Collections
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden group"
              >
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                  <p className="text-white/80 mb-4">{collection.description}</p>
                  <Link
                    to={`/products/${collection.category}`}
                    className="inline-flex items-center text-accent group/link"
                  >
                    <span>View Collection</span>
                    <FaArrowRight className="ml-2 transform transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-32 relative">
        <div className="absolute inset-0">
          {/* Animated lines background */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-accent/20"
              style={{
                left: 0,
                right: 0,
                top: `${(i + 1) * 5}%`,
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scaleX: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-accent text-sm tracking-wider">DISCOVER</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-white via-accent-200 to-accent bg-clip-text text-transparent">
              Featured Products
            </h2>
            <motion.div 
              className="h-1 w-24 bg-accent/50 mx-auto mt-4"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
            />
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="/products"
              className="group relative inline-flex items-center px-8 py-4 bg-accent/10 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" />
              <span className="relative text-accent font-semibold">View All Products</span>
              <FaArrowRight className="relative ml-2 text-accent group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <WhyChooseUs />

      {/* Community Section */}
      <CommunitySection />
    </div>
  );
};

export default Home; 