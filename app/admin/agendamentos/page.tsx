"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Phone, Mail, CheckCircle, XCircle, Search, Filter, Plus, X, User } from "lucide-react"

interface Agendamento {
  id: string
  cliente: string
  email: string
  telefone: string
  servico: string
  data: string
  horario: string
  preco: string
  status: "pendente" | "confirmado" | "cancelado" | "concluido"
  metodoPagamento: string
  pago: boolean
}

export default function AdminAgendamentos() {
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [mostrarNovoAgendamento, setMostrarNovoAgendamento] = useState(false)
  const [novoAgendamento, setNovoAgendamento] = useState({
    nome: "",
    email: "",
    telefone: "",
    servico: "",
    data: "",
    horario: "",
    metodoPagamento: "dinheiro",
  })

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([
    {
      id: "001",
      cliente: "Maria Silva",
      email: "maria@email.com",
      telefone: "+238 999 1234",
      servico: "Harmonização Facial Completa",
      data: "2025-01-15",
      horario: "10:00",
      preco: "15.000 Esc",
      status: "pendente",
      metodoPagamento: "Cartão de Crédito",
      pago: false,
    },
    {
      id: "002",
      cliente: "Ana Costa",
      email: "ana@email.com",
      telefone: "+238 988 5678",
      servico: "Limpeza de Pele Profunda",
      data: "2025-01-15",
      horario: "14:00",
      preco: "4.500 Esc",
      status: "confirmado",
      metodoPagamento: "Transferência",
      pago: true,
    },
    {
      id: "003",
      cliente: "Sofia Mendes",
      email: "sofia@email.com",
      telefone: "+238 977 9012",
      servico: "Massagem Relaxante",
      data: "2025-01-16",
      horario: "11:00",
      preco: "3.500 Esc",
      status: "confirmado",
      metodoPagamento: "Dinheiro",
      pago: false,
    },
  ])

  const atualizarStatus = (id: string, novoStatus: Agendamento["status"]) => {
    setAgendamentos((prev) => prev.map((ag) => (ag.id === id ? { ...ag, status: novoStatus } : ag)))
  }

  const marcarComoPago = (id: string) => {
    setAgendamentos((prev) => prev.map((ag) => (ag.id === id ? { ...ag, pago: true } : ag)))
  }

  const agendamentosFiltrados = agendamentos.filter((ag) => {
    const matchBusca =
      ag.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      ag.email.toLowerCase().includes(busca.toLowerCase()) ||
      ag.telefone.includes(busca)
    const matchStatus = filtroStatus === "todos" || ag.status === filtroStatus
    return matchBusca && matchStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "confirmado":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200"
      case "concluido":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const servicosDisponiveis = [
    { nome: "Harmonização Facial Completa", preco: "15.000 Esc", duracao: "90min" },
    { nome: "Preenchimento Labial", preco: "8.000 Esc", duracao: "60min" },
    { nome: "Botox Facial", preco: "10.000 Esc", duracao: "45min" },
    { nome: "Limpeza de Pele Profunda", preco: "4.500 Esc", duracao: "60min" },
    { nome: "Peeling Químico", preco: "5.500 Esc", duracao: "50min" },
    { nome: "Massagem Relaxante", preco: "3.500 Esc", duracao: "60min" },
    { nome: "Drenagem Linfática", preco: "4.000 Esc", duracao: "60min" },
    { nome: "Tratamento Anti-Aging", preco: "7.000 Esc", duracao: "75min" },
  ]

  const horariosDisponiveis = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  const criarNovoAgendamento = () => {
    if (
      !novoAgendamento.nome ||
      !novoAgendamento.telefone ||
      !novoAgendamento.servico ||
      !novoAgendamento.data ||
      !novoAgendamento.horario
    ) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    const servicoSelecionado = servicosDisponiveis.find((s) => s.nome === novoAgendamento.servico)

    const novoId = String(agendamentos.length + 1).padStart(3, "0")
    const agendamentoCriado: Agendamento = {
      id: novoId,
      cliente: novoAgendamento.nome,
      email: novoAgendamento.email || "N/A",
      telefone: novoAgendamento.telefone,
      servico: novoAgendamento.servico,
      data: novoAgendamento.data,
      horario: novoAgendamento.horario,
      preco: servicoSelecionado?.preco || "0 Esc",
      status: "confirmado",
      metodoPagamento:
        novoAgendamento.metodoPagamento === "dinheiro"
          ? "Dinheiro"
          : novoAgendamento.metodoPagamento === "cartao"
            ? "Cartão"
            : "Transferência",
      pago: false,
    }

    setAgendamentos((prev) => [...prev, agendamentoCriado])
    setMostrarNovoAgendamento(false)
    setNovoAgendamento({
      nome: "",
      email: "",
      telefone: "",
      servico: "",
      data: "",
      horario: "",
      metodoPagamento: "dinheiro",
    })
    alert("Agendamento criado com sucesso!")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral/20 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Painel de Agendamentos</h1>
              <p className="text-gray-600">Gerencie todos os agendamentos da clínica</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMostrarNovoAgendamento(true)}
                className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Novo Agendamento
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition"
              >
                Sair
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="text-3xl font-bold text-primary mb-1">{agendamentos.length}</div>
              <div className="text-sm text-gray-600">Total de Agendamentos</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="text-3xl font-bold text-emerald-600 mb-1">
                {agendamentos.filter((a) => a.status === "confirmado").length}
              </div>
              <div className="text-sm text-gray-600">Confirmados</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="text-3xl font-bold text-amber-600 mb-1">
                {agendamentos.filter((a) => a.status === "pendente").length}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-1">{agendamentos.filter((a) => a.pago).length}</div>
              <div className="text-sm text-gray-600">Pagamentos Recebidos</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou telefone..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary transition"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary transition"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="pendente">Pendente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {agendamentosFiltrados.map((agendamento) => (
                <div key={agendamento.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{agendamento.cliente}</h3>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {agendamento.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {agendamento.telefone}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(agendamento.status)}`}
                        >
                          {agendamento.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-lg p-4 mb-3">
                        <div className="font-semibold text-gray-900 mb-2">{agendamento.servico}</div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(agendamento.data).toLocaleDateString("pt-BR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {agendamento.horario}
                          </span>
                          <span className="font-semibold text-primary">{agendamento.preco}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          Pagamento: <span className="font-medium">{agendamento.metodoPagamento}</span>
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            agendamento.pago ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {agendamento.pago ? "PAGO" : "PENDENTE"}
                        </span>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      {agendamento.status === "pendente" && (
                        <button
                          onClick={() => atualizarStatus(agendamento.id, "confirmado")}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center gap-2 text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Confirmar
                        </button>
                      )}
                      {agendamento.status === "confirmado" && (
                        <button
                          onClick={() => atualizarStatus(agendamento.id, "concluido")}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Concluir
                        </button>
                      )}
                      {!agendamento.pago && (
                        <button
                          onClick={() => marcarComoPago(agendamento.id)}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
                        >
                          Marcar como Pago
                        </button>
                      )}
                      {(agendamento.status === "pendente" || agendamento.status === "confirmado") && (
                        <button
                          onClick={() => atualizarStatus(agendamento.id, "cancelado")}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {agendamentosFiltrados.length === 0 && (
                <div className="text-center py-12 text-gray-500">Nenhum agendamento encontrado</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {mostrarNovoAgendamento && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">Novo Agendamento</h2>
                <p className="text-sm text-gray-600">Agende um serviço para o cliente</p>
              </div>
              <button
                onClick={() => setMostrarNovoAgendamento(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={novoAgendamento.nome}
                    onChange={(e) => setNovoAgendamento({ ...novoAgendamento, nome: e.target.value })}
                    placeholder="Digite o nome do cliente"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Opcional)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={novoAgendamento.email}
                      onChange={(e) => setNovoAgendamento({ ...novoAgendamento, email: e.target.value })}
                      placeholder="email@exemplo.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={novoAgendamento.telefone}
                      onChange={(e) => setNovoAgendamento({ ...novoAgendamento, telefone: e.target.value })}
                      placeholder="+238 999 0000"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serviço *</label>
                <select
                  value={novoAgendamento.servico}
                  onChange={(e) => setNovoAgendamento({ ...novoAgendamento, servico: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary transition"
                >
                  <option value="">Selecione um serviço</option>
                  {servicosDisponiveis.map((servico) => (
                    <option key={servico.nome} value={servico.nome}>
                      {servico.nome} - {servico.preco} ({servico.duracao})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={novoAgendamento.data}
                      onChange={(e) => setNovoAgendamento({ ...novoAgendamento, data: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário *</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={novoAgendamento.horario}
                      onChange={(e) => setNovoAgendamento({ ...novoAgendamento, horario: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary transition"
                    >
                      <option value="">Selecione o horário</option>
                      {horariosDisponiveis.map((horario) => (
                        <option key={horario} value={horario}>
                          {horario}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Método de Pagamento</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setNovoAgendamento({ ...novoAgendamento, metodoPagamento: "dinheiro" })}
                    className={`p-4 border-2 rounded-xl text-center transition ${
                      novoAgendamento.metodoPagamento === "dinheiro"
                        ? "border-primary bg-primary/5 text-primary font-semibold"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Dinheiro
                  </button>
                  <button
                    type="button"
                    onClick={() => setNovoAgendamento({ ...novoAgendamento, metodoPagamento: "cartao" })}
                    className={`p-4 border-2 rounded-xl text-center transition ${
                      novoAgendamento.metodoPagamento === "cartao"
                        ? "border-primary bg-primary/5 text-primary font-semibold"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Cartão
                  </button>
                  <button
                    type="button"
                    onClick={() => setNovoAgendamento({ ...novoAgendamento, metodoPagamento: "transferencia" })}
                    className={`p-4 border-2 rounded-xl text-center transition ${
                      novoAgendamento.metodoPagamento === "transferencia"
                        ? "border-primary bg-primary/5 text-primary font-semibold"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Transferência
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setMostrarNovoAgendamento(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={criarNovoAgendamento}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
