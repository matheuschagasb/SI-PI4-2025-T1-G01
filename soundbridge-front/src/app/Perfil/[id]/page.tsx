'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Rating } from 'primereact/rating'; // Novo
import { Avatar } from 'primereact/avatar'; // Novo

type Musico = {
  id: string;
  nome: string;
  nomeArtistico?: string;
  email?: string;
  telefone?: string;
  generoMusical?: string;
  subgenero?: string;
  cidade?: string;
  estado?: string;
  biografia?: string;
  rating: number;
  reviews: number;
  categorias: string[];
  local: string;
  preco: string;
  fotos: string[];
  descricao: string;
  habilidades: string[];
  equipamentos: string[];
  disponibilidade: string[];
};

// Atualizado para bater com o DTO do Java
type Avaliacao = {
  id: string;
  nota: number;
  comentario: string;
  nomeContratante: string;
  dataAvaliacao: string;
};

export default function Perfil() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [musico, setMusico] = useState<Musico | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]); // Estado para avaliações
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dataReserva, setDataReserva] = useState<Date | null>(null);
  const [horaReserva, setHoraReserva] = useState<Date | null>(null);
  const [duracao, setDuracao] = useState<number | null>(null);
  const [localEvento, setLocalEvento] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');

  const toast = useRef<Toast>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Carregar Músico
  useEffect(() => {
    async function carregarMusico() {
      try {
        const response = await fetch(`${apiUrl}/v1/musico/${id}`, {
          cache: 'no-store',
        });

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        const data = await response.json();
        
        const allFotos: string[] = [];
        if (data.fotoPerfil) allFotos.push(`data:image/jpeg;base64,${data.fotoPerfil}`);
        if (data.fotosBanda && Array.isArray(data.fotosBanda)) {
          data.fotosBanda.forEach((foto: string) => allFotos.push(`data:image/jpeg;base64,${foto}`));
        }
        
        const musicoData: Musico = {
          id: data.id || id,
          nome: data.nome || data.nomeArtistico || 'Músico',
          nomeArtistico: data.nomeArtistico,
          email: data.email,
          telefone: data.telefone,
          generoMusical: data.generoMusical,
          subgenero: data.subgenero,
          cidade: data.cidade,
          estado: data.estado,
          biografia: data.biografia,
          rating: data.rating || 0, // Será calculado com base nas avaliações reais se quiser
          reviews: data.reviews || 0,
          categorias: data.categorias || [data.generoMusical, data.subgenero].filter(Boolean),
          local: data.local || [data.cidade, data.estado].filter(Boolean).join(', ') || 'Brasil',
          preco: data.preco || '250.00',
          fotos: allFotos.length > 0 ? allFotos : (data.fotos || []),
          descricao: data.biografia || data.descricao || 'Sem descrição disponível',
          habilidades: data.habilidades || [],
          equipamentos: data.equipamentos || [],
          disponibilidade: data.disponibilidade || [],
        };

        setMusico(musicoData);
        setError(null);
      } catch (err: any) {
        console.error('Erro ao carregar músico:', err);
        setError(err.message);
        // Fallback omitido para brevidade, mantenha o seu se quiser
      } finally {
        setLoading(false);
      }
    }

    carregarMusico();
  }, [id]);

  // Carregar Avaliações
  useEffect(() => {
    async function carregarAvaliacoes() {
        try {
            const response = await fetch(`${apiUrl}/v1/avaliacoes/musico/${id}`);
            if (response.ok) {
                const data = await response.json();
                setAvaliacoes(data);
            }
        } catch (error) {
            console.error("Erro ao buscar avaliações", error);
        }
    }
    if (id) {
        carregarAvaliacoes();
    }
  }, [id]);

  const handleReservar = async () => {
    if (!musico) return;

    if (!dataReserva || !horaReserva || duracao === null || localEvento === '') {
      toast.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos obrigatórios.', life: 5000 });
      return;
    }

    const authToken = localStorage.getItem('soundbridge/token');
    if (!authToken) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Faça login para reservar.', life: 3000 });
      router.push('/Login');
      return;
    }

    const dataFormatted = dataReserva.toISOString().split('T')[0];
    const horaFormatted = horaReserva.toTimeString().split(' ')[0].substring(0, 5);

    const payload = {
      musicoId: musico.id,
      data: dataFormatted,
      hora: horaFormatted,
      duracao: duracao,
      localEvento: localEvento,
      observacoes: observacoes,
    };

    try {
      const response = await fetch(`${apiUrl}/v1/contratos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Solicitação enviada!', life: 5000 });
        setDataReserva(null); setHoraReserva(null); setDuracao(null); setLocalEvento(''); setObservacoes('');
      } else {
        const errorData = await response.json();
        toast.current?.show({ severity: 'error', summary: 'Erro', detail: errorData.message || 'Erro ao reservar.', life: 5000 });
      }
    } catch (apiError) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro de conexão.', life: 5000 });
    }
  };

  const formatarData = (dataISO: string) => {
    if(!dataISO) return "";
    return new Date(dataISO).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  if (loading) return <div className="flex justify-center p-10">Carregando...</div>;
  if (!musico) return <div className="flex justify-center p-10">Músico não encontrado.</div>;

  // Calcular média das avaliações reais
  const mediaNotas = avaliacoes.length > 0 
    ? avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) / avaliacoes.length 
    : 5;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Toast ref={toast} />

      {/* Cabeçalho do Perfil */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{musico.nome}</h1>
        <div className="flex flex-wrap items-center gap-3 text-slate-600 mt-2">
            <div className="flex items-center gap-1">
                <i className="pi pi-star-fill text-yellow-500"></i>
                <span className="font-semibold text-gray-900">{mediaNotas.toFixed(1)}</span>
                <span className="text-gray-500">({avaliacoes.length} avaliações)</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex flex-wrap gap-2">
                {musico.categorias.map((c, i) => (
                <Tag key={i} value={c} className="bg-blue-50 text-blue-700 border-0 px-2 py-1" />
                ))}
            </div>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-2 text-sm">
                <i className="pi pi-map-marker text-slate-500" />
                {musico.local}
            </span>
        </div>
      </div>

      {/* Galeria de Fotos */}
      <div className="grid grid-cols-4 gap-2 mb-8 h-96 rounded-xl overflow-hidden">
        <div className="col-span-2 row-span-2 relative">
            <img src={musico.fotos[0] || '/placeholder.jpg'} alt="Principal" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
        </div>
        <div className="col-span-1 row-span-1 relative">
            <img src={musico.fotos[1] || '/placeholder.jpg'} alt="Foto 2" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
        </div>
        <div className="col-span-1 row-span-1 relative">
            <img src={musico.fotos[2] || '/placeholder.jpg'} alt="Foto 3" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
        </div>
        <div className="col-span-1 row-span-1 relative">
            <img src={musico.fotos[3] || '/placeholder.jpg'} alt="Foto 4" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
        </div>
        <div className="col-span-1 row-span-1 relative">
            <img src={musico.fotos[4] || '/placeholder.jpg'} alt="Foto 5" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda: Detalhes e Avaliações */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Sobre */}
          <Card className="shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Sobre o Músico</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {musico.descricao}
            </p>
          </Card>

          {/* Seção de Avaliações */}
          <Card className="shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                    Avaliações <span className="text-gray-400 text-base font-normal">({avaliacoes.length})</span>
                </h3>
                <div className="flex items-center gap-2">
                    <i className="pi pi-star-fill text-yellow-500 text-xl"></i>
                    <span className="text-xl font-bold">{mediaNotas.toFixed(1)}</span>
                </div>
            </div>

            {avaliacoes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <i className="pi pi-comments text-4xl mb-2 opacity-50"></i>
                    <p>Este músico ainda não possui avaliações.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {avaliacoes.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex items-start gap-4">
                                <Avatar 
                                    label={review.nomeContratante.charAt(0).toUpperCase()} 
                                    size="large" 
                                    shape="circle" 
                                    className="bg-blue-100 text-blue-600 font-bold flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{review.nomeContratante}</h4>
                                            <span className="text-xs text-gray-500">{formatarData(review.dataAvaliacao)}</span>
                                        </div>
                                        <Rating value={review.nota} readOnly stars={5} cancel={false} />
                                    </div>
                                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                                        "{review.comentario}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </Card>
        </div>

        {/* Coluna Direita: Card de Reserva (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="shadow-lg border border-gray-200">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">R$ {musico.preco}</span>
                <span className="text-gray-500">/ hora</span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Data</label>
                        <Calendar value={dataReserva} onChange={(e) => setDataReserva(e.value as Date)} showIcon className="w-full p-inputtext-sm" placeholder="Selecione a data" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Hora</label>
                        <Calendar value={horaReserva} onChange={(e) => setHoraReserva(e.value as Date)} timeOnly showIcon className="w-full p-inputtext-sm" placeholder="00:00" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Duração</label>
                        <InputNumber value={duracao} onValueChange={(e) => setDuracao(e.value)} min={1} max={12} showButtons className="w-full p-inputtext-sm" suffix=" h" placeholder="1 h" />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Local</label>
                    <InputText value={localEvento} onChange={(e) => setLocalEvento(e.target.value)} className="w-full p-inputtext-sm" placeholder="Endereço do evento" />
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Observações</label>
                    <InputTextarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={2} className="w-full text-sm" placeholder="Detalhes extras..." />
                </div>

                <Button 
                    label="Solicitar Reserva" 
                    icon="pi pi-check-circle" 
                    className="w-full font-bold mt-2" 
                    onClick={handleReservar}
                />
                
                <div className="text-center text-xs text-gray-400 mt-2">
                    Você não será cobrado agora. O músico precisa aceitar a solicitação.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}