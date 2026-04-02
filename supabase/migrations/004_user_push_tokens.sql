-- Create user_push_tokens table for FCM
CREATE TABLE IF NOT EXISTS public.user_push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    device_type TEXT, -- 'ios', 'android', 'web'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, token)
);

-- Enable RLS
ALTER TABLE public.user_push_tokens ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can insert their own tokens"
ON public.user_push_tokens FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own tokens"
ON public.user_push_tokens FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own tokens"
ON public.user_push_tokens FOR DELETE
USING (auth.uid()::text = user_id);

-- Gán quyền cho authenticated users
GRANT ALL ON public.user_push_tokens TO authenticated;
GRANT ALL ON public.user_push_tokens TO service_role;
