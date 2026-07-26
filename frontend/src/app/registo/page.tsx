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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-blue-700">ArrendaJá</h1>
        <p className="text-xs text-gray-500 mt-1">Crie a sua conta e encontre o seu imóvel em Luanda</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-3 rounded-xl transition shadow-sm"
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