import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { gridPattern } from '../assets/gridPattern';

interface BootsplashProps {
  onComplete: () => void;
}

const Bootsplash = ({ onComplete }: BootsplashProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Delay completion for smooth transition
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary overflow-hidden"
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 bg-repeat opacity-5"
          style={{ backgroundImage: `url("${gridPattern}")` }}
        />
        
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(99,102,241,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(99,102,241,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(99,102,241,0.15) 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-accent-200 to-accent bg-clip-text text-transparent">
            TSC Store
          </h1>
          <motion.div 
            className="h-1 w-24 bg-accent/50 mx-auto mt-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.div>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          className="mt-4 text-sm text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {progress === 100 ? 'Welcome!' : 'Loading...'}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Bootsplash; 