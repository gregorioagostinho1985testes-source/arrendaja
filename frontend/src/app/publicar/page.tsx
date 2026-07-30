'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, PlusSquare, User as UserIcon } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function PublicarPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState('APARTMENT')
  const [municipality, setMunicipality] = useState('Talatona')
  const [neighborhood, setNeighborhood] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [hasWater, setHasWater] = useState(true)
  const [hasPower, setHasPower] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between pb-20">
        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center max-w-md mx-auto w-full">
          <h2 className="font-bold text-gray-800 mb-2">Acesso Restrito</h2>
          <p className="text-xs text-gray-500 mb-4">Inicie sessão com a sua conta de Senhorio para publicar anúncios.</p>
          <button onClick={() => router.push('/login')} className="bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm">
            Entrar na Conta
          </button>
        </div>

        {/* Navegação Inferior Mobile */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center max-w-md mx-auto z-50">
          <Link href="/" className="flex flex-col items-center text-gray-400">
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Início</span>
          </Link>
          <Link href="/publicar" className="flex flex-col items-center text-blue-600">
            <PlusSquare className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Anunciar</span>
          </Link>
          <Link href="/perfil" className="flex flex-col items-center text-gray-400">
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Conta</span>
          </Link>
        </nav>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/properties', {
        title,
        description,
        price: Number(price),
        type,
        municipality,
        neighborhood,
        hasWater,
        hasPower,
        imageUrl: imageUrl || undefined
      })

      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao publicar imóvel.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between pb-20">
      <main className="p-4 max-w-md mx-auto w-full space-y-4 flex-1">
        <h1 className="text-xl font-black text-gray-900">Anunciar Imóvel</h1>

        {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Título do Anúncio</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: T2 Moderno próximo à estrada principal"
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de Imóvel</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="APARTMENT">Apartamento</option>
                <option value="HOUSE">Vivenda / Casa</option>
                <option value="ANNEX">Anexo</option>
                <option value="COMMERCIAL">Comercial</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Preço Mensal (AOA)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150000"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Município</label>
              <input
                type="text"
                required
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                placeholder="Talatona, Belas, etc."
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Bairro</label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex: Benfica"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">URL da Fotografia (Opcional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Descrição do Imóvel</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as condições da casa, água, luz, segurança..."
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input type="checkbox" checked={hasWater} onChange={(e) => setHasWater(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
              Água da Rede
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input type="checkbox" checked={hasPower} onChange={(e) => setHasPower(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
              Energia da Rede
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-3 rounded-xl shadow-sm mt-2 transition"
          >
            {loading ? 'A publicar...' : 'Publicar Anúncio'}
          </button>
        </form>
      </main>

      {/* Navegação Inferior Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center max-w-md mx-auto z-50">
        <Link href="/" className="flex flex-col items-center text-gray-400">
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Início</span>
        </Link>
        <Link href="/publicar" className="flex flex-col items-center text-blue-600">
          <PlusSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Anunciar</span>
        </Link>
        <Link href="/perfil" className="flex flex-col items-center text-gray-400">
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Conta</span>
        </Link>
      </nav>
    </div>
  )
}