import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRegion } from "../context/RegionContext";

const RegionSelector = () => {
  const { region, setRegion } = useRegion();
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    // Check if user has already selected a region
    const hasSelectedRegion = localStorage.getItem("hasSelectedRegion");
    if (!hasSelectedRegion) {
      setShowSelector(true);
    }
  }, []);

  const handleRegionSelect = (selectedRegion: "global" | "india") => {
    setRegion(selectedRegion);
    localStorage.setItem("region", selectedRegion);
    localStorage.setItem("hasSelectedRegion", "true");
    setShowSelector(false);
  };

  if (!showSelector) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-secondary p-8 rounded-2xl max-w-md w-full shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4">Select Your Region</h2>
        <p className="text-white/60 mb-6">
          Choose your preferred region to see relevant products. You can change
          this later in the navigation bar.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRegionSelect("global")}
            className={`p-4 rounded-xl border-2 transition-colors ${
              region === "global"
                ? "border-accent bg-accent/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <span className="text-2xl mb-2">🌍</span>
            <h3 className="font-semibold">Global</h3>
            <p className="text-sm text-white/60">International Store</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRegionSelect("india")}
            className={`p-4 rounded-xl border-2 transition-colors ${
              region === "india"
                ? "border-accent bg-accent/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <span className="text-2xl mb-2">🇮🇳</span>
            <h3 className="font-semibold">India</h3>
            <p className="text-sm text-white/60">Indian Store</p>
          </motion.button>
        </div>

        <p className="mt-6 text-sm text-white/40 text-center">
          This helps us show you relevant products and prices
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RegionSelector;
