import * as React from "react"
import { Logo } from "@/components/wedding/Logo"
import { Arabesque } from "@/components/wedding/Arabesque"
import { CountdownTimer } from "@/components/wedding/CountdownTimer"
import { RSVPForm } from "@/components/wedding/RSVPForm"
import { PolaroidGallery } from "@/components/wedding/PolaroidGallery"
import { OurStory } from "@/components/wedding/OurStory"
import { Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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

        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-8 md:gap-0 mb-16 text-wedding-text font-lato">
          <div className="flex-1 flex flex-col items-center gap-3 text-center px-4">
            <Calendar className="w-6 h-6 text-wedding-primary" />
            <span className="text-base md:text-lg tracking-wide font-medium">03 de Outubro de<br />2026</span>
          </div>
          
          <div className="hidden md:block w-px h-16 bg-wedding-primary/30 mt-2 shrink-0" />
          
          <div className="flex-1 flex flex-col items-center gap-3 text-center px-4">
            <Clock className="w-6 h-6 text-wedding-primary" />
            <span className="text-base md:text-lg tracking-wide font-medium">10:00h</span>
          </div>
          
          <div className="hidden md:block w-px h-16 bg-wedding-primary/30 mt-2 shrink-0" />
          
          <div className="flex-1 flex flex-col items-center gap-3 text-center px-4">
            <MapPin className="w-6 h-6 text-wedding-primary flex-shrink-0" />
            <a 
              href="https://maps.app.goo.gl/gHUq1HS8uHat9BDe8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-base md:text-lg tracking-wide hover:text-wedding-primary transition-colors hover:underline underline-offset-4 font-medium"
            >
              Av. Sebastião Jorge Lasmar -<br />Formiga, MG,<br />35570-000
            </a>
          </div>
        </div>

        <CountdownTimer />
      </section>

      {/* Our Story Section */}
      <OurStory />

      {/* RSVP Section */}
      <section className="w-full px-4 py-20 relative z-10 bg-gradient-to-b from-transparent via-wedding-muted/30 to-transparent">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <Arabesque className="mb-12 w-32 rotate-180 opacity-40" />
          <RSVPForm />
          <Arabesque className="mt-16 w-32 opacity-40" />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full pt-12 pb-6 text-center relative z-10 flex flex-col items-center">
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
    </main>
  )
}
