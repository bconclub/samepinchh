'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, FormEvent } from 'react';
import { User } from 'lucide-react';

interface NameModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  onClose?: () => void;
}

export default function NameModal({ isOpen, onSubmit, onClose }: NameModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    if (trimmedName.length > 50) {
      setError('Name must be less than 50 characters');
      return;
    }
    
    onSubmit(trimmedName);
    setName('');
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="frosted-glass rounded-[20px] p-6 md:p-8 max-w-md w-full border-2 border-black/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-black/10 rounded-full">
                  <User size={24} className="text-black" />
                </div>
                <h2 
                  className="text-2xl md:text-3xl font-black"
                  style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif" }}
                >
                  Enter Your Name
                </h2>
              </div>
              
              <p className="text-gray-600 mb-6 text-sm md:text-base">
                This name will be visible to others on the Radar
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    placeholder="Your name"
                    autoFocus
                    className="w-full px-4 py-3 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500 text-base"
                    maxLength={50}
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm mt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 rounded-[12px] bg-black text-white font-semibold hover:bg-gray-800 transition-all"
                  >
                    Continue
                  </motion.button>
                  {onClose && (
                    <motion.button
                      type="button"
                      onClick={onClose}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-3 rounded-[12px] bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

