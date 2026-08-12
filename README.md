# PULSO

**A cidade toca aqui.**

Uma plataforma de descoberta de shows, artistas e casas de show, construída sobre dados reais e atuais — não uma lista de eventos escrita à mão.

![Home do PULSO](docs/screenshots/home-desktop.png)

## O problema

"O que está tocando na minha cidade essa semana?" é uma pergunta surpreendentemente difícil de responder bem. Sites de venda de ingresso são otimizados pra conversão, não pra descoberta; redes sociais são ruído. O PULSO tenta ser o meio do caminho: uma curadoria de shows reais, organizada por cidade, período, gênero e artista, com a sensação de "descoberta musical" em vez de só uma lista.

## A solução

Um app React que consome a **Ticketmaster Discovery API** em tempo real — sem dado inventado, sem JSON mockado — com estados de interface tratados de verdade (carregando, erro, vazio, imagem quebrada) e uma identidade visual própria: urbana, editorial, escura, sem clichês de "app de música" (nada de equalizador, nota musical ou neon cyberpunk genérico).

## Funcionalidades

- **Home**: hero com busca e seletor de cidade, shows em destaque, "acontecendo esta semana", "em alta", navegação por gênero, e locais mais movimentados da semana (derivado dos próprios eventos, sem chamada extra à API).
- **Explorar**: grid de eventos com filtros de cidade, gênero, período e busca livre — os filtros vivem na URL, então o link é compartilhável.
- **Evento**: página de detalhe com artista, imagem, data, local (com link direto pro Google Maps), gênero, descrição, fonte e link oficial de ingresso.
- **Artista**: perfil com imagem, gênero e próximos eventos.
- **Favoritos**: persistidos em `localStorage`, sobrevivem a fechar o navegador; favoritar em qualquer card do app.

## Stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/) — sem TypeScript, JavaScript puro.
- [React Router 7](https://reactrouter.com/) — roteamento client-side.
- CSS puro (custom properties como design tokens, sem framework de CSS).
- [Ticketmaster Discovery API v2](https://developer.ticketmaster.com/) — única fonte de dados.

Sem backend próprio nesta fase — todo o app roda client-side, com um proxy de desenvolvimento (ver abaixo) resolvendo CORS.

## Arquitetura

```
src/
├── pages/        # uma página por rota (Home, Explorar, Evento, Artista, Favoritos)
├── components/    # UI reutilizável entre páginas (EventCard, Skeleton, StateMessage...)
├── services/      # única porta de entrada pra API externa (ticketmaster.js)
├── hooks/         # estado + efeitos reutilizáveis (useEvents, useEvent, useArtist, useFavorites)
├── context/       # estado compartilhado entre componentes distantes (FavoritesContext)
└── utils/         # funções puras (formatação de data, imagem, cidade → coordenadas...)
```

O fluxo de dados é sempre o mesmo, do início ao fim do projeto:

```
componente → hook (useEvents/useEvent/useArtist) → service (ticketmaster.js) → proxy → Ticketmaster
                                ↓
                        estado (loading/success/error) → UI
```

## A API e suas limitações reais

A [Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/) foi escolhida depois de comparar as alternativas com cobertura real pro Brasil (Songkick fechou aplicações novas, Bandsintown e Sympla não têm busca pública de todos os eventos, Eventbrite descontinuou o endpoint de busca). Ela cobre eventos, artistas ("attractions") e locais ("venues") num fluxo só, com plano gratuito de 5.000 chamadas/dia.

Duas limitações reais, descobertas testando com dados de verdade (não documentadas antecipadamente):

- **Sem CORS**: a API não autoriza chamadas diretas do navegador. Resolvido com um proxy no `vite.config.js` que injeta a `apikey` no lado do servidor — ela nunca é exposta ao código que roda no navegador (nem via variável `VITE_*`, que seria visível no bundle).
- **`venue.city` vem vazio pra maioria dos locais brasileiros.** O filtro de busca por cidade (`city=`) depende desse campo e não retornava nada pro Brasil, mesmo com eventos existindo de verdade. A correção foi trocar por busca geográfica (`latlong`+`radius`), já que as coordenadas dos locais vêm preenchidas corretamente — e usar o estado (UF) como texto de local quando a cidade não existe.

## Estados de interface

Loading (skeleton, não spinner), erro (com "tentar de novo"), "não encontrado" (sem retry — não adianta tentar de novo um recurso que não existe), vazio (sem resultado pros filtros aplicados), imagem quebrada (fallback visual da marca, cobrindo tanto "sem imagem" quanto "URL que falhou ao carregar") — tratados em todas as páginas que dependem da API.

## Decisões técnicas

- **Sem Redux/Zustand.** A maior parte do estado é local a cada página (busca de dados isolada por hook). A exceção é `FavoritesContext`: o estado de favoritos precisa ser visto e alterado por vários componentes ao mesmo tempo (o coração de cada card + a página de Favoritos), o que justifica Context — usado só onde o problema realmente pede.
- **Sem biblioteca de animação.** Reveal on scroll (`IntersectionObserver`), fade de imagem e microinteração de favoritar são todos CSS + um hook pequeno, respeitando `prefers-reduced-motion`.
- **Filtros na URL** (`useSearchParams`), não só em estado local — torna o Explorar compartilhável/atualizável sem perder o filtro aplicado.

## Rodando localmente

```bash
npm install
```

Crie um `.env` na raiz (veja `.env.example`) com uma API key gratuita do [Ticketmaster Developer Portal](https://developer.ticketmaster.com/):

```
TICKETMASTER_API_KEY=sua_key_aqui
```

```bash
npm run dev
```

## Screenshots

| Home | Explorar |
|---|---|
| ![Home](docs/screenshots/home-desktop.png) | ![Explorar](docs/screenshots/explorar.png) |

| Evento | Home (mobile) |
|---|---|
| ![Evento](docs/screenshots/evento.png) | ![Home mobile](docs/screenshots/home-mobile.png) |

## Aprendizados

- Dado real quebra suposições que documentação nenhuma avisa — o bug do `venue.city` vazio só apareceu testando com a key de produção, nunca com mock.
- CORS não é sobre validar quem está autenticado; é o navegador protegendo o usuário de scripts de terceiros usando a sessão dele escondido — vale a pena entender a diferença antes de "resolver" com gambiarra.
- Extrair um componente cedo demais é tão custoso quanto tarde demais. Vários componentes deste projeto (`EventRailSection`, `EventImage`) só nasceram depois de eu ver o mesmo bloco de código se repetir, não antes.

## Roadmap

**Fase 2 (próxima):** autenticação e favoritos por usuário via Supabase/PostgreSQL, substituindo o `localStorage`.

**Depois:** seguir artistas, busca por proximidade/geolocalização, mapa, recomendação, integração com calendário, notificações, compartilhamento.

---

Este projeto foi desenvolvido com apoio de ferramentas de IA (Claude), em um processo de pair programming — o código foi majoritariamente implementado por IA sob orientação e revisão constante do autor, que participou de toda decisão de arquitetura, produto e design, e é capaz de explicar o funcionamento de cada parte do sistema.
