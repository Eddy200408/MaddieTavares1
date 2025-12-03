'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="py-40 px-6 bg-gradient-to-r from-primary/90 to-accent/80 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-primary-foreground mb-8 text-balance">
          Pronto para sua Transformação?
        </h2>
        <p className="text-xl text-primary-foreground/90 mb-12 leading-relaxed">
          Entre em contato conosco hoje e comece sua jornada para a melhor versão de si mesma
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            href="/agendar"
            className="group luxury-button px-10 py-4 bg-primary-foreground text-primary text-lg font-medium hover:shadow-2xl"
          >
            Agendar Agora
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition" size={20} />
          </Link>
          <Link 
            href="/contato"
            className="luxury-button px-10 py-4 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg font-medium"
          >
            Fale Conosco
          </Link>
        </div>
      </div>
    </section>
  )
}
