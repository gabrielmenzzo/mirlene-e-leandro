"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { Logo } from "@/components/wedding/Logo"
import { Arabesque } from "@/components/wedding/Arabesque"
import { GiftCard, GiftItem } from "@/components/wedding/GiftCard"

const GiftModal = dynamic(() => import("@/components/wedding/GiftModal").then(mod => mod.GiftModal), {
  ssr: false,
})

const ORIGINAL_GIFTS: GiftItem[] = [
  {
    id: "g1",
    name: "Smart TV 43\"",
    description: "Para nossas maratonas de séries e filmes.",
    price: 1800.0,
    imageUrl: "/images/gifts/g9.webp",
    badge: "Mais desejado ✨",
  },
  {
    id: "g2",
    name: "KitchenAid Stand Mixer",
    description: "Para as receitas mais elaboradas e deliciosas.",
    price: 1500.0,
    imageUrl: "/images/gifts/g11.webp",
  },
  {
    id: "g3",
    name: "Robô Aspirador",
    description: "Para nos ajudar a manter a casa sempre limpa.",
    price: 1200.0,
    imageUrl: "/images/robo.webp",
  },
  {
    id: "g4",
    name: "Adega Climatizada",
    description: "Para brindarmos os momentos inesquecíveis.",
    price: 890.0,
    imageUrl: "/images/gifts/g7.webp",
  },
  {
    id: "g5",
    name: "Conjunto de Panelas Tramontina Premium",
    description: "Para prepararmos refeições deliciosas juntos.",
    price: 450.0,
    imageUrl: "/images/panelas.webp",
  },
  {
    id: "g6",
    name: "Cafeteira Expresso Nespresso",
    description: "Para os cafés da manhã preguiçosos de domingo.",
    price: 650.0,
    imageUrl: "/images/cafeteira.webp",
    badge: "Escolha especial 💛",
  },
  {
    id: "g7",
    name: "Conjunto de Facas Wüsthof",
    description: "Precisão e qualidade para a nossa cozinha.",
    price: 420.0,
    imageUrl: "/images/gifts/g12.webp",
  },
  {
    id: "g8",
    name: "Aparelho de Jantar 42 peças",
    description: "Para recebermos amigos e familiares com elegância.",
    price: 380.0,
    imageUrl: "/images/gifts/g6.webp",
  },
  {
    id: "g9",
    name: "Jogo de Cama King Plumasul",
    description: "Para noites de sono tranquilas e aconchegantes.",
    price: 320.0,
    imageUrl: "/images/gifts/g4.webp",
  },
  {
    id: "g10",
    name: "Micro-ondas Philco Flat 30L",
    description: "Para aquecer rapidamente nossas refeições e facilitar o dia a dia na cozinha.",
    price: 599.0,
    imageUrl: "/images/gifts/g10.webp",
  },
  {
    id: "g11",
    name: "Jogo de Pratos Redondo de Porcelana Branco 6 peças",
    description: "Para servirmos nossos jantares em grande estilo.",
    price: 225.99,
    imageUrl: "/images/gifts/g6.webp",
  },
  {
    id: "g12",
    name: "Liquidificador Mondial Premium",
    description: "Para sucos, vitaminas e receitas especiais.",
    price: 220.0,
    imageUrl: "/images/gifts/g5.webp",
  },
  {
    id: "g13",
    name: "Kit Vinho + Taças Personalizadas",
    description: "O complemento perfeito para a nossa adega.",
    price: 250.0,
    imageUrl: "/images/gifts/g8.webp",
  },
  {
    id: "g14",
    name: "Jogo de Toalhas Bordadas",
    description: "Conforto e maciez para o nosso dia a dia.",
    price: 180.0,
    imageUrl: "/images/gifts/g2.webp",
  },
  {
    id: "g15",
    name: "Petisqueira Porcelana com Pote Retangular 4 Peças Tramontina Teca",
    description: "Para noites de vinho e queijos com amigos especiais.",
    price: 177.59,
    imageUrl: "/images/petisqueira_vidro.webp",
  },
  {
    id: "g16",
    name: "Jogo De Facas Inox 9 Peças Plenus Preto Tramontina",
    description: "Um kit completo para todas as nossas aventuras culinárias.",
    price: 176.99,
    imageUrl: "/images/jogo_facas_3.webp",
  },
  {
    id: "g17",
    name: "Espremedor de Frutas Mondial E-02 Premium",
    description: "Para começarmos o dia com aquele suco fresquinho.",
    price: 149.99,
    imageUrl: "/images/espremedor_frutas.webp",
  },
  {
    id: "g18",
    name: "Jogo de Potes Hermético Electrolux Bambu 2 Peças",
    description: "O charme e a praticidade perfeitos para a nossa despensa.",
    price: 132.00,
    imageUrl: "/images/potes_bambu.webp",
  },
  {
    id: "g19",
    name: "Kit de Toalhas Banho e Rosto",
    description: "O conforto e maciez pós-banho que toda casa precisa.",
    price: 159.99,
    imageUrl: "/images/gifts/g2.webp",
  },
  {
    id: "g20",
    name: "Sanduicheira Mondial Fast Grill S-12",
    description: "Para prepararmos os lanches rápidos que tanto amamos.",
    price: 119.99,
    imageUrl: "/images/gifts/g5.webp",
  },
  {
    id: "g21",
    name: "Jogo de Potes de Plástico Herméticos Electrolux 12 Peças",
    description: "Ajudinha extra para mantermos nossa geladeira sempre organizada.",
    price: 115.90,
    imageUrl: "/images/potes_plastico.webp",
  },
  {
    id: "g22",
    name: "Conjunto Trinchante Tramontina Inox Plenus 2 Peças",
    description: "Praticidade e elegância para os nossos tradicionais assados.",
    price: 87.98,
    imageUrl: "/images/conjunto_trinchante.webp",
  },
  {
    id: "g23",
    name: "Jogo de Cama Queen",
    description: "Para noites de sono confortáveis com a delicadeza que merecemos.",
    price: 85.99,
    imageUrl: "/images/jogo_cama_queen.webp",
  },
  {
    id: "g24",
    name: "Porta-Papel Toalha de Mesa Inox Hauskraft",
    description: "Organização com estilo moderno para nossa cozinha.",
    price: 77.49,
    imageUrl: "/images/porta_papel.webp",
  },
  {
    id: "g25",
    name: "Jogo de Taças para Vinho de Vidro 4 Peças",
    description: "Para brindarmos juntos os bons momentos.",
    price: 79.99,
    imageUrl: "/images/tacas_vinho.webp",
  },
  {
    id: "g26",
    name: "Jogo de Taças para Champanhe de Vidro 4 Peças",
    description: "Para celebrarmos todas as nossas futuras conquistas.",
    price: 69.99,
    imageUrl: "/images/tacas_champanhe.webp",
  },
  {
    id: "g27",
    name: "Frigideira Antiaderente Tramontina de Alumínio",
    description: "Nossa aliada para preparar pratos deliciosos e práticos.",
    price: 65.99,
    imageUrl: "/images/frigideira_antiaderente.webp",
  },
  {
    id: "g28",
    name: "Jogo de Facas 3 Peças Tramontina",
    description: "Para dar um toque chef nas nossas refeições do dia a dia.",
    price: 54.99,
    imageUrl: "/images/jogo_facas_3.webp",
  },
  {
    id: "g29",
    name: "Açucareiro de Vidro com Colher Hauskraft Graffiato",
    description: "O detalhe doce e sofisticado para a nossa mesa posta.",
    price: 53.45,
    imageUrl: "/images/acucareiro.webp",
  },
  {
    id: "g30",
    name: "Assadeira de Vidro Quadrada",
    description: "Perfeita para preparar nossas sobremesas e assados favoritos.",
    price: 52.98,
    imageUrl: "/images/assadeira_vidro.webp",
  },
  {
    id: "g31",
    name: "Petisqueira de Vidro Redonda",
    description: "Para recebermos amigos em casa com muito charme.",
    price: 59.99,
    imageUrl: "/images/petisqueira_vidro.webp",
  },
  {
    id: "g32",
    name: "Bule Haus 1 Litro",
    description: "Para aquecer nossos corações nos cafés e chás da tarde.",
    price: 49.99,
    imageUrl: "/images/bule_haus.webp",
  },
]

