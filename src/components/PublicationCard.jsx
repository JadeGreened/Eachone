import React from 'react';
import { motion } from 'framer-motion';

const buttonVariants = {
  hover: {
    y: -2,
    scale: 1.05,
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  },
  tap: {
    scale: 0.95
  }
};

const PublicationCardComponent = React.forwardRef(({ title, authors, journal, year, doi, conference, description, link, className, ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-white border border-black rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-2 hover:border-black ${className}`}
    style={{ color: '#111', fontFamily: 'Fira Mono, 思源黑体, Arial, sans-serif' }}
    {...props}
  >
    <div className="font-bold text-lg mb-1">{title}</div>
    <div className="text-sm mb-1" style={{ color: '#444' }}>{authors}</div>
    <div className="text-xs mb-2" style={{ color: '#666' }}>{conference || journal} · {year}</div>
    {description && <div className="text-sm mb-2">{description}</div>}
    {doi && <div className="text-xs" style={{ color: '#888' }}>DOI: {doi}</div>}
    {link && (
      <motion.a 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block px-3 py-1 bg-gray-100 rounded-lg text-xs hover:bg-gray-200"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        View Publication
      </motion.a>
    )}
  </div>
));

const PublicationCard = motion(PublicationCardComponent);

export default PublicationCard; 