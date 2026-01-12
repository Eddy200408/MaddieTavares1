'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface ImageModalProps {
  src: string
  alt: string
  className?: string
}

export function ImageModal({ src, alt, className = '' }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Imagem clicável */}
      <div 
        onClick={() => setIsOpen(true)}
        className={`cursor-pointer transition-transform hover:scale-105 ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          width={600}
          height={400}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Modal com imagem ampliada */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          {/* Botão fechar */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Imagem ampliada */}
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={1920}
              height={1080}
              className="w-full h-auto object-contain rounded-lg"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}