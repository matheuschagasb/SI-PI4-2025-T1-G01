'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';

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
  precoHora: number;
  fotos: string[];
  descricao: string;
  habilidades: string[];
  equipamentos: string[];
  disponibilidade: string[];
};

type Avaliacao = {
  nome: string;
  data: string;
  texto: string;
};

export default function Perfil() {
  const { id } = useParams() as { id: string };

  const [musico, setMusico] = useState<Musico | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dataReserva, setDataReserva] = useState<Date | null>(null);
  const [horaReserva, setHoraReserva] = useState<Date | null>(null);
  const [calendarioInline, setCalendarioInline] = useState<Date | null>(new Date());

  // Fetch dados do backend com fallback para mock
  useEffect(() => {
    async function carregarMusico() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/v1/musico/${id}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Mapear dados do backend para o formato da UI
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
          rating: data.rating || 4.5,
          reviews: data.reviews || 0,
          categorias: data.categorias || [data.generoMusical, data.subgenero].filter(Boolean),
          local: data.local || `${data.cidade}, ${data.estado}` || 'Brasil',
          precoHora: data.precoHora || 250,
          fotos: data.fotos || [],
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
        
        // Fallback para dados mock em caso de erro
        const demo: Musico = {
          id: id ?? '1',
          nome: 'Thiago Marques',
          nomeArtistico: 'Thiago Marques',
          rating: 4.83,
          reviews: 450,
          categorias: ['Acústico', 'Casamentos', 'Pop/Rock', 'Eventos', 'MPB'],
          local: 'Campinas, São Paulo - Brasil',
          cidade: 'Campinas',
          estado: 'São Paulo',
          generoMusical: 'MPB',
          subgenero: 'Samba',
          precoHora: 250,
          fotos: [
            '/images/hero.jpg',
            '/images/thumb-1.jpg',
            '/images/thumb-2.jpg',
            '/images/thumb-3.jpg',
            '/images/thumb-4.jpg'
          ],
          descricao:
            'Sou Thiago Marques, cantor e violonista apaixonado por Música Popular Brasileira. Meu repertório passeia por nomes como Djavan, Caetano Veloso, Gilberto Gil e outros grandes artistas que fazem parte da história da música brasileira. Atuo em bares, restaurantes e eventos particulares, sempre buscando criar um clima acolhedor e agradável com uma apresentação leve e cheia de emoção. Trabalho com voz e violão em formato solo ou duo acústico, oferecendo uma experiência musical autêntica e próxima do público.',
          biografia:
            'Sou Thiago Marques, cantor e violonista apaixonado por Música Popular Brasileira. Meu repertório passeia por nomes como Djavan, Caetano Veloso, Gilberto Gil e outros grandes artistas que fazem parte da história da música brasileira.',
          habilidades: [
            'Voz e Violão',
            'Pop, Rock, MPB e Internacional',
            'Set acústico / pocket show',
            'Repertório sob medida'
          ],
          equipamentos: ['Som próprio', 'Microfones', 'Iluminação básica'],
          disponibilidade: ['Sex à noite', 'Sáb à tarde e noite', 'Dom à tarde']
        };
        setMusico(demo);
      } finally {
        setLoading(false);
      }
    }

    carregarMusico();
  }, [id]);

  // Mock de avaliações - futuramente virá de /v1/musico/${id}/avaliacoes
  const avaliacoes: Avaliacao[] = [
    { nome: 'Mikasa', data: 'Abril 2025', texto: 'Thiago tem uma voz incrível e um repertório de muito bom gosto. A noite ficou perfeita com o show dele.' },
    { nome: 'Eren', data: 'Abril 2025', texto: 'Excelente profissional, pontual e super simpático com o público.' },
    { nome: 'Gaby', data: 'Abril 2025', texto: 'Repertório variado e execução impecável. Recomendamos sempre no nosso bar.' },
    { nome: 'Hang', data: 'Abril 2025', texto: 'Músico de qualidade e presença de palco cativante. Todo mundo elogiou!' },
    { nome: 'Low Tha Khong', data: 'Abril 2025', texto: 'Além de cantar muito bem, sabe como envolver o público sem exageros.' },
    { nome: 'Samuel', data: 'Abril 2025', texto: 'Som agradável, repertório equilibrado e uma vibe muito boa. Voltaremos a contratar.' },
  ];

  const handleReservar = () => {
    if (!dataReserva || !horaReserva) {
      alert('Por favor, selecione data e horário para continuar.');
      return;
    }
    console.log('Reserva solicitada:', { musicoId: id, dataReserva, horaReserva });
    // Futuramente: navegar para página de checkout ou abrir modal de confirmação
    alert(`Reserva solicitada para ${musico?.nome} em ${dataReserva.toLocaleDateString()} às ${horaReserva.toLocaleTimeString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Card className="shadow-sm">
          <div className="h-40 animate-pulse bg-slate-100 rounded-lg" />
          <div className="mt-4 space-y-3">
            <div className="h-6 animate-pulse bg-slate-100 rounded w-1/3" />
            <div className="h-4 animate-pulse bg-slate-100 rounded w-2/3" />
          </div>
        </Card>
      </div>
    );
  }

  if (!musico) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Card className="shadow-sm text-center py-10">Músico não encontrado.</Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Aviso de fallback (apenas para desenvolvimento) */}
      {error && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <strong>Modo desenvolvimento:</strong> Exibindo dados de exemplo. Erro ao conectar com backend: {error}
        </div>
      )}

      {/* Título + meta */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold">{musico.nome}</h1>

        <div className="flex flex-wrap items-center gap-3 text-slate-600 mt-2">
          <div className="flex items-center gap-2">
            <Rating value={musico.rating} readOnly cancel={false} />
            <span className="text-sm">{musico.rating.toFixed(2)} · {musico.reviews} avaliações</span>
          </div>

          <span className="text-slate-300">•</span>

          <div className="flex flex-wrap gap-2">
            {musico.categorias.map((c, i) => (
              <Tag key={i} value={c} className="bg-slate-100 text-slate-700 border-0 px-2 py-1" />
            ))}
          </div>

          <span className="text-slate-300">•</span>

          <span className="flex items-center gap-2 text-sm">
            <i className="pi pi-map-marker text-slate-500" />
            {musico.local}
          </span>
        </div>
      </div>

      {/* Galeria */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="col-span-3 md:col-span-2 row-span-2">
          <img
            src={musico.fotos[0]}
            alt={`${musico.nome} - principal`}
            className="w-full h-72 md:h-96 object-cover rounded-xl shadow-sm"
          />
        </div>
        {musico.fotos.slice(1).map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`${musico.nome} - ${idx + 2}`}
            className="w-full h-32 md:h-44 object-cover rounded-xl shadow-sm"
          />
        ))}
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna esquerda */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-600">
                <Rating value={musico.rating} readOnly cancel={false} />
                <span className="text-sm">{musico.rating.toFixed(2)} · {musico.reviews} avaliações</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-2 text-sm">
                  <i className="pi pi-map-marker text-slate-500" /> {musico.local}
                </span>
              </div>

              <Divider className="my-2" />

              <div>
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-slate-700 leading-relaxed">
                  {musico.descricao}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Habilidades</h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {musico.habilidades.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Equipamentos</h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {musico.equipamentos.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Disponibilidade</h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {musico.disponibilidade.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Avaliações */}
          <Card className="shadow-sm">
            <h2 className="text-xl font-semibold">★ {musico.rating.toFixed(2)} · {musico.reviews} Avaliações</h2>

            <div className="grid md:grid-cols-2 gap-4 mt-3">
              {avaliacoes.map((r, i) => (
                <div key={i} className="flex gap-3 p-3 border rounded-xl">
                  <Avatar label={r.nome.charAt(0)} className="bg-slate-200 text-slate-700" shape="circle" />
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <strong className="text-slate-800">{r.nome}</strong>
                      <span className="text-slate-400">{r.data}</span>
                    </div>
                    <p className="mt-1 text-slate-700">{r.texto}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Button label="Mostrar mais" outlined className="flex-1" />
            </div>
          </Card>
        </div>

        {/* Coluna direita (reserva) */}
        <div className="lg:col-span-1">
          <div className="space-y-4 lg:sticky lg:top-6">
            <Card className="shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-bold">R${musico.precoHora}<span className="text-sm font-medium text-slate-500">/hora</span></div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <Rating value={musico.rating} readOnly cancel={false} />
                    <span>{musico.rating.toFixed(2)} · {musico.reviews} avaliações</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Data</label>
                  <Calendar value={dataReserva} onChange={(e) => setDataReserva(e.value as Date)} showIcon className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Hora</label>
                  <Calendar value={horaReserva} onChange={(e) => setHoraReserva(e.value as Date)} timeOnly showIcon hourFormat="24" className="w-full" />
                </div>
              </div>

              <Button label="Reservar" className="w-full mt-3" onClick={handleReservar} />
              <p className="text-xs text-slate-500 mt-2">
                Total inicial sem descontos. Valores finais podem variar conforme duração e extras.
              </p>
            </Card>

            <Card className="shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <strong>Calendário</strong>
                <div className="flex gap-2">
                  <Button icon="pi pi-chevron-left" rounded text aria-label="Anterior" />
                  <Button icon="pi pi-chevron-right" rounded text aria-label="Próximo" />
                </div>
              </div>
              <Calendar
                inline
                value={calendarioInline}
                onChange={(e) => setCalendarioInline(e.value as Date)}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-slate-600 mt-2">
                <span>Hoje</span>
                <Button label="Limpar" outlined size="small" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}