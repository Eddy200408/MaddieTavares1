'use client'

import { useEffect, useState, useMemo } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import api from '@/lib/api'
import { 
  Calendar, Clock, Star, XCircle, UserCircle, 
  LogOut, Loader2, History, MessageSquare, 
  ChevronRight, Settings, CalendarPlus 
} from 'lucide-react'
import Link from 'next/link' 
import { useRouter } from 'next/navigation'

// --- Tipagens ---
interface IAgendamento {
  id: number;
  data_hora_inicio: string;
  feedback_nota?: number;
  Servico: { nome_servico: string, preco: number };
  StatusAgendamento: { nome: string };
  Funcionario: { Usuario: { nome: string } };
}

// --- Sub-componente: Badge de Status ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    confirmado: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cancelado: "bg-red-50 text-red-600 border-red-100",
    pendente: "bg-amber-50 text-amber-600 border-amber-100",
  }
  const current = styles[status as keyof typeof styles] || "bg-gray-50 text-gray-500 border-gray-100"
  
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${current}`}>
      {status}
    </span>
  )
}

// --- Sub-componente: Skeleton Loader ---
const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-3 flex-1">
        <div className="h-4 w-24 bg-gray-100 rounded" />
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="flex gap-4">
          <div className="h-4 w-20 bg-gray-100 rounded" />
          <div className="h-4 w-20 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-10 w-28 bg-gray-100 rounded-xl" />
    </div>
  </div>
)

export default function PerfilPage() {
  const [agendamentos, setAgendamentos] = useState<IAgendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'proximos' | 'historico'>('proximos')
  const [userName, setUserName] = useState('')
  const [feedbackData, setFeedbackData] = useState<{id: number | null, nota: number, comentario: string}>({ 
    id: null, nota: 5, comentario: '' 
  })
  
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('user_name')
    if (!token) { router.push('/login'); return; }
    if (name) setUserName(name)
    fetchAgendamentos()
  }, [])

  const fetchAgendamentos = async () => {
    try {
      const res = await api.get('/cliente/meus-agendamentos')
      setAgendamentos(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error("Erro ao carregar agendamentos")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = async (id: number) => {
    if (!window.confirm("Deseja realmente cancelar este agendamento?")) return
    try {
      await api.patch(`/agendamentos/${id}/cancelar`)
      fetchAgendamentos()
    } catch (err) { alert("Erro ao cancelar.") }
  }

  // Filtragem Otimizada com useMemo
  const agendamentosFiltrados = useMemo(() => {
    const agora = new Date()
    return agendamentos.filter(ag => {
      const dataAg = new Date(ag.data_hora_inicio)
      const isCancelado = ag.StatusAgendamento.nome === 'cancelado'
      return activeTab === 'proximos' 
        ? (dataAg >= agora && !isCancelado) 
        : (dataAg < agora || isCancelado)
    }).sort((a, b) => new Date(a.data_hora_inicio).getTime() - new Date(b.data_hora_inicio).getTime())
  }, [agendamentos, activeTab])

  return (
    <main className="min-h-screen bg-[#fdfbf9] text-slate-900">
      <Navigation blackText />
      
      <div className="max-w-4xl mx-auto pt-32 pb-20 px-6">
        
        {/* PERFIL HEADER */}
        <section className="relative overflow-hidden bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-100/50 mb-10">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <UserCircle size={120} />
          </div>
          
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-gradient-to-br from-[#e1b01a] to-[#c49a16] rounded-full p-0.5 shadow-inner">
                <div className="h-full w-full bg-white rounded-full flex items-center justify-center text-[#e1b01a]">
                   <span className="text-2xl font-serif italic font-bold">{userName.charAt(0)}</span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[#e1b01a] text-xs font-bold uppercase tracking-[0.2em] mb-1">Bem-vinda de volta</p>
                <h1 className="text-3xl font-serif font-medium text-slate-800 tracking-tight">{userName}</h1>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition shadow-sm">
                <Settings size={20} />
              </button>
              <button 
                onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition"
              >
                <LogOut size={16} /> Sair
              </button>
            </div>
          </div>
        </section>

        {/* NAVEGAÇÃO DE TABS */}
        <div className="flex p-1.5 bg-white rounded-2xl border border-gray-100 w-fit mb-12 shadow-sm">
          {[
            { id: 'proximos', label: 'Próximos', icon: Calendar },
            { id: 'historico', label: 'Histórico', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-[#e1b01a] text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* LISTA DE CONTEÚDO */}
        <div className="space-y-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : agendamentosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="bg-orange-50 p-6 rounded-full mb-4 text-[#e1b01a]">
                <CalendarPlus size={40} />
              </div>
              <p className="text-slate-400 font-medium">Não encontramos registos aqui.</p>
              <Link href="/agendar" className="mt-4 px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition">
                Fazer Agendamento
              </Link>
            </div>
          ) : (
            agendamentosFiltrados.map((ag) => (
              <div key={ag.id} className="group bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={ag.StatusAgendamento.nome} />
                      <h3 className="text-xl font-serif font-medium text-slate-800">{ag.Servico.nome_servico}</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-y-2 gap-x-6">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar size={16} className="text-[#e1b01a]" />
                        <span className="capitalize">
                          {new Date(ag.data_hora_inicio).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Clock size={16} className="text-[#e1b01a]" />
                        {new Date(ag.data_hora_inicio).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <UserCircle size={16} className="text-[#e1b01a]" />
                        {ag.Funcionario.Usuario.nome}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                    {activeTab === 'proximos' ? (
                      <button 
                        onClick={() => handleCancelar(ag.id)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all font-bold text-xs uppercase tracking-tighter"
                      >
                        <XCircle size={18} /> Cancelar Reserva
                      </button>
                    ) : (
                      ag.feedback_nota ? (
                        <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-6 py-3 rounded-2xl text-xs font-bold border border-amber-100">
                          <Star size={16} fill="currentColor" /> {ag.feedback_nota}/5 Avaliado
                        </div>
                      ) : (
                        ag.StatusAgendamento.nome !== 'cancelado' && (
                          <button 
                            onClick={() => setFeedbackData({ ...feedbackData, id: ag.id })}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#e1b01a] text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-yellow-600/20 hover:bg-yellow-600 transition-all"
                          >
                            <MessageSquare size={16} /> Avaliar
                          </button>
                        )
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL DE FEEDBACK REESTILIZADO */}
      {feedbackData.id && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white p-10 rounded-[3rem] max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-1 w-12 bg-slate-100 mx-auto mb-8 rounded-full" />
            <h3 className="text-2xl font-serif font-medium mb-2 text-center text-slate-800">Sua Experiência</h3>
            <p className="text-center text-slate-400 text-sm mb-8">Como se sentiu no seu atendimento?</p>
            
            <div className="flex justify-center gap-3 mb-10 text-amber-300">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setFeedbackData({...feedbackData, nota: n})}>
                  <Star 
                    size={36} 
                    fill={n <= feedbackData.nota ? "currentColor" : "none"} 
                    className={`transition-all ${n <= feedbackData.nota ? "scale-110" : "opacity-30 hover:opacity-100"}`} 
                  />
                </button>
              ))}
            </div>

            <textarea 
              className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] mb-8 text-sm outline-none focus:ring-2 focus:ring-[#e1b01a] transition-all resize-none"
              placeholder="Conte-nos os detalhes..."
              rows={4}
              value={feedbackData.comentario}
              onChange={(e) => setFeedbackData({...feedbackData, comentario: e.target.value})}
            />

            <div className="flex flex-col gap-3">
              <button 
                onClick={async () => {
                   try {
                     await api.post(`/cliente/feedback/${feedbackData.id}`, { nota: feedbackData.nota, comentario: feedbackData.comentario });
                     setFeedbackData({ id: null, nota: 5, comentario: '' });
                     fetchAgendamentos();
                   } catch (e) { alert("Erro ao enviar."); }
                }}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition"
              >
                Enviar Avaliação
              </button>
              <button 
                onClick={() => setFeedbackData({id: null, nota: 5, comentario: ''})} 
                className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}