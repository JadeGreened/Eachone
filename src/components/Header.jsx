import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useScroll } from 'framer-motion';

const Header = () => {
  const { scrollY } = useScroll();
  const controls = useAnimation();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      const isScrollingDown = latest > scrollY.getPrevious();
      if (latest > 100 && isScrollingDown) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    });
  }, [scrollY]);

  const variants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: '-100%', opacity: 0 },
  };

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Research', href: '#research' },
    { name: 'Projects', href: '#projects' },
    { name: 'Publications', href: '#publications' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      variants={variants}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <header className="w-full bg-white/95 py-4 flex items-center justify-between border-b border-black" style={{ fontFamily: 'Fira Mono, 思源黑体, Arial, sans-serif', color: '#111' }}>
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <a href="#" className="text-xl font-bold text-black">MyPortfolio</a>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-black hover:text-gray-600 transition-colors duration-200 text-sm font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>
          <motion.button 
            className="hidden md:block px-5 py-2 bg-white border border-black text-black rounded-full text-sm font-semibold hover:border-2 hover:shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download CV
          </motion.button>
          <div className="md:hidden">
            {/* Mobile menu button can be added here */}
            <button className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </motion.header>
  );
};

export default Header; 