const NEW_GIFTS: GiftItem[] = [
  {
    id: "ng1",
    name: "☕ Café para o noivo acordar de bom humor",
    description: "Para começar o dia com o pé direito.",
    price: 50.0,
    imageUrl: "/images/gifts/n1.webp",
  },
  {
    id: "ng2",
    name: "🍫 Chocolate para evitar DR",
    description: "O segredo para uma relação doce.",
    price: 60.0,
    imageUrl: "/images/gifts/chocolate.webp",
  },
  {
    id: "ng3",
    name: "🧦 Meias do noivo que sempre desaparecem",
    description: "Para nunca mais ter meias orphan.",
    price: 70.0,
    imageUrl: "/images/gifts/n3.webp",
  },
  {
    id: "ng4",
    name: "🍿 Pipoca para nossas noites de série",
    description: "O acompanhamento perfeito para maratonas.",
    price: 80.0,
    imageUrl: "/images/gifts/pipoca.webp",
  },
  {
    id: "ng5",
    name: "🍕 Pizza para quando ninguém quiser cozinhar",
    description: "A solução para os dias de preguiça.",
    price: 90.0,
    imageUrl: "/images/gifts/n5.webp",
  },
  {
    id: "ng6",
    name: "🧹 Ajuda para manter a casa organizada",
    description: "Um pouco de ajuda nunca é demais.",
    price: 100.0,
    imageUrl: "/images/gifts/n6.webp",
  },
  {
    id: "ng7",
    name: "🧺 Fundo lavanderia infinita",
    description: "Porque a roupa nunca acaba.",
    price: 120.0,
    imageUrl: "/images/gifts/n7.webp",
  },
  {
    id: "ng8",
    name: "🧘 Fundo da paciência do casal",
    description: "Investimento no nosso equilíbrio.",
    price: 150.0,
    imageUrl: "/images/gifts/n8.webp",
  },
  {
    id: "ng9",
    name: "🌭 Lanche da madrugada do casal",
    description: "Para os dias de movie night.",
    price: 160.0,
    imageUrl: "/images/gifts/n9.webp",
  },
  {
    id: "ng10",
    name: "🛋 Contribuição para nosso descanso no sofá",
    description: "Para relaxar juntos após o trabalho.",
    price: 180.0,
    imageUrl: "/images/gifts/n10.webp",
  },
  {
    id: "ng11",
    name: "🚗 Gasolina para visitar a sogra",
    description: "O combustível do amor familiar.",
    price: 200.0,
    imageUrl: "/images/gifts/n11.webp",
  },
  {
    id: "ng12",
    name: "🍷 Vinho para comemorar que sobrevivemos ao casamento",
    description: "Brinde final merecido.",
    price: 220.0,
    imageUrl: "/images/gifts/n12.webp",
  },
  {
    id: "ng13",
    name: "🛒 Compras do mês (socorro!)",
    description: "A ajuda que toda casa nova precisa.",
    price: 250.0,
    imageUrl: "/images/gifts/n13.webp",
  },
  {
    id: "ng14",
    name: "✈️ Ajuda para fugir na lua de mel",
    description: "Para o merecido descanso pós-casamento.",
    price: 300.0,
    imageUrl: "/images/gifts/n14.webp",
  },
  {
    id: "ng15",
    name: "💸 Fundo casados e agora?",
    description: "Para os primeiros passos da nova fase.",
    price: 350.0,
    imageUrl: "/images/gifts/n15.webp",
  },
  {
    id: "ng16",
    name: "😂 Terapia de casal preventiva",
    description: "Porque prevenção é o melhor remédio.",
    price: 400.0,
    imageUrl: "/images/gifts/n16.webp",
  },
]

