import React from 'react';
import { motion } from 'framer-motion';

// Modify to accept individual props instead of an area object
const ResearchAreaCardComponent = React.forwardRef(({ icon, title, description, tags = [], className, ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm ${className}`}
    style={{ color: '#111', fontFamily: 'Fira Mono, 思源黑体, Arial, sans-serif' }}
    {...props}
  >
    <div className="text-3xl mb-2">{icon}</div>
    <div className="font-bold text-xl mb-1">{title}</div>
    <div className="text-base mb-2" style={{ color: '#444' }}>{description}</div>
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag, idx) => (  // 使用tags
        <span key={idx} className="px-2 py-1 border border-gray-200 rounded-full text-xs bg-gray-100 text-gray-700">{tag}</span>
      ))}
    </div>
  </div>
));

const ResearchAreaCard = motion(ResearchAreaCardComponent);

export default ResearchAreaCard;