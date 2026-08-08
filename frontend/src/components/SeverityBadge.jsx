import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldExclamationIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/solid';

const SeverityBadge = ({ severity, size = 'md', showIcon = true, animated = true }) => {
  const severityConfig = {
    critical: {
      color: 'from-red-600 to-pink-600',
      bg: 'bg-red-500/10',
      border: 'border-red-500/50',
      text: 'text-red-400',
      icon: ShieldExclamationIcon,
      glow: 'shadow-red-500/50'
    },
    high: {
      color: 'from-orange-500 to-red-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/50',
      text: 'text-orange-400',
      icon: ExclamationTriangleIcon,
      glow: 'shadow-orange-500/50'
    },
    medium: {
      color: 'from-yellow-500 to-orange-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      icon: InformationCircleIcon,
      glow: 'shadow-yellow-500/50'
    },
    low: {
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      icon: InformationCircleIcon,
      glow: 'shadow-blue-500/50'
    },
    info: {
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500/50',
      text: 'text-green-400',
      icon: ShieldCheckIcon,
      glow: 'shadow-green-500/50'
    }
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const severityLower = severity?.toLowerCase() || 'info';
  const config = severityConfig[severityLower] || severityConfig.info;
  const Icon = config.icon;

  const BadgeContent = () => (
    <div className={`
      inline-flex items-center gap-1.5
      ${config.bg}
      ${config.border}
      border
      rounded-full
      ${sizes[size]}
      font-semibold
      ${config.text}
      backdrop-blur-sm
    `}>
      {showIcon && <Icon className={iconSizes[size]} />}
      <span className="uppercase tracking-wide">{severityLower}</span>
    </div>
  );

  if (!animated) return <BadgeContent />;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="inline-block"
    >
      <BadgeContent />
    </motion.div>
  );
};

export default SeverityBadge;
