'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, Calendar, Edit2, Save, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { type Connection } from '@/lib/supabase';

interface ConnectionCardProps {
  connection: Connection;
  onUpdateNotes?: (connectionId: string, notes: string) => Promise<void>;
  onClick?: () => void;
}

export default function ConnectionCard({
  connection,
  onUpdateNotes,
  onClick,
}: ConnectionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(connection.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = async () => {
    if (onUpdateNotes) {
      setIsSaving(true);
      try {
        await onUpdateNotes(connection.id, notes);
        setIsEditing(false);
      } catch (err) {
        console.error('Error saving notes:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setNotes(connection.notes || '');
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const connectedUserName = connection.connected_user_name || 'Anonymous';
  const connectedUserAvatar = connection.connected_user_avatar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "12px 12px 24px rgba(0, 0, 0, 0.2), -6px -6px 16px rgba(0, 0, 0, 0.1)"
      }}
      onClick={onClick}
      className="frosted-glass rounded-[16px] p-4 md:p-6 border-2 border-black/20 hover:border-black/40 cursor-pointer transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 relative">
          {connectedUserAvatar ? (
            <img
              src={connectedUserAvatar}
              alt={connectedUserName}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-black/20"
            />
          ) : (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-black/20">
              <User size={24} className="text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-bold text-lg md:text-xl truncate"
                style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif" }}
              >
                {connectedUserName}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Calendar size={12} />
                <span>Connected {formatDate(connection.connected_at)}</span>
              </div>
            </div>
          </div>

          {/* Notes section */}
          <div className="mt-3">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-3 py-2 text-sm rounded-[8px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
                  rows={3}
                  placeholder="Add notes about this connection..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveNotes();
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded-[8px] hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Save size={14} />
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelEdit();
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-[8px] hover:bg-gray-400 transition-colors"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="group relative"
              >
                {notes ? (
                  <p className="text-sm text-gray-600 line-clamp-2">{notes}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic">Click to add notes...</p>
                )}
                <button
                  className="absolute right-0 top-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Edit notes"
                >
                  <Edit2 size={14} className="text-gray-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
