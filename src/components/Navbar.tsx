import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaDiscord, FaGlobe } from 'react-icons/fa';
import { useRegion } from '../context/RegionContext';
import { DISCORD_SERVER_LINK } from '../constants/links';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const location = useLocation();
  const { region, setRegion } = useRegion();

  const categories = [
    { name: 'Products', path: '/products' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const RegionButton = () => (
    <motion.div className="relative">
      <motion.button
        onClick={() => setShowRegionMenu(!showRegionMenu)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-lg">
          {region === 'india' ? '🇮🇳' : '🌍'}
        </span>
        <span className="text-sm font-medium">
          {region === 'india' ? 'India' : 'Global'}
        </span>
        <FaGlobe className="text-accent" />
      </motion.button>

      <AnimatePresence>
        {showRegionMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 rounded-xl bg-secondary border border-white/10 shadow-lg overflow-hidden z-50"
          >
            <div className="p-2">
              {['global', 'india'].map((r) => (
                <motion.button
                  key={r}
                  onClick={() => {
                    setRegion(r as 'global' | 'india');
                    setShowRegionMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                    region === r 
                      ? 'bg-accent/10 text-accent' 
                      : 'hover:bg-white/5'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <span className="text-lg">
                    {r === 'india' ? '🇮🇳' : '🌍'}
                  </span>
                  <span className="capitalize">
                    {r === 'global' ? 'Global' : r}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#080808]/80 backdrop-blur-xl border-b border-white/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="relative group"
          >
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-white via-accent-200 to-accent bg-clip-text text-transparent">
              TSC Store
            </span>
            <motion.div 
              className="absolute -bottom-1 left-0 right-0 h-px bg-accent/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="relative group py-2"
              >
                <span className={`${
                  location.pathname === category.path 
                    ? 'text-accent' 
                    : 'text-white/70 group-hover:text-white'
                } transition-colors`}>
                  {category.name}
                </span>
                
                {/* Active Indicator */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                  initial={false}
                  animate={{
                    scaleX: location.pathname === category.path ? 1 : 0,
                    opacity: location.pathname === category.path ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
                
                {/* Hover Indicator */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-px bg-white/50"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            ))}
            
            {/* Discord Button */}
            <motion.a
              href={DISCORD_SERVER_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#5865F2]/10 text-[#5865F2] flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDiscord />
              <span>Join</span>
            </motion.a>

            {/* Region Selector */}
            <RegionButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <RegionButton />
            <motion.button
              className="relative w-10 h-10 flex items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="absolute inset-0 bg-accent/5 rounded-lg" />
              {isOpen ? <HiX size={24} className="text-accent" /> : <HiMenu size={24} className="text-accent" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-4 py-6 space-y-4">
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  className={`block relative group overflow-hidden rounded-lg ${
                    location.pathname === category.path
                      ? 'text-accent'
                      : 'text-white/70'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="relative p-4">
                    {category.name}
                  </div>
                </Link>
              ))}
              
              <motion.a
                href={DISCORD_SERVER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group overflow-hidden rounded-lg"
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute inset-0 bg-[#5865F2]/10 group-hover:bg-[#5865F2]/20 transition-colors" />
                <div className="relative p-4 flex items-center space-x-2 text-[#5865F2]">
                  <FaDiscord />
                  <span>Join Discord</span>
                </div>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 