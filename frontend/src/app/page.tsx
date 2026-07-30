'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Home, Search, PlusSquare, MessageSquare, User, PhoneCall, Droplets, Zap, MapPin } from 'lucide-react'
import { api } from '@/lib/api'

interface Property {
  id: string
  title: string
  description: string
  price: string
  type: string
  municipality: string
  neighborhood: string
  hasWater: boolean
  hasPower: boolean
  images: { url: string }[]
  landlord: {
    fullName: string
    phoneNumber: string
  }
}

export default function MobileHomePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMunicipality, setSelectedMunicipality] = useState('')

  async function fetchProperties(municipality = '') {
    try {
      setLoading(true)
      const query = municipality ? `?municipality=${municipality}` : ''
      const response = await api.get(`/properties${query}`)
      setProperties(response.data.properties)
    } catch (err) {
      console.error('Erro ao carregar imóveis', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  function handleContactWhatsApp(phone: string, title: string) {
    const cleanPhone = phone.replace(/\D/g, '')
    const fullPhone = cleanPhone.startsWith('244') ? cleanPhone : `244${cleanPhone}`
    const message = encodeURIComponent(`Olá! Vi o seu anúncio "${title}" no ArrendaJá e gostaria de obter mais informações.`)
    window.open(`https://wa.me/${fullPhone}?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between pb-20">
      {/* Header Fixo */}
      <header className="bg-blue-700 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-black tracking-tight">ArrendaJá</h1>
            <p className="text-[10px] text-blue-200">Sem intermediários em Luanda</p>
          </div>
          <span className="text-xs bg-blue-800 px-2.5 py-1 rounded-full border border-blue-600 font-medium">
            Luanda
          </span>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="p-4 max-w-md mx-auto w-full space-y-4 flex-1">
        
        {/* Filtro Rápido por Município */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['Todos', 'Talatona', 'Belas', 'Luanda', 'Viana', 'Cazenga', 'Kilamba Kiaxi'].map((m) => (
            <button
              key={m}
              onClick={() => {
                const value = m === 'Todos' ? '' : m
                setSelectedMunicipality(value)
                fetchProperties(value)
              }}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
                (selectedMunicipality === m || (m === 'Todos' && !selectedMunicipality))
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Status de Carregamento */}
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-xs">
            A carregar imóveis disponíveis em Luanda...
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl text-center border border-gray-100 my-4">
            <p className="text-xs text-gray-500 font-medium">Nenhum imóvel encontrado neste município.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Imagem do Imóvel */}
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                      Sem Fotografia
                    </div>
                  )}
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase bg-blue-600 text-white px-2.5 py-1 rounded-md shadow-sm">
                    {property.type}
                  </span>
                </div>

                {/* Detalhes do Imóvel */}
                <div className="p-4 space-y-2">
                  <h3 className="font-extrabold text-gray-900 text-sm leading-snug">{property.title}</h3>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{property.neighborhood}, {property.municipality}</span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{property.description}</p>

                  {/* Comodidades (Água / Energia) */}
                  <div className="flex gap-3 pt-1 text-[11px] text-gray-500">
                    {property.hasWater && (
                      <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        <Droplets className="w-3 h-3" /> Água
                      </span>
                    )}
                    {property.hasPower && (
                      <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                        <Zap className="w-3 h-3" /> Energia
                      </span>
                    )}
                  </div>

                  <hr className="border-gray-100 my-2" />

                  {/* Preço e Botão de Contacto */}
                  <div className="flex justify-between items-center pt-1">
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Renda Mensal</span>
                      <span className="text-base font-black text-blue-700">
                        {Number(property.price).toLocaleString('pt-AO')} <span className="text-xs font-normal">AOA</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleContactWhatsApp(property.landlord.phoneNumber, property.title)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      Contactar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Navegação Inferior Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center max-w-md mx-auto z-50">
        <Link href="/" className="flex flex-col items-center text-blue-600">
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Início</span>
        </Link>
        <Link href="/publicar" className="flex flex-col items-center text-gray-400">
          <PlusSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Anunciar</span>
        </Link>
        <Link href="/perfil" className="flex flex-col items-center text-gray-400">
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Conta</span>
        </Link>
      </nav>
    </div>
  )
}