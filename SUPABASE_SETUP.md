# Supabase Database Setup for Space Matching System

This document explains how to set up the Supabase database for the space matching system.

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Get your project URL and anon key from Settings > API

## Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Tables

Run these SQL commands in your Supabase SQL Editor:

### 1. Match Queue Table

```sql
-- Create match_queue table
CREATE TABLE match_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'matched')),
  matched_with TEXT,
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_match_queue_status ON match_queue(status);
CREATE INDEX idx_match_queue_user_id ON match_queue(user_id);
CREATE INDEX idx_match_queue_session_id ON match_queue(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE match_queue ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on match_queue"
ON match_queue
FOR ALL
USING (true)
WITH CHECK (true);
```

### 2. Match Sessions Table

```sql
-- Create match_sessions table
CREATE TABLE match_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id TEXT NOT NULL,
  user2_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_match_sessions_status ON match_sessions(status);
CREATE INDEX idx_match_sessions_user1 ON match_sessions(user1_id);
CREATE INDEX idx_match_sessions_user2 ON match_sessions(user2_id);

-- Enable Row Level Security (RLS)
ALTER TABLE match_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on match_sessions"
ON match_sessions
FOR ALL
USING (true)
WITH CHECK (true);
```

### 3. Function to Auto-Update updated_at

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for match_queue
CREATE TRIGGER update_match_queue_updated_at
    BEFORE UPDATE ON match_queue
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for match_sessions
CREATE TRIGGER update_match_sessions_updated_at
    BEFORE UPDATE ON match_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 4. Online Users Table (for Radar Page)

```sql
-- Create online_users table
CREATE TABLE online_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'ready', 'away')),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_online_users_status ON online_users(status);
CREATE INDEX idx_online_users_user_id ON online_users(user_id);
CREATE INDEX idx_online_users_last_seen ON online_users(last_seen);

-- Enable Row Level Security (RLS)
ALTER TABLE online_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on online_users"
ON online_users
FOR ALL
USING (true)
WITH CHECK (true);
```

### 5. Connections Table (for CRM Page)

```sql
-- Create connections table
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id TEXT NOT NULL,
  user2_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  last_connected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_connections_user1 ON connections(user1_id);
CREATE INDEX idx_connections_user2 ON connections(user2_id);
CREATE INDEX idx_connections_status ON connections(status);
CREATE INDEX idx_connections_last_connected ON connections(last_connected);
CREATE INDEX idx_connections_favorite ON connections(is_favorite) WHERE is_favorite = TRUE;

-- Enable Row Level Security (RLS)
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on connections"
ON connections
FOR ALL
USING (true)
WITH CHECK (true);
```

### 6. Update Triggers for New Tables

```sql
-- Trigger for connections updated_at
CREATE TRIGGER update_connections_updated_at
    BEFORE UPDATE ON connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 7. Enable Realtime (Required for Radar Page)

```sql
-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE match_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE match_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE online_users;
ALTER PUBLICATION supabase_realtime ADD TABLE connections;
```

## Testing the Setup

1. After running the SQL commands, verify tables exist:
   ```sql
   SELECT * FROM match_queue;
   SELECT * FROM match_sessions;
   SELECT * FROM online_users;
   SELECT * FROM connections;
   ```

2. Test inserting an online user:
   ```sql
   INSERT INTO online_users (user_id, name, status)
   VALUES ('test_user_123', 'Test User', 'ready');
   ```

3. Test creating a connection:
   ```sql
   INSERT INTO connections (user1_id, user2_id, status)
   VALUES ('user1', 'user2', 'active');
   ```

4. Check Realtime is working by watching for changes in the Supabase dashboard.

## Security Considerations

1. **Row Level Security (RLS)**: The current policies allow all operations. For production:
   - Restrict INSERT to authenticated users
   - Only allow users to see their own queue entries
   - Only allow users in a session to see that session

2. **Rate Limiting**: Consider adding rate limiting to prevent abuse

3. **Session Expiry**: Consider adding automatic session expiry after inactivity

## Troubleshooting

- **Realtime not working**: Make sure you've enabled Realtime for the tables
- **RLS blocking queries**: Check your RLS policies match your use case
- **Missing indexes**: If queries are slow, ensure indexes are created

## Next Steps

1. Set up environment variables
2. Run the SQL migrations
3. Test the matching flow
4. Customize RLS policies for your security needs

