-- Genea Database Schema for Supabase
-- Run this in Supabase SQL Editor to set up the tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  tax_id TEXT,
  credits INTEGER DEFAULT 0,
  is_trial_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Auth codes table for email verification
CREATE TABLE IF NOT EXISTS auth_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email and code for fast lookups
CREATE INDEX IF NOT EXISTS idx_auth_codes_email ON auth_codes(email);
CREATE INDEX IF NOT EXISTS idx_auth_codes_email_code ON auth_codes(email, code);

-- Restorations table
CREATE TABLE IF NOT EXISTS restorations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  restored_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_restorations_user_id ON restorations(user_id);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pix_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  credits INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create index on user_id and pix_id
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_pix_id ON payments(pix_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
-- Note: These are basic policies. Adjust based on your auth strategy.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE restorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for API routes)
CREATE POLICY "Service role has full access to users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to auth_codes"
  ON auth_codes FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to restorations"
  ON restorations FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to payments"
  ON payments FOR ALL
  USING (true)
  WITH CHECK (true);

-- Clean up expired auth codes (run periodically)
-- You can set up a cron job in Supabase to run this
CREATE OR REPLACE FUNCTION cleanup_expired_auth_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM auth_codes
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
