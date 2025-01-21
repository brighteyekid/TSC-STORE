import { motion } from 'framer-motion';
import { FaDiscord, FaGithub, FaHeart } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { gridPattern } from '../assets/gridPattern';
import { DISCORD_SERVER_LINK } from '../constants/links';

const Footer = () => {
  const socialLinks: Record<string, { url: string; icon: IconType; color: string }> = {
    discord: { 
      url: DISCORD_SERVER_LINK,
      icon: FaDiscord,
      color: '#5865F2'
    },
    github: { 
      url: 'https://github.com/brighteyekid',
      icon: FaGithub,
      color: '#ffffff'
    }
  };

  return (
    <footer className="relative bg-[#0A0A0A]">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `url("${gridPattern}")` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-accent-200 to-accent bg-clip-text text-transparent">
                TSC Store
              </h3>
              <motion.div 
                className="h-1 w-12 bg-accent/50 mt-2"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
              />
            </motion.div>
            <p className="text-white/60 leading-relaxed max-w-md">
              Your premium destination for anime, gaming, and tech merchandise. 
              Quality products, carefully curated for enthusiasts.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white/90">Explore</h4>
            <ul className="space-y-4">
              {['Plushies', 'Anime', 'Gaming', 'Tech'].map((item) => (
                <motion.li 
                  key={item}
                  className="group"
                  whileHover={{ x: 4 }}
                >
                  <a 
                    href={`/products/${item.toLowerCase()}`} 
                    className="relative inline-flex items-center text-white/60 hover:text-white transition-colors"
                  >
                    <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      •
                    </span>
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white/90">Legal</h4>
            <ul className="space-y-4">
              <motion.li 
                className="group"
                whileHover={{ x: 4 }}
              >
                <a 
                  href="/terms"
                  className="relative inline-flex items-center text-white/60 hover:text-white transition-colors"
                >
                  <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    •
                  </span>
                  Terms & Conditions
                </a>
              </motion.li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white/90">Connect</h4>
            <div className="flex gap-4">
              {Object.entries(socialLinks).map(([platform, { url, icon: Icon, color }]) => (
                <motion.a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <div className="relative w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden">
                    <div 
                      className="absolute inset-0 opacity-20 group-hover:opacity-100 transition-all duration-300"
                      style={{ backgroundColor: color }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <Icon 
                      className="relative text-xl transition-transform duration-300 group-hover:scale-110"
                      style={{ color }}
                    />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="relative mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p 
              className="text-white/40 text-sm flex items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Made with <FaHeart className="text-accent mx-2 animate-pulse" /> by TSC Team
            </motion.p>
            <motion.p 
              className="text-white/40 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              &copy; {new Date().getFullYear()} The Social Club Store. All rights reserved.
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 