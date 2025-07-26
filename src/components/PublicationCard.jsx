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

const PublicationCardComponent = React.forwardRef(({ pub, className }, ref) => (
  <div
    ref={ref}
    className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm ${className}`}
    style={{ color: '#111', fontFamily: 'Fira Mono, 思源黑体, Arial, sans-serif' }}
  >
    <div className="font-bold text-lg mb-1">{pub.title}</div>
    <div className="text-sm mb-1" style={{ color: '#444' }}>{pub.authors}</div>
    <div className="text-xs mb-2" style={{ color: '#666' }}>{pub.journal} · {pub.year}</div>
    <div className="text-xs" style={{ color: '#888' }}>DOI: {pub.doi}</div>
  </div>
));

const PublicationCard = motion(PublicationCardComponent);

export default PublicationCard; 