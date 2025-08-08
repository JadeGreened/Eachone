import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ customMessage, showNavItems = true }) => {
  const location = useLocation();

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
    { name: 'Home', href: '/#about' },
    { name: 'Research', href: '/#research' },
    { name: 'Games', href: '/#games' },
    { name: 'UI/UX', href: '/#uiux' },
    { name: 'Works', href: '/works' },
    { name: 'About', href: '/about' },
  ];

  return (
    <motion.header
      variants={variants}
      animate="visible"
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md shadow-sm"
    >
      <header className="w-full bg-white/90 py-4 flex items-center justify-between border-b border-black/10 h-20" style={{ fontFamily: 'Fira Mono, 思源黑体, Arial, sans-serif', color: '#111' }}>
        <div className="w-full flex items-center px-6 py-3">
          {/* Logo 显示并添加淡入效果 - 最先出现 */}
          {customMessage ? (
            <motion.div 
              className="text-xl font-bold text-black cursor-pointer"
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              style={{ 
                fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                fontStyle: 'italic',
                fontWeight: 'bold'
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Eachone's Portfolio
            </motion.div>
          ) : (
            <div 
              className="text-xl font-bold text-black cursor-pointer"
              style={{ 
                fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                fontStyle: 'italic',
                fontWeight: 'bold'
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Eachone's Portfolio
            </div>
          )}
          
          {/* 中间内容区域 - 使用flex-1来占据剩余空间 */}
          <div className="flex-1 flex justify-center relative">
            {customMessage ? (
              <div className="text-center" style={{ 
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
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => {
                  // 判断是内部路由链接还是锚点链接
                  const isRouteLink = item.href.startsWith('/') && !item.href.includes('#');
                  const isActive = location.pathname === item.href;
                  
                  if (isRouteLink) {
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`hover:text-gray-600 transition-colors duration-200 text-base md:text-lg font-medium ${
                          isActive ? 'text-gray-800 font-semibold' : 'text-black'
                        }`}
                        style={{ 
                          fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                          fontStyle: 'italic'
                        }}
                      >
                        {item.name}
                      </Link>
                    );
                  } else {
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-black hover:text-gray-600 transition-colors duration-200 text-base md:text-lg font-medium"
                        style={{ 
                          fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                          fontStyle: 'italic'
                        }}
                      >
                        {item.name}
                      </a>
                    );
                  }
                })}
              </div>
            ) : null}
          </div>
          
          {/* 右侧简历下载按钮 */}
          <motion.button 
            className="bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors duration-300 shadow-lg hidden md:block"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.1 }
            }}
          >
            Here for my resume
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