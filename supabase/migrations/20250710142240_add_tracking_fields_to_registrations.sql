-- Add tracking fields to registrations table
ALTER TABLE registrations
ADD COLUMN updated_by UUID REFERENCES auth.users(id),
ADD COLUMN payment_updated_at TIMESTAMPTZ,
ADD COLUMN payment_updated_by UUID REFERENCES auth.users(id);

-- Add comments for the new fields
COMMENT ON COLUMN registrations.updated_by IS 'User ID who last updated the registration';
COMMENT ON COLUMN registrations.payment_updated_at IS 'Timestamp when the payment amount was last updated';
COMMENT ON COLUMN registrations.payment_updated_by IS 'User ID who last updated the payment amount';

-- Create function to automatically update payment tracking fields when amount_paid changes
CREATE OR REPLACE FUNCTION update_payment_tracking()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update payment tracking if amount_paid has actually changed
    IF OLD.amount_paid IS DISTINCT FROM NEW.amount_paid THEN
        NEW.payment_updated_at = NOW();
        -- Set payment_updated_by to the current user if available, otherwise keep existing value
        IF auth.uid() IS NOT NULL THEN
            NEW.payment_updated_by = auth.uid();
        END IF;
    END IF;
    
    -- Always update updated_by when any field changes
    IF auth.uid() IS NOT NULL THEN
        NEW.updated_by = auth.uid();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update tracking fields
CREATE TRIGGER update_registration_tracking
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_tracking();