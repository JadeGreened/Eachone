import React from 'react';
import { motion } from 'framer-motion';

// Using React.forwardRef allows the parent motion component to pass down its ref.
// motion() HOC makes our component compatible with framer-motion props.

const ResearchAreaCardComponent = React.forwardRef(({ area, className }, ref) => (
  <div
    ref={ref}
    className={`bg-white border border-black rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-2 hover:border-black ${className}`}
    style={{ color: '#111', fontFamily: 'Fira Mono, 思源黑体, Arial, sans-serif' }}
  >
    <div className="text-3xl mb-2">{area.icon}</div>
    <div className="font-bold text-xl mb-1">{area.title}</div>
    <div className="text-base mb-2" style={{ color: '#444' }}>{area.description}</div>
    <div className="flex flex-wrap gap-2 mt-2">
      {area.tags.map((tag, idx) => (
        <span key={idx} className="px-2 py-1 border border-black rounded-full text-xs bg-white" style={{ color: '#222' }}>{tag}</span>
      ))}
    </div>
  </div>
));

const ResearchAreaCard = motion(ResearchAreaCardComponent);

export default ResearchAreaCard; 