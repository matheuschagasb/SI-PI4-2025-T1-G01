
//Victor ramalho - 24007532
"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Toast } from "primereact/toast"
import { Avatar } from "primereact/avatar"
import { Tag } from "primereact/tag"
import Link from "next/link"

type Musico = {
  id: string
  nome: string
  nomeArtistico?: string
  email?: string
  telefone?: string
  generoMusical?: string
  subgenero?: string
  cidade?: string
  estado?: string
  biografia?: string
  rating: number
  reviews: number
  categorias: string[]
  local: string
  preco: string
  fotos: string[]
  descricao: string
  habilidades: string[]
  equipamentos: string[]
  disponibilidade: string[]
}

type Avaliacao = {
  id: string
  nota: number
  comentario: string
  nomeContratante: string
  dataAvaliacao: string
}

export default function Perfil() {
  const { id } = useParams() as { id: string }
  const router = useRouter()

  const [musico, setMusico] = useState<Musico | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dataReserva, setDataReserva] = useState<Date | null>(null)
  const [horaReserva, setHoraReserva] = useState<Date | null>(null)
  const [duracao, setDuracao] = useState<number | null>(null)
  const [localEvento, setLocalEvento] = useState<string>("")
  const [observacoes, setObservacoes] = useState<string>("")

  const toast = useRef<Toast>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

  useEffect(() => {
    async function carregarMusico() {
      try {
        const response = await fetch(`${apiUrl}/v1/musico/${id}`, {
          cache: "no-store",
        })

        if (!response.ok) throw new Error(`Erro ${response.status}`)

        const data = await response.json()

        const allFotos: string[] = []
        if (data.fotoPerfil) allFotos.push(`data:image/jpeg;base64,${data.fotoPerfil}`)
        if (data.fotosBanda && Array.isArray(data.fotosBanda)) {
          data.fotosBanda.forEach((foto: string) => allFotos.push(`data:image/jpeg;base64,${foto}`))
        }

        const musicoData: Musico = {
          id: data.id || id,
          nome: data.nome || data.nomeArtistico || "Músico",
          nomeArtistico: data.nomeArtistico,
          email: data.email,
          telefone: data.telefone,
          generoMusical: data.generoMusical,
          subgenero: data.subgenero,
          cidade: data.cidade,
          estado: data.estado,
          biografia: data.biografia,
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          categorias: data.categorias || [data.generoMusical, data.subgenero].filter(Boolean),
          local: data.local || [data.cidade, data.estado].filter(Boolean).join(", ") || "Brasil",
          preco: data.preco || "250.00",
          fotos: allFotos.length > 0 ? allFotos : data.fotos || [],
          descricao: data.biografia || data.descricao || "Sem descrição disponível",
          habilidades: data.habilidades || [],
          equipamentos: data.equipamentos || [],
          disponibilidade: data.disponibilidade || [],
        }

        setMusico(musicoData)
        setError(null)
      } catch (err: any) {
        console.error("Erro ao carregar músico:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    carregarMusico()
  }, [id])

  useEffect(() => {
    async function carregarAvaliacoes() {
      try {
        const response = await fetch(`${apiUrl}/v1/avaliacoes/musico/${id}`)
        if (response.ok) {
          const data = await response.json()
          setAvaliacoes(data)
        }
      } catch (error) {
        console.error("Erro ao buscar avaliações", error)
      }
    }
    if (id) {
      carregarAvaliacoes()
    }
  }, [id])

  const handleReservar = async () => {
    if (!musico) return

    if (!dataReserva || !horaReserva || duracao === null || localEvento === "") {
      toast.current?.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Preencha todos os campos obrigatórios.",
        life: 5000,
      })
      return
    }

    const authToken = localStorage.getItem("soundbridge/token")
    if (!authToken) {
      toast.current?.show({ severity: "error", summary: "Erro", detail: "Faça login para reservar.", life: 3000 })
      router.push("/Login")
      return
    }

    const dataFormatted = dataReserva.toISOString().split("T")[0]
    const horaFormatted = horaReserva.toTimeString().split(" ")[0].substring(0, 5)

    const payload = {
      musicoId: musico.id,
      data: dataFormatted,
      hora: horaFormatted,
      duracao: duracao,
      localEvento: localEvento,
      observacoes: observacoes,
    }

    try {
      const response = await fetch(`${apiUrl}/v1/contratos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Solicitação enviada!", life: 5000 })
        setDataReserva(null)
        setHoraReserva(null)
        setDuracao(null)
        setLocalEvento("")
        setObservacoes("")
      } else {
        const errorData = await response.json()
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: errorData.message || "Erro ao reservar.",
          life: 5000,
        })
      }
    } catch (apiError) {
      toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro de conexão.", life: 5000 })
    }
  }

  const formatarData = (dataISO: string) => {
    if (!dataISO) return ""
    return new Date(dataISO).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-gray-600 text-lg">Carregando...</div>
      </div>
    )
  if (!musico)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-gray-600 text-lg">Músico não encontrado.</div>
      </div>
    )

  const mediaNotas =
    avaliacoes.length > 0 ? avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) / avaliacoes.length : 5

  return (
    <div className="min-h-screen bg-white">
      <Toast ref={toast} />
 <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
            <Link href="/Home" className="text-2xl font-bold text-blue-600 no-underline hover:text-blue-700 transition-colors">
              SoundBridge
            </Link>

                            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700 hidden sm:block"></span>
              
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors" title="Idioma">
                <i className="pi pi-globe text-xl"></i>
              </button>
              
              <Link href="/Contratante">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 pr-2 rounded-full border border-gray-200 transition-all shadow-sm hover:shadow-md">
                  <i className="pi pi-bars text-lg ml-2 text-gray-600"></i>
                  <Avatar icon="pi pi-user" shape="circle" className="bg-blue-600 text-white" />
                </div>
              </Link>
            </div>
            
            </header>
      {/* Header Simples */}
<div className=" border-gray-200">
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900">{musico.nome}</h1>
        
        {/* Linha de detalhes (Avaliação, Tags, Local) */}
        <div className="flex flex-wrap items-center gap-3 text-slate-600 mt-2">
            
            {/* Avaliação */}
            <div className="flex items-center gap-1">
                <i className="pi pi-star-fill text-yellow-500"></i>
                <span className="font-semibold text-gray-900">{mediaNotas.toFixed(1)}</span>
                <span className="text-gray-500">({avaliacoes.length} avaliações)</span>
            </div>
            
            <span className="text-slate-300">•</span>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                {musico.categorias.map((c, i) => (
                    <Tag key={i} value={c} className="bg-blue-50 text-blue-700 border-0 px-2 py-1" />
                ))}
            </div>
            
            <span className="text-slate-300">•</span>
            
            {/* Local */}
            <span className="flex items-center gap-2 text-sm">
                <i className="pi pi-map-marker text-slate-500" />
                {musico.local}
            </span>
        </div>
    </div>
</div>

      {/* Galeria de Fotos - Grid Layout Simples */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-96">
          {/* Foto Principal - Grande */}
          <div className="md:col-span-2 md:row-span-2 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={musico.fotos[0] || "/placeholder.svg?height=400&width=600&query=musician"}
              alt="Foto Principal"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Fotos Menores */}
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={musico.fotos[idx] || "/placeholder.svg?height=200&width=300&query=musician"}
                alt={`Foto ${idx}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Sobre o Músico */}
            <div className="border border-gray-200 rounded-lg p-8 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre o Artista</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{musico.descricao}</p>
            </div>

            {/* Avaliações */}
            <div className="border border-gray-200 rounded-lg p-8 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Avaliações <span className="text-gray-400 text-base font-normal">({avaliacoes.length})</span>
                </h2>
                <div className="flex items-center gap-2">
                  <i className="pi pi-star-fill text-yellow-500 text-xl"></i>
                  <span className="text-2xl font-bold text-gray-900">{mediaNotas.toFixed(1)}</span>
                </div>
              </div>

              {avaliacoes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <i className="pi pi-comments text-4xl text-gray-300 mb-2 block"></i>
                  <p className="text-gray-500">Este artista ainda não possui avaliações.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {avaliacoes.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <Avatar
                          label={review.nomeContratante.charAt(0).toUpperCase()}
                          size="large"
                          shape="circle"
                          className="bg-blue-100 text-blue-600 font-bold flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900">{review.nomeContratante}</h4>
                              <span className="text-xs text-gray-500">{formatarData(review.dataAvaliacao)}</span>
                            </div>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`pi ${i < review.nota ? "pi-star-fill" : "pi-star"} text-yellow-500 text-sm`}
                                ></i>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 mt-2 text-sm">"{review.comentario}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita - Card de Reserva */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm">
                <div className="mb-6">
                  <p className="text-gray-500 text-sm mb-1">Valor por hora</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">R$ {musico.preco}</span>
                    <span className="text-gray-500">/hora</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Data do Evento</label>
                    <Calendar
                      value={dataReserva}
                      onChange={(e) => setDataReserva(e.value as Date)}
                      showIcon
                      className="w-full text-sm"
                      placeholder="Selecione a data"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Hora</label>
                      <Calendar
                        value={horaReserva}
                        onChange={(e) => setHoraReserva(e.value as Date)}
                        timeOnly
                        showIcon
                        className="w-full text-sm"
                        placeholder="00:00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Duração</label>
                      <InputNumber
                        value={duracao}
                        onValueChange={(e) => setDuracao(e.value)}
                        min={1}
                        max={12}
                        showButtons
                        className="w-full text-sm"
                        suffix=" h"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Local do Evento</label>
                    <InputText
                      value={localEvento}
                      onChange={(e) => setLocalEvento(e.target.value)}
                      className="w-full text-sm"
                      placeholder="Endereço ou descrição"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Observações</label>
                    <InputTextarea
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      rows={3}
                      className="w-full text-sm"
                      placeholder="Detalhes adicionais..."
                    />
                  </div>
                </div>

                <Button
                  label="Solicitar Reserva"
                  icon="pi pi-check-circle"
                  className="w-full !bg-blue-500 hover:!bg-blue-600 px-4 rounded-2xl !text-white font-bold !border-0 py-3 transition-colors"
                  onClick={handleReservar}
                />

                <div className="text-center text-xs text-gray-500 mt-4">
                  Você não será cobrado agora. O artista confirmará sua solicitação.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
