'use client';

import { motion } from 'framer-motion';

export type Tag = 'Brain Injury' | 'Stroke' | 'Cancer' | 'Trauma' | 'Caregiver' | 'Other' | 'Chronic Illness' | 'Accident Survivor' | 'Rare Disease';

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

const availableTags: Tag[] = ['Brain Injury', 'Stroke', 'Cancer', 'Trauma', 'Caregiver', 'Other', 'Chronic Illness', 'Accident Survivor', 'Rare Disease'];

export default function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const toggleTag = (tag: Tag) => {
    // Only allow one tag to be selected at a time
    if (selectedTags.includes(tag)) {
      // If clicking the same tag, deselect it
      onTagsChange([]);
    } else {
      // Select only this tag (replace any existing selection)
      onTagsChange([tag]);
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
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

