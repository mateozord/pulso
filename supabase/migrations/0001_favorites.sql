-- Tabela de favoritos por usuário. `event_data` guarda o objeto do
-- evento como a Ticketmaster devolve (mesma ideia do que já vivia no
-- localStorage) — assim a página de Favoritos não precisa buscar cada
-- evento de novo na API, só ler o que já foi salvo.
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id text not null,
  event_data jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

-- Sem RLS, qualquer pessoa com a publishable key (ou seja, qualquer
-- visitante do site) conseguiria ler ou escrever a tabela inteira.
-- RLS liga a "porta trancada por padrão": nada passa até uma policy
-- explicitamente permitir.
alter table public.favorites enable row level security;

-- auth.uid() é o id do usuário dono do token JWT que fez a
-- requisição (o supabase-js já manda esse token sozinho, a cada
-- chamada, uma vez que o usuário está logado).
create policy "Usuários leem só os próprios favoritos"
on public.favorites for select
using (auth.uid() = user_id);

create policy "Usuários criam favoritos só pra si mesmos"
on public.favorites for insert
with check (auth.uid() = user_id);

create policy "Usuários removem só os próprios favoritos"
on public.favorites for delete
using (auth.uid() = user_id);
