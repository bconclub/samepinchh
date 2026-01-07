'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, AlertCircle } from 'lucide-react';
import type { MatchStatus } from '@/hooks/useMatchQueue';

interface MatchStatusProps {
  status: MatchStatus;
  error?: string | null;
}

export default function MatchStatus({ status, error }: MatchStatusProps) {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border-2 border-red-200 rounded-[12px] p-4 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span className="font-semibold">Error: {error}</span>
        </div>
      </motion.div>
    );
  }

  if (status === 'idle' || status === 'joining') {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {status === 'waiting' && (
        <motion.div
          key="waiting"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="frosted-glass rounded-[16px] p-6 text-center border-2 border-black/30"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <Clock size={48} className="text-blue-500" />
          </motion.div>
          <h3 
            className="text-2xl font-black mb-2"
            style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif" }}
          >
            Waiting for Match...
          </h3>
          <p className="text-gray-600">
            Looking for someone to connect with. This may take a moment.
          </p>
        </motion.div>
      )}

      {status === 'matched' && (
        <motion.div
          key="matched"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-green-50 border-2 border-green-300 rounded-[16px] p-6 text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: 2,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <Users size={48} className="text-green-500" />
          </motion.div>
          <h3 
            className="text-2xl font-black mb-2 text-green-700"
            style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif" }}
          >
            Matched!
          </h3>
          <p className="text-green-600 font-medium">
            You've been matched with someone. Redirecting to your space...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

