'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ColorBlobs from '@/components/ColorBlobs';
import RadarGrid from '@/components/RadarGrid';
import NameModal from '@/components/NameModal';
import { supabase } from '@/lib/supabase';
import { Radio, Users, Wifi } from 'lucide-react';

export default function SpacesPage() {
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isOnline, setIsOnline] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [showNameModal, setShowNameModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Handle name submission from modal
  const handleNameSubmit = async (inputName: string) => {
    try {
      setIsInitializing(true);
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: inputName,
          status: 'online',
          last_ping: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      const userId = data.id;
      localStorage.setItem('samepinchh_user_id', userId);
      localStorage.setItem('samepinchh_user_name', inputName);
      
      setCurrentUserId(userId);
      setUserName(inputName);
      setIsOnline(true);
      setShowNameModal(false);
      setIsInitializing(false);
      
      // Start ping interval
      const pingInterval = setInterval(async () => {
        await supabase
          .from('users')
          .update({
            last_ping: new Date().toISOString(),
            status: 'online',
          })
          .eq('id', userId);
      }, 30000);
      
      // Store interval for cleanup
      return () => {
        clearInterval(pingInterval);
        supabase
          .from('users')
          .update({ status: 'offline' })
          .eq('id', userId);
      };
    } catch (err) {
      console.error('Error creating user:', err);
      alert('Failed to create user. Please try again.');
      setIsInitializing(false);
    }
  };

  // Get or create user ID and set online status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let pingInterval: NodeJS.Timeout | null = null;
    let currentUserId: string | null = null;

    const initializeUser = async () => {
      let userId = localStorage.getItem('samepinchh_user_id');
      let name = localStorage.getItem('samepinchh_user_name') || '';

      if (!userId) {
        // Show name modal instead of browser prompt
        setShowNameModal(true);
        setIsInitializing(false);
        return;
      } else {
        currentUserId = userId;
        
        // Update existing user to online
        try {
          const { error } = await supabase
            .from('users')
            .update({
              status: 'online',
              last_ping: new Date().toISOString(),
            })
            .eq('id', userId);

          if (error) throw error;
        } catch (err) {
          console.error('Error updating user status:', err);
        }

        setCurrentUserId(userId);
        setUserName(name);
        setIsOnline(true);
        setIsInitializing(false);

        // Update last_ping every 30 seconds to keep status fresh
        pingInterval = setInterval(async () => {
          await supabase
            .from('users')
            .update({
              last_ping: new Date().toISOString(),
              status: 'online',
            })
            .eq('id', userId);
        }, 30000);
      }
    };

    initializeUser();

    // Cleanup on unmount - set status to offline
    return () => {
      if (pingInterval) {
        clearInterval(pingInterval);
      }
      if (currentUserId) {
        supabase
          .from('users')
          .update({ status: 'offline' })
          .eq('id', currentUserId);
      }
    };
  }, []);

  // Get online count
  useEffect(() => {
    const fetchOnlineCount = async () => {
      try {
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'online');

        if (!error && count !== null) {
          setOnlineCount(count);
        }
      } catch (err) {
        console.error('Error fetching online count:', err);
      }
    };

    fetchOnlineCount();
    const interval = setInterval(fetchOnlineCount, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const toggleOnline = async () => {
    if (!currentUserId) return;

    const newStatus = isOnline ? 'offline' : 'online';
    
    try {
      await supabase
        .from('users')
        .update({
          status: newStatus,
          last_ping: new Date().toISOString(),
        })
        .eq('id', currentUserId);

      setIsOnline(newStatus === 'online');
    } catch (err) {
      console.error('Error toggling online status:', err);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ColorBlobs />
      <Header />
      
      {/* Name Modal */}
      <NameModal
        isOpen={showNameModal}
        onSubmit={handleNameSubmit}
      />
      
      {isInitializing && !currentUserId ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : currentUserId ? (
        <>
          <section className="relative px-6 py-12 md:py-20 max-w-7xl mx-auto z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Radio size={32} className="text-green-500" />
                <h1 
                  className="text-4xl md:text-5xl font-black tracking-wide"
                  style={{ fontFamily: 'var(--font-classyvogue), sans-serif' }}
                >
                  Radar
                </h1>
              </div>
              <p className="text-lg text-gray-600 mb-4">
                Find people online and ready to connect
              </p>

              {/* Status bar */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Wifi size={16} />
                  <span>{onlineCount} {onlineCount === 1 ? 'person' : 'people'} online</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleOnline}
                    className={`px-4 py-2 rounded-[12px] font-semibold transition-all ${
                      isOnline
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {isOnline ? '✓ Online' : 'Go Online'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Radar Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <RadarGrid currentUserId={currentUserId} />
            </motion.div>
          </section>
          <Footer />
        </>
      ) : null}
    </main>
  );
}
