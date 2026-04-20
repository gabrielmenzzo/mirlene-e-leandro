"use client"

import * as React from "react"
import { Volume2, VolumeX } from "lucide-react"

interface OurStoryProps {
  hasUserInteracted?: boolean
}

export function OurStory({ hasUserInteracted = false }: OurStoryProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = React.useState(true)

  // When user enters (clicks WelcomeOverlay), start video with audio
  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (hasUserInteracted) {
      // User clicked "Entrar" — browser now allows audio
      video.muted = false
      setIsMuted(false)
      video.play().catch(() => {
        // Edge case: still blocked — fallback to muted
        video.muted = true
        setIsMuted(true)
        video.play().catch(() => {})
      })
    } else {
      // No interaction yet — start muted to ensure video plays
      video.muted = true
      setIsMuted(true)
      video.play().catch(() => {})
    }
  }, [hasUserInteracted])

  // IntersectionObserver: pause when off-screen, play when visible (saves CPU/battery)
  React.useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-16 flex flex-col items-center text-center relative z-10">
      
      {/* Video Player (Vertical) */}
      <div ref={containerRef} className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl mb-12 bg-wedding-muted/20 border border-wedding-secondary/20">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/images/video-hero.mp4" type="video/mp4" />
          Seu navegador não suporta o elemento de vídeo.
        </video>

        {/* Mute/Unmute Button Overlay */}
        <div className="absolute bottom-4 right-4 z-20">
          <button 
            onClick={toggleMute}
            className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white hover:bg-black/60 transition-all"
            aria-label={isMuted ? "Ativar som" : "Desativar som"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Story Text */}
      <h2 className="font-great-vibes text-4xl md:text-5xl text-wedding-primary mb-8">
        Nossa História
      </h2>
      
      <div className="prose prose-lg text-wedding-text font-lato max-w-2xl leading-relaxed mx-auto">
        <p>
          Nossa história começou em 2022 e, desde então, Deus tem guiado cada passo do nosso caminho. Entre desafios, aprendizados e muitas conquistas, construímos uma relação baseada em respeito, companheirismo e um amor que cresce a cada dia. 
        </p>
        <p>
          Com muita dedicação realizamos sonhos importantes, entre eles o nosso lar, preparado com carinho e do jeitinho que sempre imaginamos. Hoje, com o coração cheio de gratidão, decidimos oficializar nossa união diante de Deus e das pessoas que amamos, para seguir nossa caminhada juntos, sob a bênção de Jesus Cristo. 
        </p>
        <p className="font-medium text-wedding-secondary/90 italic">
          É uma alegria imensa compartilhar com vocês esse momento tão especial, fruto de fé, amor e da certeza de que Deus sempre esteve cuidando de nós.
        </p>
      </div>

    </section>
  )
}
