'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ColorBlobs from '@/components/ColorBlobs';
import ConnectionCard from '@/components/ConnectionCard';
import { supabase, type Connection } from '@/lib/supabase';
import { Search, Filter, Clock, Users } from 'lucide-react';

type FilterType = 'all' | 'recent';

export default function ConnectionsPage() {
  const router = useRouter();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const userId = localStorage.getItem('samepinchh_user_id');
    if (userId) {
      setCurrentUserId(userId);
      fetchConnections(userId);
    }
  }, []);

  const fetchConnections = async (userId: string) => {
    try {
      setLoading(true);
      
      // Fetch connections where user is user_id (user initiated the connection)
      const { data, error } = await supabase
        .from('connections')
        .select(`
          *,
          connected_user:users!connections_connected_user_id_fkey (
            name,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .order('connected_at', { ascending: false });

      if (error) throw error;

      // Enrich connections with user data
      const enrichedConnections: Connection[] = (data || []).map((conn: any) => ({
        ...conn,
        connected_user_name: conn.connected_user?.name || 'Anonymous',
        connected_user_avatar: conn.connected_user?.avatar_url || null,
      }));

      setConnections(enrichedConnections);
    } catch (err) {
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search
  useEffect(() => {
    let filtered = [...connections];

    // Apply filter
    if (filter === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(
        (conn) => new Date(conn.connected_at) >= sevenDaysAgo
      );
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (conn) =>
          (conn.connected_user_name || 'Anonymous').toLowerCase().includes(query) ||
          (conn.notes || '').toLowerCase().includes(query)
      );
    }

    setFilteredConnections(filtered);
  }, [connections, filter, searchQuery]);

  const handleUpdateNotes = async (connectionId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ notes })
        .eq('id', connectionId);

      if (error) throw error;

      // Update local state
      setConnections((prev) =>
        prev.map((conn) =>
          conn.id === connectionId ? { ...conn, notes } : conn
        )
      );
    } catch (err) {
      console.error('Error updating notes:', err);
      throw err;
    }
  };

  const handleCardClick = (connection: Connection) => {
    router.push(`/spaces/session/${connection.id}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <ColorBlobs />
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading connections...</p>
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
      
      <section className="relative px-6 py-12 md:py-20 max-w-6xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users size={32} />
            <h1 
              className="text-4xl md:text-5xl font-black tracking-wide"
              style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif" }}
            >
              Connections
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Your connection history and notes
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="frosted-glass rounded-[16px] p-4 md:p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-[12px] font-semibold transition-all flex items-center gap-2 ${
                  filter === 'all'
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Filter size={16} />
                All
              </button>
              <button
                onClick={() => setFilter('recent')}
                className={`px-4 py-2 rounded-[12px] font-semibold transition-all flex items-center gap-2 ${
                  filter === 'recent'
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Clock size={16} />
                Recent
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredConnections.length} {filteredConnections.length === 1 ? 'connection' : 'connections'}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </motion.div>

        {/* Connections Grid/List */}
        {filteredConnections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg mb-2">No connections found</p>
            <p className="text-gray-500 text-sm">
              {searchQuery || filter !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Start connecting with people on the Radar page'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredConnections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ConnectionCard
                  connection={connection}
                  onUpdateNotes={handleUpdateNotes}
                  onClick={() => handleCardClick(connection)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
