import * as React from "react"
import Image from "next/image"

export function PolaroidGallery() {
  return (
    <div className="flex justify-center items-center gap-4 md:gap-8 mb-12 w-full max-w-4xl mx-auto px-4">
      {/* Photo 1 - Visible on all screens */}
      {/* Para alterar esta foto, substitua o link do src ou coloque a imagem na pasta public (ex: src="/foto1.jpg") */}
      <div className="relative bg-white p-3 md:p-4 pb-12 md:pb-16 shadow-lg rotate-[-2deg] hover:rotate-0 transition-transform duration-300 z-10 w-64 md:w-72">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200">
          <Image
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800"
            alt="Mirlene e Leandro 1"
            fill
            className="object-cover grayscale"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </div>

      {/* Photo 2 - Hidden on mobile */}
      {/* Para alterar esta foto, substitua o link do src ou coloque a imagem na pasta public (ex: src="/foto2.jpg") */}
      <div className="hidden md:block relative bg-white p-4 pb-16 shadow-lg rotate-[3deg] hover:rotate-0 transition-transform duration-300 z-20 w-72 -mt-8">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
            alt="Mirlene e Leandro 2"
            fill
            className="object-cover grayscale"
            sizes="33vw"
          />
        </div>
      </div>

      {/* Photo 3 - Hidden on mobile */}
      {/* Para alterar esta foto, substitua o link do src ou coloque a imagem na pasta public (ex: src="/foto3.jpg") */}
      <div className="hidden md:block relative bg-white p-4 pb-16 shadow-lg rotate-[-4deg] hover:rotate-0 transition-transform duration-300 z-10 w-72">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200">
          <Image
            src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800"
            alt="Mirlene e Leandro 3"
            fill
            className="object-cover grayscale"
            sizes="33vw"
          />
        </div>
      </div>
    </div>
  )
}
