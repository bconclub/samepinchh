'use client';

import { motion } from 'framer-motion';

interface PingIndicatorProps {
  isReady: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function PingIndicator({ isReady, size = 'md' }: PingIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const pingSize = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  if (!isReady) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-400`} />
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Ping animation circles */}
      <motion.div
        className={`absolute ${pingSize[size]} rounded-full bg-green-400/30`}
        animate={{
          scale: [1, 2, 2],
          opacity: [0.7, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.div
        className={`absolute ${pingSize[size]} rounded-full bg-green-400/20`}
        animate={{
          scale: [1, 2.5, 2.5],
          opacity: [0.5, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5,
        }}
      />
      
      {/* Main dot */}
      <motion.div
        className={`${sizeClasses[size]} rounded-full bg-green-500 relative z-10`}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}


