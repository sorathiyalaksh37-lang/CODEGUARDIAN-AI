import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ 
  progress = 0, 
  color = 'green',
  height = 'md',
  showPercentage = true,
  animated = true,
  label = ''
}) => {
  const colors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4'
  };

  const glowColors = {
    green: 'shadow-green-500/50',
    blue: 'shadow-blue-500/50',
    red: 'shadow-red-500/50',
    yellow: 'shadow-yellow-500/50',
    purple: 'shadow-purple-500/50',
  };

  return (
    <div className="w-full space-y-2">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-zinc-400">{label}</span>}
          {showPercentage && <span className="text-white font-semibold">{Math.round(progress)}%</span>}
        </div>
      )}
      
      <div className={`w-full bg-zinc-800 rounded-full overflow-hidden ${heights[height]}`}>
        <motion.div
          className={`${colors[color]} ${heights[height]} rounded-full shadow-lg ${glowColors[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: animated ? 1 : 0, 
            ease: "easeOut" 
          }}
          style={{
            boxShadow: `0 0 20px ${color === 'green' ? 'rgba(34, 197, 94, 0.5)' : 
                                   color === 'blue' ? 'rgba(59, 130, 246, 0.5)' :
                                   color === 'red' ? 'rgba(239, 68, 68, 0.5)' :
                                   color === 'yellow' ? 'rgba(234, 179, 8, 0.5)' :
                                   'rgba(168, 85, 247, 0.5)'}`
          }}
        >
          {animated && (
            <motion.div
              className="h-full w-full"
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                backgroundSize: '50% 100%',
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
