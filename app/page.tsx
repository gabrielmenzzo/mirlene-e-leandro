import * as React from "react"
import { Logo } from "@/components/wedding/Logo"
import { Arabesque } from "@/components/wedding/Arabesque"
import { CountdownTimer } from "@/components/wedding/CountdownTimer"
import { RSVPForm } from "@/components/wedding/RSVPForm"
import { PolaroidGallery } from "@/components/wedding/PolaroidGallery"
import { Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-bg opacity-40 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-end relative z-10">
        <Link 
          href="/presente" 
          className="text-wedding-primary font-cormorant text-lg italic hover:text-wedding-secondary transition-colors border-b border-transparent hover:border-wedding-secondary"
        >
          Lista de Presentes &rarr;
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-12 pb-20 flex flex-col items-center text-center relative z-10">
        <PolaroidGallery />
        <Logo className="mb-8" />
        
        <h2 className="font-cormorant text-2xl md:text-3xl font-light text-wedding-secondary mb-6 max-w-2xl">
          Celebre conosco este momento especial
        </h2>

        <Arabesque className="mb-12 w-48 md:w-64" />

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-16 text-wedding-text font-lato">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-wedding-primary" />
            <span className="text-lg tracking-wide">03 de Outubro de 2026</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-wedding-primary/30" />
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-wedding-primary" />
            <span className="text-lg tracking-wide">10:00h</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-wedding-primary/30" />
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-wedding-primary flex-shrink-0" />
            <a 
              href="https://maps.app.goo.gl/gHUq1HS8uHat9BDe8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg tracking-wide hover:text-wedding-primary transition-colors hover:underline underline-offset-4"
            >
              Av. Sebastião Jorge Lasmar - Formiga, MG, 35570-000
            </a>
          </div>
        </div>

        <CountdownTimer />
      </section>

      {/* RSVP Section */}
      <section className="w-full px-4 py-20 relative z-10 bg-gradient-to-b from-transparent via-wedding-muted/30 to-transparent">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <Arabesque className="mb-12 w-32 rotate-180 opacity-40" />
          <RSVPForm />
          <Arabesque className="mt-16 w-32 opacity-40" />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 text-center relative z-10">
        <p className="font-great-vibes text-3xl text-wedding-primary mb-2">
          #MirleneELeandro2026
        </p>
        <p className="text-xs text-wedding-secondary/60 font-lato uppercase tracking-widest">
          Com amor, Mirlene & Leandro
        </p>
      </footer>
    </main>
  )
}
