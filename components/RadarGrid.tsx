'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeUsers } from '@/hooks/useRealtimeUsers';
import { supabase, type User } from '@/lib/supabase';
import PingIndicator from './PingIndicator';
import { User as UserIcon, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RadarGridProps {
  currentUserId: string;
}

export default function RadarGrid({ currentUserId }: RadarGridProps) {
  const { users, loading } = useRealtimeUsers('online');
  const router = useRouter();

  // Filter out current user
  const otherUsers = users.filter((user) => user.id !== currentUserId);

  const handleConnect = async (targetUserId: string) => {
    try {
      // Create a connection entry
      const { data: connection, error } = await supabase
        .from('connections')
        .insert({
          user_id: currentUserId,
          connected_user_id: targetUserId,
          notes: null,
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to connection session (you may need to adjust this route)
      router.push(`/spaces/session/${connection.id}`);
    } catch (err) {
      console.error('Error connecting:', err);
      alert('Failed to connect. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading radar...</p>
        </div>
      </div>
    );
  }

  if (otherUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <Wifi size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 text-lg mb-2">No one is online right now</p>
        <p className="text-gray-500 text-sm">Check back soon or invite others to join</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      <AnimatePresence>
        {otherUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "12px 12px 24px rgba(0, 0, 0, 0.2), -6px -6px 16px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleConnect(user.id)}
            className="frosted-glass rounded-[16px] p-4 md:p-6 cursor-pointer transition-all border-2 border-black/20 hover:border-black/40"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              {/* Avatar */}
              <div className="relative">
                {user.avatar_url ? (
                  <motion.img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-black/20"
                    whileHover={{ scale: 1.1 }}
                  />
                ) : (
                  <motion.div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-black/20"
                    whileHover={{ scale: 1.1 }}
                  >
                    <UserIcon size={32} className="text-white" />
                  </motion.div>
                )}
                
                {/* Ping indicator for online users */}
                <div className="absolute -bottom-1 -right-1">
                  <PingIndicator isReady={user.status === 'online'} size="md" />
                </div>
              </div>

              {/* Name */}
              <div className="w-full">
                <h3 
                  className="font-bold text-base md:text-lg truncate"
                  style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif" }}
                >
                  {user.name || 'Anonymous'}
                </h3>
                
                {/* Status text */}
                <p className="text-xs text-gray-500 mt-1">
                  Online
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
