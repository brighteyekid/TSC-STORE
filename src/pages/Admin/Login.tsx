import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if screen width is less than 768px (typical mobile breakpoint)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Redirect if mobile
    if (window.innerWidth < 768) {
      navigate('/');
    }

    // Clear everything on mount
    localStorage.clear();
    sessionStorage.clear();
    signOut(auth);

    return () => window.removeEventListener('resize', checkMobile);
  }, [navigate]);

  // If mobile, don't render the login form
  if (isMobile) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="min-h-screen bg-primary flex items-center justify-center p-4"
      >
        <div className="bg-secondary p-8 rounded-xl max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-4">Access Denied</h2>
          <p className="text-white/60 mb-6">
            Admin access is only available on desktop devices.
          </p>
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-accent/10 text-accent rounded-lg font-semibold"
          >
            Return Home
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signOut(auth); // Force sign out before attempting login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user.email === process.env.REACT_APP_ADMIN_EMAIL) {
        navigate('/admin/dashboard');
      } else {
        throw new Error('Unauthorized email');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials. Please check your email and password.');
      localStorage.clear();
      sessionStorage.clear();
      await signOut(auth);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
            <p className="text-white/60">Enter your credentials to continue</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent/50"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full px-4 py-3 bg-accent/10 rounded-xl text-accent font-semibold relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login; 