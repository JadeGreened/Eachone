import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useScroll } from 'framer-motion';

const Header = ({ customMessage, showNavItems = true }) => {
  const { scrollY } = useScroll();
  const controls = useAnimation();
  const [hidden, setHidden] = useState(false);

  // useEffect(() => {
  //   return scrollY.onChange((latest) => {
  //     const isScrollingDown = latest > scrollY.getPrevious();
  //     if (latest > 100 && isScrollingDown) {
  //       setHidden(true);
  //     } else {
  //       setHidden(false);
  //     }
  //   });
  // }, [scrollY]);

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
      animate="visible"
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md shadow-sm"
    >
      <header className="w-full bg-white/90 py-4 flex items-center justify-between border-b border-black/10 h-20" style={{ fontFamily: 'Fira Mono, 思源黑体, Arial, sans-serif', color: '#111' }}>
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo 显示并添加淡入效果 - 最先出现 */}
          {customMessage ? (
            <motion.a 
              href="#" 
              className="text-xl font-bold text-black"
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              style={{ 
                fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                fontStyle: 'italic',
                fontWeight: 'bold'
              }}
            >
              Eachone's Portfolio
            </motion.a>
          ) : (
            <a href="#" className="text-xl font-bold text-black">Eachone's Portfolio</a>
          )}
          
          {customMessage ? (
            <div className="absolute left-0 right-0 mx-auto text-center" style={{ 
              fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
              fontStyle: 'italic',
              letterSpacing: '0.5px'
            }}>
              {/* 两行交错排列的文字 */}
              <div className="relative h-16">
                {/* 第一行文字 - 第二个出现 */}
                <motion.div
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 1 }}
                  className="absolute w-full text-center"
                  style={{ fontSize: '1.1rem', fontWeight: '500', top: '0', paddingRight: '5rem' }}
                >
                  Simplicity is the ultimate sophistication.
                </motion.div>
                
                {/* 第二行文字 - 最后出现 */}
                <motion.div
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 2 }}
                  className="absolute w-full text-center"
                  style={{ fontSize: '1.1rem', fontWeight: '500', top: '1.6rem', paddingLeft: '5rem' }}
                >
                  Please click the guy in the middle
                </motion.div>
              </div>
            </div>
          ) : showNavItems ? (
            <div className="hidden md:flex items-center space-x-8 mx-auto">
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
          ) : null}
          
          {/* 为了保持布局平衡，添加一个不可见的占位元素 */}
          <div className="invisible text-xl font-bold">
            Eachone's Portfolio
          </div>
          
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