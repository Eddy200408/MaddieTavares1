'use client'

import { Star } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sofia Silva',
      role: 'Empresária',
      content: 'Maddie Tavares transformou minha autoestima. O resultado foi além das expectativas, sem contar o atendimento impecável.',
      rating: 5
    },
    {
      name: 'Maria Oliveira',
      role: 'Influenciadora',
      content: 'A qualidade dos procedimentos é incomparável. Minha pele nunca esteve tão luminosa e hidratada. Recomendo muito!',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Professora',
      content: 'O ambiente é absolutamente relaxante. Saí de lá sentindo-me uma nova pessoa. Voltarei com certeza!',
      rating: 5
    },
    {
      name: 'Carla Mendes',
      role: 'Médica',
      content: 'Como profissional de saúde, aprecio o conhecimento técnico da equipe. Trabalho excelente, totalmente seguro e eficaz.',
      rating: 5
    },
  ]

  return (
    <section className="py-40 px-6 bg-secondary/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <p className="text-accent tracking-widest uppercase text-sm mb-6 font-light">Depoimentos</p>
          <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-8 text-balance">
            Histórias de Transformação
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Veja o que nossas clientes dizem sobre suas experiências
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="p-8 bg-card border border-border rounded-2xl hover:border-primary transition glow-effect">
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-lg leading-relaxed mb-8 text-muted-foreground">"{testimonial.content}"</p>
              <div className="border-t border-border pt-6">
                <p className="font-light text-lg">{testimonial.name}</p>
                <p className="text-sm text-accent">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
