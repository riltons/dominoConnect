-- Criar enum para status da competição
CREATE TYPE competition_status AS ENUM ('upcoming', 'in_progress', 'completed');

-- Criar tabela de competições
CREATE TABLE public.competitions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone,
    status competition_status DEFAULT 'upcoming',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    created_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver competições das suas comunidades"
    ON public.competitions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.communities c
            WHERE c.id = community_id
            AND (
                c.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.player_communities pc
                    WHERE pc.community_id = c.id
                    AND pc.player_id IN (
                        SELECT p.id FROM public.players p
                        JOIN public.player_communities pc2 ON p.id = pc2.player_id
                        JOIN public.communities c2 ON c2.id = pc2.community_id
                        WHERE c2.created_by = auth.uid()
                    )
                )
            )
        )
    );

CREATE POLICY "Administradores podem criar competições em suas comunidades"
    ON public.competitions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.communities c
            WHERE c.id = community_id
            AND c.created_by = auth.uid()
        )
    );

CREATE POLICY "Administradores podem atualizar competições em suas comunidades"
    ON public.competitions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.communities c
            WHERE c.id = community_id
            AND c.created_by = auth.uid()
        )
    );

CREATE POLICY "Administradores podem deletar competições em suas comunidades"
    ON public.competitions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.communities c
            WHERE c.id = community_id
            AND c.created_by = auth.uid()
        )
    );

-- Criar índices
CREATE INDEX idx_competitions_community_id ON public.competitions(community_id);
CREATE INDEX idx_competitions_status ON public.competitions(status);
CREATE INDEX idx_competitions_start_date ON public.competitions(start_date);
