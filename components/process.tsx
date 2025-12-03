'use client'

import { CheckCircle2 } from 'lucide-react'

export function ProcessSection() {
  const steps = [
    {
      step: '01',
      title: 'Avaliação Inicial',
      description: 'Análise minuciosa da sua pele, saúde e objetivos de beleza em consulta personalizada'
    },
    {
      step: '02',
      title: 'Plano Personalizado',
      description: 'Desenvolvimento de estratégia única adaptada aos seus desejos e necessidades'
    },
    {
      step: '03',
      title: 'Tratamento Premium',
      description: 'Execução dos procedimentos com tecnologia de ponta e profissionais experientes'
    },
    {
      step: '04',
      title: 'Acompanhamento',
      description: 'Suporte contínuo e orientações para manter seus resultados impecáveis'
    },
  ]

  return (
    <section className="py-40 px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <p className="text-accent tracking-widest uppercase text-sm mb-6 font-light">Metodologia</p>
          <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-8 text-balance">
            Sua Jornada Transformadora
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Seguimos um processo comprovado que garante resultados extraordinários e satisfação plena
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((item, idx) => (
            <div key={idx} className="flex gap-8 md:gap-12">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 border-2 border-primary">
                  <span className="text-2xl font-light text-primary">{item.step}</span>
                </div>
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-light mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
