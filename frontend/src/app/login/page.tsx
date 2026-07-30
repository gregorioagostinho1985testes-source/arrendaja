'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        emailOrPhone,
        password
      })

      login(response.data.token, response.data.user)
      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao entrar. Verifique as suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  function handleSocialLogin(provider: 'google' | 'apple') {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/auth/${provider}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-blue-700">ArrendaJá</h1>
        <p className="text-xs text-gray-500 mt-1">Aceda à sua conta</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Botões de Redes Sociais */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c-.07-.8-.63-1.5-1.445-1.5H12v4.5h6.53c-.3 1.5-1.54 3.75-4.53 3.75-2.73 0-4.97-2.24-4.97-4.97s2.24-4.97 4.97-4.97c1.3 0 2.47.48 3.37 1.28l3.37-3.37C17.71 4.54 15.06 3.5 12 3.5 6.75 3.5 2.5 7.75 2.5 13s4.25 9.5 9.5 9.5c5.5 0 9.13-3.87 9.13-9.33 0-.6-.07-1.2-.16-1.9z"/>
            </svg>
            Entrar com o Google
          </button>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-3 text-[10px] uppercase text-gray-400 font-semibold">Ou com e-mail</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail ou Telefone</label>
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="seuemail@exemplo.com ou 923000000"
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Palavra-passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-3 rounded-xl transition shadow-sm mt-2"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/registo" className="text-xs text-blue-600 font-semibold">
            Não tem uma conta? Registe-se
          </Link>
        </div>
      </div>
    </div>
  )
}