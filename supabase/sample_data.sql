-- Sample data for Labor Grid testing

-- Insert sample service categories
INSERT INTO public.service_categories (title, description) VALUES
('Landscaping', 'Outdoor landscaping and garden maintenance'),
('Construction', 'Building and renovation services'),
('Cleaning', 'Professional cleaning services'),
('Electrical', 'Electrical installation and maintenance'),
('Plumbing', 'Plumbing services and repairs');

-- Insert sample service types
INSERT INTO public.service_types (title, description) VALUES
('One-time Service', 'Single service call'),
('Recurring Service', 'Regular maintenance contract'),
('Consultation', 'Professional consultation service'),
('Emergency', 'Emergency service call');

-- Insert sample statuses
INSERT INTO public.statuses (module, title, description) VALUES
('quotes', 'Draft', 'Quote is being prepared'),
('quotes', 'Sent', 'Quote has been sent to client'),
('quotes', 'Accepted', 'Client has accepted the quote'),
('quotes', 'Rejected', 'Client has rejected the quote'),
('quotes', 'Expired', 'Quote has expired');

-- Insert sample subscription plans
INSERT INTO public.subscription_plans (name, stripe_price_id, description, features, amount, currency, "interval", trial_days, is_active) VALUES
('Starter', 'price_starter', 'Perfect for small businesses', '{"max_clients": 10, "max_quotes": 50, "features": ["basic_reporting", "email_support"]}', 29.00, 'USD', 'month', 14, true),
('Professional', 'price_pro', 'For growing businesses', '{"max_clients": 100, "max_quotes": 500, "features": ["advanced_reporting", "priority_support", "custom_branding"]}', 79.00, 'USD', 'month', 14, true),
('Enterprise', 'price_enterprise', 'For large companies', '{"max_clients": -1, "max_quotes": -1, "features": ["all_features", "dedicated_support", "api_access"]}', 199.00, 'USD', 'month', 30, true);

-- Insert sample services
INSERT INTO public.services (type, category, name, sku, price, unit, short_desc, detailed_desc, sub_frequency, sub_details, tags) VALUES
('One-time Service', 'Landscaping', 'Lawn Mowing', 'LAWN-001', 50.00, 'hour', 'Professional lawn mowing service', 'Complete lawn mowing service including edging and cleanup', null, null, '{"tags": ["outdoor", "maintenance", "regular"]}'),
('One-time Service', 'Landscaping', 'Garden Design', 'GARDEN-001', 500.00, 'project', 'Custom garden design and planning', 'Complete garden design service including layout planning and plant selection', null, null, '{"tags": ["design", "planning", "consultation"]}'),
('Recurring Service', 'Cleaning', 'Office Cleaning', 'CLEAN-001', 150.00, 'visit', 'Regular office cleaning service', 'Professional office cleaning service available weekly or bi-weekly', 'weekly', 'Comprehensive cleaning including dusting, vacuuming, sanitizing', '{"tags": ["commercial", "recurring", "maintenance"]}'),
('Emergency', 'Plumbing', 'Emergency Plumbing', 'PLUMB-001', 200.00, 'call', '24/7 emergency plumbing service', 'Emergency plumbing services available 24/7 for urgent repairs', null, null, '{"tags": ["emergency", "24/7", "urgent"]}'),
('One-time Service', 'Electrical', 'Electrical Installation', 'ELEC-001', 100.00, 'hour', 'Professional electrical installation', 'Installation of electrical fixtures, outlets, and wiring', null, null, '{"tags": ["installation", "professional", "licensed"]}');

-- Note: Company and client records should be created through the application UI
-- as they require proper user authentication and company setup
