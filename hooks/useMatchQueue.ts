'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, type MatchQueueEntry } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export type MatchStatus = 'idle' | 'joining' | 'waiting' | 'matched' | 'error';

interface UseMatchQueueReturn {
  status: MatchStatus;
  error: string | null;
  matchData: MatchQueueEntry | null;
  joinQueue: () => Promise<void>;
  leaveQueue: () => Promise<void>;
  sessionId: string | null;
}

export function useMatchQueue(): UseMatchQueueReturn {
  const [status, setStatus] = useState<MatchStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<MatchQueueEntry | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();

  // Generate or get user ID from localStorage
  const getUserId = useCallback(() => {
    if (typeof window === 'undefined') return '';
    
    let userId = localStorage.getItem('samepinchh_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('samepinchh_user_id', userId);
    }
    return userId;
  }, []);

  // Request notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Show browser notification
  const showNotification = useCallback((title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/Samepinch-Icon-V1.png',
          badge: '/Samepinch-Icon-V1.png',
        });
      }
    }
  }, []);

  // Subscribe to queue changes
  useEffect(() => {
    if (status !== 'waiting' && status !== 'matched') return;

    const userId = getUserId();
    if (!userId) return;

    const channel = supabase
      .channel('match-queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'match_queue',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const entry = payload.new as MatchQueueEntry;
          
          if (entry.status === 'matched' && entry.session_id) {
            setStatus('matched');
            setMatchData(entry);
            setSessionId(entry.session_id);
            
            // Show notification
            showNotification('Match Found!', 'You have been matched with someone. Redirecting...');
            
            // Small delay before redirect to show the matched status
            setTimeout(() => {
              router.push(`/spaces/session/${entry.session_id}`);
            }, 1500);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [status, getUserId, router, showNotification]);

  // Check for existing match attempts (auto-match logic runs on server)
  useEffect(() => {
    const checkExistingMatch = async () => {
      if (status !== 'waiting') return;

      const userId = getUserId();
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('match_queue')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setMatchData(data);
          if (data.status === 'matched' && data.session_id) {
            setStatus('matched');
            setSessionId(data.session_id);
            showNotification('Match Found!', 'You have been matched with someone. Redirecting...');
            setTimeout(() => {
              router.push(`/spaces/session/${data.session_id}`);
            }, 1500);
          }
        }
      } catch (err: any) {
        console.error('Error checking match:', err);
      }
    };

    const interval = setInterval(checkExistingMatch, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, [status, getUserId, router, showNotification]);

  const joinQueue = useCallback(async () => {
    try {
      setStatus('joining');
      setError(null);

      const userId = getUserId();
      if (!userId) {
        throw new Error('Unable to generate user ID');
      }

      // Check if already in queue
      const { data: existing } = await supabase
        .from('match_queue')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'waiting')
        .single();

      if (existing) {
        setStatus('waiting');
        setMatchData(existing);
        return;
      }

      // Insert into queue
      const { data, error } = await supabase
        .from('match_queue')
        .insert({
          user_id: userId,
          status: 'waiting',
        })
        .select()
        .single();

      if (error) throw error;

      setMatchData(data);
      setStatus('waiting');

      // Try to find a match immediately
      await findMatch(userId);
    } catch (err: any) {
      console.error('Error joining queue:', err);
      setError(err.message || 'Failed to join queue');
      setStatus('error');
    }
  }, [getUserId]);

  const findMatch = useCallback(async (userId: string) => {
    try {
      // Find another waiting user
      const { data: waitingUsers, error } = await supabase
        .from('match_queue')
        .select('*')
        .eq('status', 'waiting')
        .neq('user_id', userId)
        .limit(1);

      if (error) throw error;

      if (waitingUsers && waitingUsers.length > 0) {
        const otherUser = waitingUsers[0];
        
        // Create a session
        const { data: session, error: sessionError } = await supabase
          .from('match_sessions')
          .insert({
            user1_id: userId,
            user2_id: otherUser.user_id,
            status: 'active',
          })
          .select()
          .single();

        if (sessionError) throw sessionError;

        // Update both users' queue entries
        await supabase
          .from('match_queue')
          .update({
            status: 'matched',
            matched_with: otherUser.user_id,
            session_id: session.id,
          })
          .eq('user_id', userId);

        await supabase
          .from('match_queue')
          .update({
            status: 'matched',
            matched_with: userId,
            session_id: session.id,
          })
          .eq('user_id', otherUser.user_id);

        setSessionId(session.id);
        setStatus('matched');
        showNotification('Match Found!', 'You have been matched with someone. Redirecting...');
        
        setTimeout(() => {
          router.push(`/spaces/session/${session.id}`);
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error finding match:', err);
      // Don't set error status here, just keep waiting
    }
  }, [router, showNotification]);

  const leaveQueue = useCallback(async () => {
    try {
      const userId = getUserId();
      if (!userId) return;

      await supabase
        .from('match_queue')
        .delete()
        .eq('user_id', userId)
        .eq('status', 'waiting');

      setStatus('idle');
      setMatchData(null);
      setSessionId(null);
      setError(null);
    } catch (err: any) {
      console.error('Error leaving queue:', err);
      setError(err.message || 'Failed to leave queue');
    }
  }, [getUserId]);

  return {
    status,
    error,
    matchData,
    joinQueue,
    leaveQueue,
    sessionId,
  };
}


