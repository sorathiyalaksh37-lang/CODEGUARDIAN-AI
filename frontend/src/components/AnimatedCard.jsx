import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  className = '', 
  delay = 0,
  hover = true,
  gradient = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut" 
      }}
      whileHover={hover ? { 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      } : {}}
      className={`
        relative
        bg-zinc-900/80
        backdrop-blur-xl
        border
        border-zinc-800
        rounded-2xl
        p-6
        overflow-hidden
        transition-all
        duration-300
        ${gradient ? 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-green-500/10 before:to-blue-500/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300' : ''}
        ${className}
      `}
    >
      {/* Glow effect on hover */}
      {hover && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 blur-xl" />
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default AnimatedCard;
