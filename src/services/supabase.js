import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/**
 * Cliente único do Supabase, compartilhado pelo app inteiro. Ele fala
 * direto com o Supabase pelo navegador (sem proxy, diferente da
 * Ticketmaster) — a API do Supabase já autoriza CORS, e a proteção
 * dos dados vem do Row Level Security no Postgres, não de esconder
 * essa key.
 */
export const supabase = createClient(supabaseUrl, supabaseKey)
