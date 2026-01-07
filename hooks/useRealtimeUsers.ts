'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, type User } from '@/lib/supabase';

interface UseRealtimeUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useRealtimeUsers(status: string = 'online'): UseRealtimeUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('status', status)
        .order('last_ping', { ascending: false });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    // Initial fetch
    fetchUsers();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`users-status-${status}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `status=eq.${status}`,
        },
        () => {
          // Refetch when any change occurs
          fetchUsers();
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [status, fetchUsers]);

  return {
    users,
    loading,
    error,
    refresh: fetchUsers,
  };
}

