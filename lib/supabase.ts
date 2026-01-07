import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types
export interface MatchQueueEntry {
  id: string;
  user_id: string;
  status: 'waiting' | 'matched';
  matched_with: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchSession {
  id: string;
  user1_id: string;
  user2_id: string;
  status: 'active' | 'ended';
  created_at: string;
  updated_at: string;
}

// Users table (existing schema)
export interface User {
  id: string;
  name: string;
  avatar_url: string | null;
  status: string; // 'online', 'offline', etc.
  last_ping: string;
}

// Connections table (existing schema)
export interface Connection {
  id: string;
  user_id: string; // UUID reference to users(id)
  connected_user_id: string; // UUID reference to users(id)
  connected_at: string;
  notes: string | null;
  // Enriched fields (from JOIN)
  connected_user_name?: string;
  connected_user_avatar?: string | null;
}

