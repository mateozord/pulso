import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePageTitle } from '../hooks/usePageTitle'
import './Login.css'

function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('entrar') // 'entrar' | 'cadastrar'
  usePageTitle(mode === 'entrar' ? 'Entrar' : 'Criar conta')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'confirm-email'
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setStatus('loading')

    try {
      if (mode === 'entrar') {
        await signIn(email, password)
        navigate('/')
      } else {
        const { session } = await signUp(email, password, nickname)
        if (session) {
          // "Confirm email" está desligado no projeto — já está logado.
          navigate('/')
          return
        }
        // Confirmação por e-mail ligada: a conta existe, mas o login
        // só funciona depois do clique no link recebido.
        setStatus('confirm-email')
        return
      }
    } catch (err) {
      setError(traduzErro(err.message))
    }

    setStatus('idle')
  }

  if (status === 'confirm-email') {
    return (
      <section className="login">
        <h1>Quase lá</h1>
        <p className="login__message">
          Mandamos um link de confirmação pra <strong>{email}</strong>. Clique nele pra ativar sua conta e depois
          volte aqui pra entrar.
        </p>
      </section>
    )
  }

  return (
    <section className="login">
      <h1>{mode === 'entrar' ? 'Entrar' : 'Criar conta'}</h1>

      <form className="login__form" onSubmit={handleSubmit}>
        {mode === 'cadastrar' && (
          <label className="login__field">
            Apelido
            <input
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              required
              maxLength={30}
              autoComplete="nickname"
              placeholder="Como quer ser chamado"
            />
          </label>
        )}

        <label className="login__field">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className="login__field">
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'entrar' ? 'current-password' : 'new-password'}
          />
        </label>

        {error && <p className="login__error">{error}</p>}

        <button type="submit" className="login__submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Aguarde...' : mode === 'entrar' ? 'Entrar' : 'Criar conta'}
        </button>
      </form>

      <button type="button" className="login__toggle" onClick={() => setMode(mode === 'entrar' ? 'cadastrar' : 'entrar')}>
        {mode === 'entrar' ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
      </button>
    </section>
  )
}

function traduzErro(message) {
  if (message.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (message.includes('User already registered')) return 'Já existe uma conta com esse e-mail.'
  if (message.includes('Password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.'
  if (message.includes('email rate limit exceeded'))
    return 'Muitos e-mails de confirmação enviados em pouco tempo. Espere alguns minutos e tente de novo.'
  return message
}

export default Login
