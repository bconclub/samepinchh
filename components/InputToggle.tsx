'use client';

import { motion } from 'framer-motion';
import { Type, Mic } from 'lucide-react';

type InputMode = 'text' | 'voice';

interface InputToggleProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
}

export default function InputToggle({ mode, onModeChange }: InputToggleProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <label className="contact-form__label contact-form-label block flex-1">
        What brought you here
      </label>
      <div className="flex bg-gray-200 rounded-[12px] p-1 gap-1">
        <motion.button
          type="button"
          onClick={() => onModeChange('text')}
          className={`px-4 py-2 rounded-[10px] font-semibold text-sm transition-all flex items-center gap-2 ${
            mode === 'text'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Type size={16} />
          Text
        </motion.button>
        <motion.button
          type="button"
          onClick={() => onModeChange('voice')}
          className={`px-4 py-2 rounded-[10px] font-semibold text-sm transition-all flex items-center gap-2 ${
            mode === 'voice'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Mic size={16} />
          Voice
        </motion.button>
      </div>
    </div>
  );
}

