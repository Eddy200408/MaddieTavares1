'use client'

import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { FeaturedServices } from '@/components/featured-services'
import { Atmosphere } from '@/components/atmosphere'
import { TestimonialsSection } from '@/components/testimonials'
import { StatsSection } from '@/components/stats'
import { ProcessSection } from '@/components/process'
import { CtaSection } from '@/components/cta'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <FeaturedServices />
      <ProcessSection />
      <Atmosphere />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
