-- Migration: user_display_permissions
-- Per-user granular display layer and content access permissions

CREATE TABLE IF NOT EXISTS public.user_display_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    permissions JSONB NOT NULL DEFAULT '{
        showArabic: true,
        showWordByWord: true,
        showTransliteration: true,
        showConventionalBn: true,
        showConventionalEn: true,
        showModernBn: true,
        showModernEn: true,
        showLexicon: true,
        showLexiconScientific: true,
        showMetaData: true
    }'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT user_display_permissions_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_disp_perms_user_id ON public.user_display_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_disp_perms_email ON public.user_display_permissions(email);

-- Grants
GRANT SELECT ON public.user_display_permissions TO authenticated;
GRANT ALL ON public.user_display_permissions TO service_role;

-- RLS
ALTER TABLE public.user_display_permissions ENABLE ROW LEVEL SECURITY;

-- Users can read their own permissions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_display_permissions' AND policyname = 'user_disp_perms_own_read'
    ) THEN
        CREATE POLICY user_disp_perms_own_read ON public.user_display_permissions
            FOR SELECT TO authenticated
            USING (auth.uid() = user_id OR email = auth.email());
    END IF;
END $$;

-- Admins can view, insert, update and delete all permissions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_display_permissions' AND policyname = 'user_disp_perms_admin_all'
    ) THEN
        CREATE POLICY user_disp_perms_admin_all ON public.user_display_permissions
            FOR ALL TO authenticated
            USING (public.has_role(auth.uid(), 'admin'))
            WITH CHECK (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;
