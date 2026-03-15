import * as React from "react"
import Image from "next/image"

export function PolaroidGallery() {
  return (
    <div className="relative flex justify-center items-center h-[350px] md:h-auto gap-0 md:gap-8 mb-12 w-full max-w-4xl mx-auto px-4 mt-8 md:mt-0">
      {/* Photo 1 - Left (Mobile absolute, Desktop inline) */}
      <div className="absolute md:relative left-1/2 md:left-auto -ml-[130px] md:-ml-0 bg-white p-3 md:p-4 pb-12 md:pb-16 shadow-xl rotate-[-8deg] md:rotate-[-2deg] hover:rotate-[-2deg] md:hover:rotate-0 hover:z-30 transition-all duration-300 z-10 w-48 md:w-72">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200">
          <Image
            src="/images/photo1.webp"
            alt="Mirlene e Leandro 1"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Photo 2 - Center (Front on Mobile, Middle on Desktop) */}
      <div className="absolute md:relative left-1/2 md:left-auto -ml-[112px] md:-ml-0 -mt-[30px] md:-mt-8 bg-white p-3 md:p-4 pb-12 md:pb-16 shadow-2xl md:shadow-lg rotate-[-1deg] md:rotate-[3deg] hover:rotate-0 hover:scale-105 md:hover:scale-100 transition-all duration-300 z-20 w-56 md:w-72">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200">
          <Image
            src="/images/photo2.webp"
            alt="Mirlene e Leandro 2"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
            sizes="(max-width: 768px) 70vw, 40vw"
          />
        </div>
      </div>

      {/* Photo 3 - Right (Mobile absolute, Desktop inline) */}
      <div className="absolute md:relative left-1/2 md:left-auto -ml-[70px] md:ml-0 mt-[10px] md:mt-0 bg-white p-3 md:p-4 pb-12 md:pb-16 shadow-xl rotate-[10deg] md:rotate-[-4deg] hover:rotate-[4deg] md:hover:rotate-0 hover:z-30 transition-all duration-300 z-10 w-48 md:w-72">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200">
          <Image
            src="/images/photo3.webp"
            alt="Mirlene e Leandro 3"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      </div>
    </div>
  )
}
