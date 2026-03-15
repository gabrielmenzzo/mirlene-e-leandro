"use client"

import * as React from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Logo } from "@/components/wedding/Logo"
import { Arabesque } from "@/components/wedding/Arabesque"
import { GiftCard, GiftItem } from "@/components/wedding/GiftCard"

const GiftModal = dynamic(() => import("@/components/wedding/GiftModal").then(mod => mod.GiftModal), {
  ssr: false,
})

const GIFTS: GiftItem[] = [
  {
    id: "g1",
    name: "Conjunto de Panelas Tramontina Premium",
    description: "Para prepararmos refeições deliciosas juntos.",
    price: 450.0,
    imageUrl: "https://images.unsplash.com/photo-1584990347449-a6eb1eb3a929?auto=format&fit=crop&q=80&w=800",
    badge: "Mais desejado ✨",
  },
  {
    id: "g2",
    name: "Jogo de Toalhas Bordadas",
    description: "Conforto e maciez para o nosso dia a dia.",
    price: 180.0,
    imageUrl: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g3",
    name: "Cafeteira Expresso Nespresso",
    description: "Para os cafés da manhã preguiçosos de domingo.",
    price: 650.0,
    imageUrl: "https://images.unsplash.com/photo-1517246281036-e18c0f73f4e3?auto=format&fit=crop&q=80&w=800",
    badge: "Escolha especial 💛",
  },
  {
    id: "g4",
    name: "Jogo de Cama King Plumasul",
    description: "Para noites de sono tranquilas e aconchegantes.",
    price: 320.0,
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g5",
    name: "Liquidificador Mondial Premium",
    description: "Para sucos, vitaminas e receitas especiais.",
    price: 220.0,
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g6",
    name: "Aparelho de Jantar 42 peças",
    description: "Para recebermos amigos e familiares com elegância.",
    price: 380.0,
    imageUrl: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g7",
    name: "Adega Climatizada",
    description: "Para brindarmos os momentos inesquecíveis.",
    price: 890.0,
    imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g8",
    name: "Kit Vinho + Taças Personalizadas",
    description: "O complemento perfeito para a nossa adega.",
    price: 250.0,
    imageUrl: "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g9",
    name: "Smart TV 43\"",
    description: "Para nossas maratonas de séries e filmes.",
    price: 1800.0,
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g10",
    name: "Robô Aspirador",
    description: "Para nos ajudar a manter a casa sempre limpa.",
    price: 1200.0,
    imageUrl: "https://images.unsplash.com/photo-1589824783837-6169889fd20c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g11",
    name: "KitchenAid Stand Mixer",
    description: "Para as receitas mais elaboradas e deliciosas.",
    price: 1500.0,
    imageUrl: "https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g12",
    name: "Conjunto de Facas Wüsthof",
    description: "Precisão e qualidade para a nossa cozinha.",
    price: 420.0,
    imageUrl: "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=800",
  },
]

export default function Presentes() {
  const [gifts, setGifts] = React.useState<GiftItem[]>(GIFTS)
  const [selectedGift, setSelectedGift] = React.useState<GiftItem | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  // Load reserved gifts from localStorage on mount
  React.useEffect(() => {
    const reservedGifts = JSON.parse(localStorage.getItem("reservedGifts") || "[]")
    if (reservedGifts.length > 0) {
      setGifts((prevGifts) =>
        prevGifts.map((gift) =>
          reservedGifts.includes(gift.id) ? { ...gift, isReserved: true } : gift
        )
      )
    }
  }, [])

  const handleGiftClick = (gift: GiftItem) => {
    setSelectedGift(gift)
    setIsModalOpen(true)
  }

  const handleGiftSuccess = (giftId: string) => {
    setGifts((prevGifts) =>
      prevGifts.map((gift) =>
        gift.id === giftId ? { ...gift, isReserved: true } : gift
      )
    )

    // Save to localStorage
    const reservedGifts = JSON.parse(localStorage.getItem("reservedGifts") || "[]")
    if (!reservedGifts.includes(giftId)) {
      localStorage.setItem("reservedGifts", JSON.stringify([...reservedGifts, giftId]))
    }
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
          &larr; Voltar para o Convite
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
          {gifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} onGiftClick={handleGiftClick} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 text-center relative z-10 bg-wedding-muted/30">
        <p className="font-great-vibes text-3xl text-wedding-primary mb-2">
          #MirleneELeandro2026
        </p>
        <p className="text-xs text-wedding-secondary/60 font-lato uppercase tracking-widest">
          Com amor, Mirlene & Leandro
        </p>
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
