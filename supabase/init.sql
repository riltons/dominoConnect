-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
  id uuid references auth.users on delete cascade,
  email text unique,
  phone text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id),
  constraint phone_format check (phone ~ '^\+?[1-9]\d{1,14}$')
);

-- Communities table
create table public.communities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_by uuid references public.users not null,
  whatsapp_group_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Players table
create table public.players (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null unique,
  invited_by uuid references public.players,
  user_id uuid references public.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint phone_format check (phone ~ '^\+?[1-9]\d{1,14}$')
);

-- Community Players table
create table public.community_players (
  community_id uuid references public.communities on delete cascade,
  player_id uuid references public.players on delete cascade,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (community_id, player_id)
);

-- Events table
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities on delete cascade,
  name text not null,
  description text,
  date timestamp with time zone not null,
  location text,
  created_by uuid references public.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Games table
create table public.games (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events on delete cascade,
  team1_player1 uuid references public.players,
  team1_player2 uuid references public.players,
  team2_player1 uuid references public.players,
  team2_player2 uuid references public.players,
  team1_score integer default 0,
  team2_score integer default 0,
  winner_team integer check (winner_team in (1, 2)),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Game Points table
create table public.game_points (
  id uuid default uuid_generate_v4() primary key,
  game_id uuid references public.games on delete cascade,
  team integer check (team in (1, 2)) not null,
  point_type text check (point_type in ('simple', 'carroca', 'la_e_lo', 'cruzada')) not null,
  points integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Event Confirmations table
create table public.event_confirmations (
  event_id uuid references public.events on delete cascade,
  player_id uuid references public.players on delete cascade,
  status text check (status in ('confirmed', 'declined', 'maybe')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (event_id, player_id)
);

-- Functions
create or replace function update_game_score()
returns trigger as $$
begin
  update public.games
  set team1_score = (
    select coalesce(sum(points), 0)
    from public.game_points
    where game_id = new.game_id and team = 1
  ),
  team2_score = (
    select coalesce(sum(points), 0)
    from public.game_points
    where game_id = new.game_id and team = 2
  )
  where id = new.game_id;
  
  return new;
end;
$$ language plpgsql security definer;

create or replace function check_game_winner()
returns trigger as $$
begin
  if new.team1_score >= 6 then
    update public.games set winner_team = 1 where id = new.id;
  elsif new.team2_score >= 6 then
    update public.games set winner_team = 2 where id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Triggers
create trigger on_game_point_change
after insert or update or delete on public.game_points
for each row execute function update_game_score();

create trigger on_score_update
after update of team1_score, team2_score on public.games
for each row execute function check_game_winner();

-- Indexes
create index idx_community_players_community on public.community_players(community_id);
create index idx_community_players_player on public.community_players(player_id);
create index idx_events_community on public.events(community_id);
create index idx_games_event on public.games(event_id);
create index idx_game_points_game on public.game_points(game_id);
create index idx_event_confirmations_event on public.event_confirmations(event_id);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.communities enable row level security;
alter table public.players enable row level security;
alter table public.community_players enable row level security;
alter table public.events enable row level security;
alter table public.games enable row level security;
alter table public.game_points enable row level security;
alter table public.event_confirmations enable row level security;

-- RLS Policies

-- Users policies
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- Communities policies
create policy "Anyone can view communities" on public.communities
  for select using (true);

create policy "Authenticated users can create communities" on public.communities
  for insert with check (auth.role() = 'authenticated');

create policy "Only creator can update community" on public.communities
  for update using (auth.uid() = created_by);

-- Players policies
create policy "Anyone can view players" on public.players
  for select using (true);

create policy "Authenticated users can create players" on public.players
  for insert with check (auth.role() = 'authenticated');

-- Community Players policies
create policy "Anyone can view community players" on public.community_players
  for select using (true);

create policy "Community creators can manage players" on public.community_players
  for all using (
    exists (
      select 1 from public.communities
      where id = community_players.community_id
      and created_by = auth.uid()
    )
  );

-- Events policies
create policy "Anyone can view events" on public.events
  for select using (true);

create policy "Community members can create events" on public.events
  for insert with check (
    exists (
      select 1 from public.community_players cp
      join public.players p on p.id = cp.player_id
      where cp.community_id = events.community_id
      and p.user_id = auth.uid()
    )
  );

-- Games policies
create policy "Anyone can view games" on public.games
  for select using (true);

create policy "Event participants can manage games" on public.games
  for all using (
    exists (
      select 1 from public.events e
      join public.community_players cp on cp.community_id = e.community_id
      join public.players p on p.id = cp.player_id
      where e.id = games.event_id
      and p.user_id = auth.uid()
    )
  );

-- Game Points policies
create policy "Anyone can view game points" on public.game_points
  for select using (true);

create policy "Game participants can manage points" on public.game_points
  for all using (
    exists (
      select 1 from public.games g
      join public.events e on e.id = g.event_id
      join public.community_players cp on cp.community_id = e.community_id
      join public.players p on p.id = cp.player_id
      where g.id = game_points.game_id
      and p.user_id = auth.uid()
    )
  );

-- Event Confirmations policies
create policy "Anyone can view confirmations" on public.event_confirmations
  for select using (true);

create policy "Players can manage their confirmations" on public.event_confirmations
  for all using (
    exists (
      select 1 from public.players
      where id = event_confirmations.player_id
      and user_id = auth.uid()
    )
  );
