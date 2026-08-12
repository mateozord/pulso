import { createContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // `user` = null enquanto ainda não sabemos (carregando a sessão) ou
  // undefined seria ambíguo com "sabemos que não tem ninguém logado".
  // Por isso `status` existe separado: 'loading' | 'ready'.
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    // getSession() lê a sessão salva pelo próprio supabase-js (ele
    // guarda o token no localStorage sozinho, sem eu escrever nada
    // disso) — é o que faz o usuário continuar logado após um F5.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setStatus('ready')
    })

    // onAuthStateChange dispara sempre que login/logout/expiração de
    // sessão acontece em qualquer lugar do app — um único listener
    // aqui mantém `user` sincronizado sem cada componente precisar
    // perguntar ao Supabase individualmente.
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  async function signUp(email, password, nickname) {
    // `options.data` vira `user_metadata` — um jeito de guardar campos
    // extras do perfil sem precisar criar uma tabela nova só pra isso.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    })
    if (error) throw error
    // Se "Confirm email" estiver desligado no projeto, o Supabase já
    // devolve uma sessão válida aqui — a pessoa nasce logada, sem
    // precisar de link nenhum. Devolvemos isso pra quem chamou decidir
    // o que mostrar (tela de "confira seu e-mail" ou ir direto pro app).
    return { session: data.session }
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = { user, status, signUp, signIn, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
