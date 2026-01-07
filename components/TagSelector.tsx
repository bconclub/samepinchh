'use client';

import { motion } from 'framer-motion';

export type Tag = 'Brain Injury' | 'Stroke' | 'Cancer' | 'Trauma' | 'Caregiver' | 'Other';

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

const availableTags: Tag[] = ['Brain Injury', 'Stroke', 'Cancer', 'Trauma', 'Caregiver', 'Other'];

export default function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const toggleTag = (tag: Tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="contact-form__label contact-form-label block">
        Tags (optional)
      </label>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <motion.button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

