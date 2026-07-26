'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center max-w-md mx-auto">
        <h2 className="font-bold text-gray-800 mb-2">Acesso Restrito</h2>
        <p className="text-xs text-gray-500 mb-4">Inicie sessão com a sua conta de Senhorio para publicar anúncios.</p>
        <button onClick={() => router.push('/login')} className="bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
          Entrar na Conta
        </button>
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
    } flex {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20 max-w-md mx-auto">
      <h1 className="text-xl font-black text-gray-900 mb-4">Anunciar Imóvel</h1>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Título do Anúncio</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: T2 Moderno próximo à estrada principal"
            className="w-full text-xs p-3 rounded-xl border border-gray-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de Imóvel</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white"
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
              className="w-full text-xs p-3 rounded-xl border border-gray-200"
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
              className="w-full text-xs p-3 rounded-xl border border-gray-200"
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
              className="w-full text-xs p-3 rounded-xl border border-gray-200"
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
            className="w-full text-xs p-3 rounded-xl border border-gray-200"
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
            className="w-full text-xs p-3 rounded-xl border border-gray-200"
          />
        </div>

        <div className="flex gap-4 pt-1">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
            <input type="checkbox" checked={hasWater} onChange={(e) => setHasWater(e.target.checked)} />
            Água da Rede
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
            <input type="checkbox" checked={hasPower} onChange={(e) => setHasPower(e.target.checked)} />
            Energia da Rede
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold text-xs p-3 rounded-xl shadow-sm mt-2"
        >
          {loading ? 'A publicar...' : 'Publicar Anúncio'}
        </button>
      </form>
    </div>
  )
}