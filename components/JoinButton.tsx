'use client';

import { motion } from 'framer-motion';
import { Loader2, Users } from 'lucide-react';
import type { MatchStatus } from '@/hooks/useMatchQueue';

interface JoinButtonProps {
  status: MatchStatus;
  onJoin: () => void;
  onLeave?: () => void;
  disabled?: boolean;
}

export default function JoinButton({ status, onJoin, onLeave, disabled }: JoinButtonProps) {
  const isLoading = status === 'joining';
  const isWaiting = status === 'waiting';
  const isMatched = status === 'matched';

  if (isWaiting && onLeave) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLeave}
        disabled={disabled}
        className="contact-form__submit contact-form-submit w-full font-black py-3 rounded-[12px] transition-all bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Leave Queue
      </motion.button>
    );
  }

  if (isMatched) {
    return (
      <motion.button
        disabled
        className="contact-form__submit contact-form-submit w-full font-black py-3 rounded-[12px] transition-all bg-green-500 text-white cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Users size={20} />
        Matched!
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{
        y: -4,
        scale: 1.02,
        boxShadow: "12px 12px 24px rgba(0, 0, 0, 0.25), -6px -6px 16px rgba(0, 0, 0, 0.15)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onJoin}
      disabled={disabled || isLoading}
      className="contact-form__submit contact-form-submit w-full font-black py-3 rounded-[12px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Joining...
        </>
      ) : (
        <>
          <Users size={20} />
          Join Space
        </>
      )}
    </motion.button>
  );
}


