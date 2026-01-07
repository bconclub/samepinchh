'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ColorBlobs from '@/components/ColorBlobs';
import { supabase } from '@/lib/supabase';
import { Users, MessageCircle, X } from 'lucide-react';

export default function SessionPageClient() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const { data, error } = await supabase
          .from('match_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (error) throw error;
        setSession(data);
      } catch (err) {
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Subscribe to session updates
    const channel = supabase
      .channel(`session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'match_sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          setSession(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const leaveSession = async () => {
    if (confirm('Are you sure you want to leave this space?')) {
      router.push('/spaces');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <ColorBlobs />
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your space...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <ColorBlobs />
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Session not found</p>
            <button
              onClick={() => router.push('/spaces')}
              className="px-6 py-2 bg-black text-white rounded-lg"
            >
              Back to Spaces
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ColorBlobs />
      <Header />
      
      <section className="relative px-6 py-12 md:py-20 max-w-2xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="frosted-glass rounded-[16px] p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Users size={32} className="text-green-500" />
              </motion.div>
              <div>
                <h1 
                  className="text-2xl font-black"
                  style={{ fontFamily: 'var(--font-classyvogue), sans-serif' }}
                >
                  Your Space
                </h1>
                <p className="text-sm text-gray-600">Session active</p>
              </div>
            </div>
            <button
              onClick={leaveSession}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Leave session"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-[12px] p-4">
              <p className="text-center text-green-700 font-medium">
                You've been matched! This is a safe space to connect and share.
              </p>
            </div>

            <div className="border-2 border-black/30 rounded-[12px] p-4 min-h-[300px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Your conversation space is ready</p>
                  <p className="text-sm mt-2">This is where your connection begins</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>• Keep conversations respectful and supportive</p>
              <p>• This is an anonymous space - protect your privacy</p>
              <p>• If you need to leave, you can return to find a new match</p>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

