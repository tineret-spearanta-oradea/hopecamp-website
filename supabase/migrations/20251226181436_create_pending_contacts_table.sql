-- Create pending_contacts table for capturing failed OTP registration attempts
-- These are users who tried to register but OTP sending failed, allowing admins to follow up manually

CREATE TABLE pending_contacts (
    id SERIAL PRIMARY KEY,

    -- Contact Information
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,

    -- Form data stored as JSON for flexibility
    form_data JSONB NOT NULL DEFAULT '{}',

    -- Status tracking
    status VARCHAR(20) NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'contacted', 'resolved', 'abandoned')),

    -- Admin interaction
    admin_notes TEXT DEFAULT '',
    contact_history JSONB DEFAULT '[]',

    -- Reference to existing user (if phone matches an existing auth user)
    existing_user_id UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL,

    -- Edition reference
    edition_id INT NOT NULL REFERENCES editions(id) ON DELETE CASCADE,

    -- Resolution tracking
    resolved_by UUID REFERENCES user_profiles(user_id),
    resolved_at TIMESTAMPTZ,
    resolved_registration_id INT REFERENCES registrations(id),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_contacted_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_pending_contacts_phone ON pending_contacts(phone);
CREATE INDEX idx_pending_contacts_status ON pending_contacts(status);
CREATE INDEX idx_pending_contacts_edition_id ON pending_contacts(edition_id);
CREATE INDEX idx_pending_contacts_created_at ON pending_contacts(created_at DESC);

-- Unique constraint to prevent duplicate pending contacts for same phone + edition
CREATE UNIQUE INDEX idx_pending_contacts_phone_edition ON pending_contacts(phone, edition_id)
    WHERE status IN ('new', 'contacted');

-- Enable RLS
ALTER TABLE pending_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Admins can view pending contacts
CREATE POLICY "Admins can view pending contacts" ON pending_contacts
    FOR SELECT TO authenticated
    USING (public.is_admin(auth.uid()));

-- Admins can update pending contacts
CREATE POLICY "Admins can update pending contacts" ON pending_contacts
    FOR UPDATE TO authenticated
    USING (public.is_admin(auth.uid()));

-- Admins can delete pending contacts
CREATE POLICY "Admins can delete pending contacts" ON pending_contacts
    FOR DELETE TO authenticated
    USING (public.is_admin(auth.uid()));

-- Anyone can create pending contacts (for failed OTP flow - user is not authenticated)
CREATE POLICY "Anyone can create pending contacts" ON pending_contacts
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pending_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic updated_at
CREATE TRIGGER trigger_pending_contacts_updated_at
    BEFORE UPDATE ON pending_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_pending_contacts_updated_at();

-- Comment on table
COMMENT ON TABLE pending_contacts IS 'Stores registration attempts where OTP sending failed, for admin follow-up';
COMMENT ON COLUMN pending_contacts.form_data IS 'JSON containing: age, gender, church, churchOther, churchContact, transport, payTaxTo, preferences, startDate, endDate, imageUrl';
COMMENT ON COLUMN pending_contacts.contact_history IS 'JSON array of {timestamp, adminId, adminName, action, note} entries';
