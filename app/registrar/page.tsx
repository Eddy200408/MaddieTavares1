'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { User, Mail, Lock, Phone } from 'lucide-react'
import { useState } from 'react'

export default function Registrar() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  })

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não correspondem!')
      return
    }
    alert('Conta criada com sucesso! Bem-vindo à Maddie Tavares.')
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20 px-6 pt-32 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light tracking-tight mb-2">Crie sua Conta</h1>
            <p className="text-muted-foreground">Junte-se à nossa comunidade de bem-estar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-2xl p-8">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <User size={18} className="text-primary" />
                Nome Completo
              </label>
              <input 
                type="text" 
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary transition" 
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Mail size={18} className="text-primary" />
                Email
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary transition" 
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Phone size={18} className="text-primary" />
                Telefone
              </label>
              <input 
                type="tel" 
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary transition" 
                placeholder="(11) 98765-4321"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Lock size={18} className="text-primary" />
                Senha
              </label>
              <input 
                type="password" 
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary transition" 
                placeholder="Crie uma senha"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Lock size={18} className="text-primary" />
                Confirmar Senha
              </label>
              <input 
                type="password" 
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary transition" 
                placeholder="Confirme sua senha"
              />
            </div>

            <button type="submit" className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition">
              Criar Conta
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem conta?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Faça login aqui
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
