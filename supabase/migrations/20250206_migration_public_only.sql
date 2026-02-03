-- Create the public schema (if not exists)
CREATE SCHEMA IF NOT EXISTS public;

-- Function to automatically update updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create necessary tables inside the public schema

CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID DEFAULT gen_random_uuid() UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES public.users (user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.companies (
    id BIGSERIAL PRIMARY KEY,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ,
    owner_id UUID,
    logo_url TEXT,
    legal_name TEXT,
    tax_id TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    street_address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT,
    primary_color TEXT,
    accent_color TEXT,
    invoice_prefix TEXT,
    invoice_footer TEXT,
    payment_terms TEXT,
    account_name TEXT,
    bank_name TEXT,
    account_number TEXT,
    routing_number TEXT,
    swift_code TEXT
);

CREATE TABLE IF NOT EXISTS public.clients (
    id BIGSERIAL PRIMARY KEY,
    company VARCHAR(255),
    email_address VARCHAR(320) NOT NULL,
    phone_number VARCHAR(15),
    address VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ,
    image_path VARCHAR(500),
    company_id BIGINT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    CONSTRAINT fk_clients_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    stripe_price_id VARCHAR(100) NOT NULL,
    description TEXT,
    features JSONB,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    "interval" VARCHAR(20) DEFAULT 'month' NOT NULL,
    trial_days INTEGER DEFAULT 14,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    plan_id UUID,
    status VARCHAR(20) NOT NULL,
    stripe_customer_id VARCHAR(100),
    stripe_subscription_id VARCHAR(100),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMPTZ,
    amount NUMERIC(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_subscriptions_plan FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.subscription_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id UUID NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    limits JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subscription_features FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.subscription_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id UUID NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    usage_count INTEGER DEFAULT 0,
    usage_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subscription_usage FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date TIMESTAMP DEFAULT now() NOT NULL,
    due_date TIMESTAMP NOT NULL,
    items JSONB NOT NULL,
    subtotal DOUBLE PRECISION NOT NULL,
    tax_rate TEXT NOT NULL,
    tax_amount DOUBLE PRECISION NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value DOUBLE PRECISION NOT NULL,
    discount_amount DOUBLE PRECISION NOT NULL,
    total DOUBLE PRECISION NOT NULL,
    notes TEXT,
    terms TEXT,
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    company_id BIGINT,
    created_by UUID,
    client_id BIGINT,
    service_id BIGINT,
    CONSTRAINT fk_quotes_company FOREIGN KEY (company_id) REFERENCES public.companies (id) ON DELETE SET NULL,
    CONSTRAINT fk_quotes_created_by FOREIGN KEY (created_by) REFERENCES public.users (user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.services (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ,
    type TEXT,
    category TEXT,
    name TEXT,
    sku TEXT,
    price DOUBLE PRECISION,
    unit TEXT,
    short_desc TEXT,
    detailed_desc TEXT,
    image_path TEXT,
    created_by UUID DEFAULT auth.uid(),
    company_id BIGINT,
    sub_frequency TEXT,
    sub_details TEXT,
    tags JSONB,
    CONSTRAINT services_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.service_categories (
    id BIGSERIAL PRIMARY KEY,
    title TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.service_types (
    id BIGSERIAL PRIMARY KEY,
    title TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.statuses (
    id BIGSERIAL PRIMARY KEY,
    module TEXT,
    title TEXT,
    description TEXT
);

-- Add necessary indexes
CREATE INDEX IF NOT EXISTS idx_quotes_company_id ON public.quotes (company_id);
CREATE INDEX IF NOT EXISTS idx_quotes_created_by ON public.quotes (created_by);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_subscription_id ON public.subscription_usage (subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_date ON public.subscription_usage (usage_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_services_company_id ON public.services (company_id);

-- Triggers to automatically update updated_at column
CREATE TRIGGER update_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscription_features_updated_at BEFORE UPDATE ON public.subscription_features FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscription_usage_updated_at BEFORE UPDATE ON public.subscription_usage FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their subscription features"
    ON public.subscription_features
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((subscription_id IN (SELECT subscriptions.id FROM subscriptions WHERE subscriptions.user_id = auth.uid())));

CREATE POLICY "Users can view their subscription usage"
    ON public.subscription_usage
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((EXISTS (SELECT 1 FROM subscriptions WHERE subscriptions.id = subscription_usage.subscription_id AND subscriptions.user_id = auth.uid())));

CREATE POLICY "Users can update own profile"
    ON public.profiles
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((auth.uid() = id));

-- Create logs table
CREATE TABLE IF NOT EXISTS public.logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    level VARCHAR(10),            -- INFO, WARN, ERROR
    message TEXT,                 -- Log message
    user_id UUID,                 -- ID of the user associated with the log
    entity VARCHAR(50),           -- Entity type (e.g., Company, Order, User)
    entity_id UUID,               -- ID of the specific entity
    source VARCHAR(50),           -- Source of the log (e.g., API, Frontend, Background Job)
    meta JSONB,                   -- Additional metadata (e.g., page, action)
    FOREIGN KEY (user_id) REFERENCES public.users (user_id) ON DELETE SET NULL
);
