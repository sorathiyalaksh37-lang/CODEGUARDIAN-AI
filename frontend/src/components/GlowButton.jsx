import React from 'react';
import { motion } from 'framer-motion';

const GlowButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon = null
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/50 hover:shadow-green-500/70',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg shadow-red-500/50 hover:shadow-red-500/70',
    outline: 'bg-transparent border-2 border-green-500 hover:bg-green-500/10 text-green-500 hover:border-green-400',
    ghost: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        relative
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        font-bold
        rounded-xl
        transition-all
        duration-300
        disabled:opacity-50
        disabled:cursor-not-allowed
        overflow-hidden
        group
        flex
        items-center
        justify-center
        gap-2
        ${className}
      `}
    >
      {/* Animated shine effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        }}
      />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
};

export default GlowButton;
