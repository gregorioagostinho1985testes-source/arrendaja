
import Link from 'next/link';
import { Home, Search, PlusSquare, MessageSquare, User } from 'lucide-react';

export default function MobileHomePage() {
return (
<div className="min-h-screen bg-gray-50 flex flex-col justify-between pb-16">
{/* Header Fixo */}
<header className="bg-blue-700 text-white p-4 sticky top-0 z-50 shadow-md">
<div className="flex justify-between items-center max-w-md mx-auto">
<h1 className="text-xl font-black tracking-tight">ArrendaJá</h1>
<span className="text-xs bg-blue-800 px-2.5 py-1 rounded-full border border-blue-600 font-medium">
Luanda
</span>
</div>
</header>

{/* Conteúdo Principal / Feed Mobile */}
<main className="p-4 max-w-md mx-auto w-full space-y-4 flex-1">
<div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-900">
<h2 className="font-bold text-base mb-1">Arrendamento Directo</h2>
<p className="text-xs text-blue-700">
Encontre casas, apartamentos e anexos sem pagar comissão a intermediários.
</p>
</div>

<div className="space-y-3">
<h3 className="font-bold text-gray-800 text-sm">Imóveis em Destaque</h3>

{/* Card Exemplo Mobile */}
<div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
<div className="h-40 bg-gray-200 relative flex items-center justify-center text-gray-400 text-xs">
[ Foto do Imóvel ]
</div>
<div className="p-3">
<span className="text-[10px] font-bold uppercase bg-green-100 text-green-800 px-2 py-0.5 rounded">
Apartamento T2
</span>
<h4 className="font-bold text-gray-900 text-sm mt-1">T2 no Benfica (Próximo à Estrada)</h4>
<p className="text-xs text-gray-500">Talatona, Luanda</p>
<div className="mt-3 flex justify-between items-center pt-2 border-t border-gray-50">
<span className="text-base font-extrabold text-blue-700">150.000 AOA <span className="text-[10px] font-normal text-gray-400">/mês</span></span>
<button className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-sm">
Ver Detalhes
</button>
</div>
</div>
</div>
</div>
</main>

{/* Navegação Inferior Estilo App Mobile */}
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center max-w-md mx-auto z-50">
<Link href="/" className="flex flex-col items-center text-blue-600">
<Home className="w-5 h-5" />
<span className="text-[10px] mt-0.5 font-medium">Início</span>
</Link>
<Link href="/pesquisa" className="flex flex-col items-center text-gray-400">
<Search className="w-5 h-5" />
<span className="text-[10px] mt-0.5">Buscar</span>
</Link>
<Link href="/publicar" className="flex flex-col items-center text-gray-400">
<PlusSquare className="w-5 h-5" />
<span className="text-[10px] mt-0.5">Anunciar</span>
</Link>
<Link href="/mensagens" className="flex flex-col items-center text-gray-400">
<MessageSquare className="w-5 h-5" />
<span className="text-[10px] mt-0.5">Chat</span>
</Link>
<Link href="/perfil" className="flex flex-col items-center text-gray-400">
<User className="w-5 h-5" />
<span className="text-[10px] mt-0.5">Conta</span>
</Link>
</nav>
</div>
);
}