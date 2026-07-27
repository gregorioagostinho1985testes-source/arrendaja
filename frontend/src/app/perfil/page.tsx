'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ShieldAlert, LogOut, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, login, token } = useAuth()
  const [identityNumber, setIdentityNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center max-w-md mx-auto">
        <UserIcon className="w-12 h-12 text-gray-300 mb-2" />
        <h2 className="font-bold text-gray-800 mb-1">Minha Conta</h2>
        <p className="text-xs text-gray-500 mb-4">Aceda para gerir o seu perfil e verificar a sua conta.</p>
        <button onClick={() => router.push('/login')} className="bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
          Entrar ou Criar Conta
        </button>
      </div>
    )
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

   try {
      const response = await api.post('/identity/verify', { identityNumber })
      setMessage('Conta verificada com sucesso!')
      
      // Atualizar dados no contexto local
    // Opção 1: Garantindo que o id existe (assumindo que o utilizador está logado)
    if (token && user?.id) {
    login(token, { ...user, id: user.id, identityStatus: 'VERIFIED' })
    }
    } catch (err: any) {
    
      setError(err.response?.data?.message || 'Erro ao submeter BI.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20 max-w-md mx-auto space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">{user.fullName}</h1>
          <p className="text-xs text-gray-500">{user.phoneNumber} • {user.email}</p>
        </div>
        <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-xl">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Card de Status da Identidade */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Verificação de Conta</h2>

        {user.identityStatus === 'VERIFIED' ? (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 p-3 rounded-xl text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span>Perfil Verificado (BI Confirmado)</span>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3">
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>Valide a sua conta introduzindo o seu número de BI para aumentar a confiança dos inquilinos/senhorios.</p>
            </div>

            {message && <div className="p-2.5 bg-green-50 text-green-700 text-xs rounded-xl font-medium">{message}</div>}
            {error && <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl font-medium">{error}</div>}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Número do BI</label>
              <input
                type="text"
                required
                value={identityNumber}
                onChange={(e) => setIdentityNumber(e.target.value)}
                placeholder="Ex: 004829103LA042"
                className="w-full text-xs p-3 rounded-xl border border-gray-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold text-xs p-3 rounded-xl shadow-sm"
            >
              {loading ? 'A validar...' : 'Validar Identidade'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}