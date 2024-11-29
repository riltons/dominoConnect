-- Criar a tabela players
CREATE TABLE public.players (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    nickname text,
    phone text NOT NULL,
    games_played integer DEFAULT 0,
    games_won integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Adicionar políticas de segurança para players
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jogadores são visíveis para todos os usuários autenticados"
    ON public.players
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem criar jogadores"
    ON public.players
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar jogadores vinculados às suas comunidades"
    ON public.players
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.player_communities pc
            JOIN public.communities c ON c.id = pc.community_id
            WHERE pc.player_id = players.id
            AND c.created_by = auth.uid()
        )
    );

-- Criar a tabela de relacionamento entre jogadores e comunidades
CREATE TABLE public.player_communities (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(player_id, community_id)
);

-- Adicionar políticas de segurança para player_communities
ALTER TABLE public.player_communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver jogadores de suas comunidades"
    ON public.player_communities
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.communities c
            WHERE c.id = community_id
            AND c.created_by = auth.uid()
        )
    );

CREATE POLICY "Usuários podem adicionar jogadores às suas comunidades"
    ON public.player_communities
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.communities c
            WHERE c.id = community_id
            AND c.created_by = auth.uid()
        )
    );

CREATE POLICY "Usuários podem remover jogadores de suas comunidades"
    ON public.player_communities
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.communities c
            WHERE c.id = community_id
            AND c.created_by = auth.uid()
        )
    );

-- Criar índices para melhor performance
CREATE INDEX idx_player_communities_player_id ON public.player_communities(player_id);
CREATE INDEX idx_player_communities_community_id ON public.player_communities(community_id);