function interleaveGifts<T extends { price: number }>(arr1: T[], arr2: T[]): T[] {
  const sorted1 = [...arr1].sort((a, b) => a.price - b.price)
  const sorted2 = [...arr2].sort((a, b) => a.price - b.price)
  
  const result: T[] = []
  const maxLen = Math.max(sorted1.length, sorted2.length)
  
  for (let i = 0; i < maxLen; i++) {
    if (i * 2 < sorted1.length) {
      result.push(sorted1[i * 2])
    }
    if (i * 2 + 1 < sorted1.length) {
      result.push(sorted1[i * 2 + 1])
    }
    if (i < sorted2.length) {
      result.push(sorted2[i])
    }
  }
  
  return result
}

const GIFTS: GiftItem[] = interleaveGifts(ORIGINAL_GIFTS, NEW_GIFTS)

export default function Presentes() {
  const [gifts, setGifts] = React.useState<GiftItem[]>(GIFTS)
  const [selectedGift, setSelectedGift] = React.useState<GiftItem | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  // Removed localStorage loading for isReserved

  const handleGiftClick = (gift: GiftItem) => {
    setSelectedGift(gift)
    setIsModalOpen(true)
  }

  const handleGiftSuccess = (giftId: string) => {
    // Just show success, do not lock the gift.
    console.log("Gift purchased successfully:", giftId)
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center bg-wedding-bg">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-bg opacity-40 pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-start relative z-10">
        <Link
          href="/"
          className="text-wedding-primary font-cormorant text-lg italic hover:text-wedding-secondary transition-colors border-b border-transparent hover:border-wedding-secondary"
        >
          &larr; Voltar ao site
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-8 pb-16 flex flex-col items-center text-center relative z-10">
        <Logo className="mb-6 scale-75 md:scale-100 origin-top" />

        <h2 className="font-great-vibes text-4xl md:text-5xl text-wedding-primary mb-4">
          Lista de Presentes
        </h2>
        <p className="font-cormorant text-xl md:text-2xl font-light text-wedding-secondary mb-8 max-w-2xl">
          Escolha um presente especial para celebrar nosso amor
        </p>

        <Arabesque className="w-48 md:w-64" />
      </section>

      {/* Gifts Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {gifts.map((gift, index) => (
            <GiftCard 
              key={gift.id} 
              gift={gift} 
              onGiftClick={handleGiftClick}
              priority={index < 4}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full pt-12 pb-6 text-center relative z-10 bg-wedding-muted/30 flex flex-col items-center">
        <p className="font-great-vibes text-3xl text-wedding-primary mb-2">
          #MirleneELeandro2026
        </p>
        <p className="text-xs text-wedding-secondary/60 font-lato uppercase tracking-widest mb-12">
          Com amor, Mirlene & Leandro
        </p>

        <div className="flex items-center justify-center gap-1.5 mt-8 text-[11px] text-wedding-secondary/80 font-lato">
          <span>Site desenvolvido por:</span>
          <a 
            href="https://menzzo.com.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity flex items-center"
          >
            <Image 
              src="/images/logo-menzzo.svg" 
              alt="Menzzo" 
              width={60} 
              height={14} 
              className="h-3 w-auto object-contain"
            />
          </a>
        </div>
      </footer>

      <GiftModal
        gift={selectedGift}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleGiftSuccess}
      />
    </main>
  )
}
