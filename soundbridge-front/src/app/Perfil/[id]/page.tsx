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
  rating: number; // 0..5
  reviews: number;
  categorias: string[];
  local: string;
  precoHora: number;
  fotos: string[]; // [main, ...4 thumbs]
  descricao: string;
  habilidades: string[];
  equipamentos: string[];
  disponibilidade: string[];
};

export default function Perfil() {
  const { id } = useParams() as { id: string };

  const [musico, setMusico] = useState<Musico | null>(null);
  const [loading, setLoading] = useState(true);

  const [dataReserva, setDataReserva] = useState<Date | null>(null);
  const [horaReserva, setHoraReserva] = useState<Date | null>(null);
  const [calendarioInline, setCalendarioInline] = useState<Date | null>(new Date());

  // Troque o mock por sua API: fetch(`/api/musicos/${id}`)
  useEffect(() => {
    const demo: Musico = {
      id: id ?? '1',
      nome: 'Thiago Marques',
      rating: 4.5,
      reviews: 450,
      categorias: ['Acústico', 'Casamentos', 'Pop/Rock', 'Eventos', 'MPB'],
      local: 'Campina do Simão, Paraná - Brasil',
      precoHora: 250,
      fotos: [
        '/images/hero.jpg',
        '/images/thumb-1.jpg',
        '/images/thumb-2.jpg',
        '/images/thumb-3.jpg',
        '/images/thumb-4.jpg'
      ],
      descricao:
        'Repertório versátil, carisma e voz cativante. Atuo em casamentos, eventos corporativos e bares. Equipamento próprio e repertório personalizável conforme o público.',
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
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Card className="shadow-sm">
          <div className="h-40 animate-pulse bg-slate-100 rounded-lg" />
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
              {[
                { nome: 'Mônica', data: 'Mar 2025', texto: 'Voz linda e repertório cativante. Nosso evento ganhou vida!' },
                { nome: 'Diego', data: 'Fev 2025', texto: 'Pontual, atencioso e som de qualidade. Recomendo!' },
                { nome: 'Lary', data: 'Jan 2025', texto: 'Energia lá em cima e repertório na medida.' },
                { nome: 'Ben', data: 'Dez 2024', texto: 'Entrega excelente. Convidados adoraram.' },
                { nome: 'Aparecida', data: 'Dez 2024', texto: 'Organização, simpatia e som agradável. Ótima escolha.' }
              ].map((r, i) => (
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
              <Button label="Ler mais avaliações" outlined className="w-full" />
              <Button label="Adicionar avaliação" outlined className="w-full" />
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

              <Button label="Reservar" className="w-full mt-3" />
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