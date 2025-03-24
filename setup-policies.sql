-- Setup RLS Policies for Infinity 2025 Database

-- Enable Row Level Security on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Create policies for Events table
-- Anyone can read events
CREATE POLICY "Events are readable by anyone" ON events
  FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete events
CREATE POLICY "Events can be inserted by authenticated users" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Events can be updated by authenticated users" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');
  
CREATE POLICY "Events can be deleted by authenticated users" ON events
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for Registrations table
-- Anyone can insert registrations (for public registration)
CREATE POLICY "Registrations can be inserted by anyone" ON registrations
  FOR INSERT WITH CHECK (true);

-- Registrations are readable by the creator and authenticated users
CREATE POLICY "Registrations can be read by authenticated users" ON registrations
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Registrations can be read by the registrant" ON registrations
  FOR SELECT USING (email = auth.email());

-- Only authenticated users can update/delete registrations
CREATE POLICY "Registrations can be updated by authenticated users" ON registrations
  FOR UPDATE USING (auth.role() = 'authenticated');
  
CREATE POLICY "Registrations can be deleted by authenticated users" ON registrations
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for Payments table
-- Payments can be inserted by anyone (for public registration)
CREATE POLICY "Payments can be inserted by anyone" ON payments
  FOR INSERT WITH CHECK (true);

-- Payments are readable by authenticated users
CREATE POLICY "Payments can be read by authenticated users" ON payments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can update/delete payments
CREATE POLICY "Payments can be updated by authenticated users" ON payments
  FOR UPDATE USING (auth.role() = 'authenticated');
  
CREATE POLICY "Payments can be deleted by authenticated users" ON payments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for Participants table
-- Participants can be inserted by anyone (for public registration)
CREATE POLICY "Participants can be inserted by anyone" ON participants
  FOR INSERT WITH CHECK (true);

-- Participants are readable by authenticated users
CREATE POLICY "Participants can be read by authenticated users" ON participants
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can update/delete participants
CREATE POLICY "Participants can be updated by authenticated users" ON participants
  FOR UPDATE USING (auth.role() = 'authenticated');
  
CREATE POLICY "Participants can be deleted by authenticated users" ON participants
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage policies for payment proofs
CREATE POLICY "Payment proofs can be uploaded by anyone" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'payment_proofs');
  
CREATE POLICY "Payment proofs are readable by anyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'payment_proofs');
