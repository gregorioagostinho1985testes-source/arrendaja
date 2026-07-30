'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'TENANT' | 'LANDLORD'>('TENANT')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/register', {
        fullName,
        email,
        phoneNumber,
        password,
        role
      })

      login(response.data.token, response.data.user)
      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Função para lidar com login social (ex: redirecionar para rota do backend OAuth)
  function handleSocialLogin(provider: 'google' | 'apple') {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/auth/${provider}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-blue-700">ArrendaJá</h1>
        <p className="text-xs text-gray-500 mt-1">Crie a sua conta e encontre o seu imóvel em Luanda</p>
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
            Continuar com o Google
          </button>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-3 text-[10px] uppercase text-gray-400 font-semibold">Ou com e-mail</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de Conta</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('TENANT')}
                className={`py-2 text-xs font-bold rounded-xl border ${role === 'TENANT' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-gray-200 text-gray-500'}`}
              >
                Inquilino
              </button>
              <button
                type="button"
                onClick={() => setRole('LANDLORD')}
                className={`py-2 text-xs font-bold rounded-xl border ${role === 'LANDLORD' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-gray-200 text-gray-500'}`}
              >
                Senhorio
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Gregório Ferreira"
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Número de Telefone</label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="923000000"
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
            {loading ? 'A criar conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-xs text-blue-600 font-semibold">
            Já tem uma conta? Entre aqui
          </Link>
        </div>
      </div>
    </div>
  )
}