'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import Image from 'next/image';

interface Contrato {
    id: string;
    musicoId: string;
    contratanteId: string;
    nomeMusico: string;
    nomeContratante: string;
    localApresentacao: string;
    dataPagamento: string;
    dataServico: string;
    contratoAtivo: boolean;
    valorContrato: number;
    horasDuracao: number;
    comprovantePagamento: string | null;
}

export default function MusicoHomePage() {
    const [contratos, setContratos] = useState<Contrato[]>([]);
    const [loading, setLoading] = useState(true);
    const [nomeMusico, setNomeMusico] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const id = localStorage.getItem('soundbridge/id');
                const nomeArmazenado = localStorage.getItem('soundbridge/nome');
                
                if (nomeArmazenado) {
                    setNomeMusico(nomeArmazenado);
                } else {
                    // Buscar nome do músico se não estiver no localStorage
                    const responseName = await fetch(`http://localhost:8080/v1/musico/${id}`);
                    if (responseName.ok) {
                        const musicoData = await responseName.json();
                        setNomeMusico(musicoData.nome || 'Músico');
                        localStorage.setItem('soundbridge/nome', musicoData.nome);
                    }
                }

                // TODO: Futuramente substituir por fetch real: GET /v1/contratos?musicoId=${id}
                // Mock de contratos ordenados por dataPagamento (mais recente primeiro)
                const mockContratos: Contrato[] = [
                    {
                        id: '1',
                        musicoId: id || '',
                        contratanteId: 'c1',
                        nomeMusico: 'Thiago Marques',
                        nomeContratante: 'Guilherme Padilha',
                        localApresentacao: 'Avenida Sergio Pique, 324, Campinas',
                        dataPagamento: '2025-10-29',
                        dataServico: '2025-10-30',
                        contratoAtivo: true,
                        valorContrato: 500.00,
                        horasDuracao: 3,
                        comprovantePagamento: 'comprovante_001.pdf'
                    },
                    {
                        id: '2',
                        musicoId: id || '',
                        contratanteId: 'c1',
                        nomeMusico: 'Thiago Marques',
                        nomeContratante: 'Guilherme Padilha',
                        localApresentacao: 'Avenida Sergio Pique, 324, Campinas',
                        dataPagamento: '2025-10-26',
                        dataServico: '2025-10-27',
                        contratoAtivo: true,
                        valorContrato: 500.00,
                        horasDuracao: 3,
                        comprovantePagamento: 'comprovante_002.pdf'
                    },
                    {
                        id: '3',
                        musicoId: id || '',
                        contratanteId: 'c1',
                        nomeMusico: 'Thiago Marques',
                        nomeContratante: 'Guilherme Padilha',
                        localApresentacao: 'Avenida Sergio Pique, 324, Campinas',
                        dataPagamento: '2025-10-18',
                        dataServico: '2025-10-19',
                        contratoAtivo: true,
                        valorContrato: 500.00,
                        horasDuracao: 3,
                        comprovantePagamento: 'comprovante_003.pdf'
                    },
                    {
                        id: '4',
                        musicoId: id || '',
                        contratanteId: 'c1',
                        nomeMusico: 'Thiago Marques',
                        nomeContratante: 'Guilherme Padilha',
                        localApresentacao: 'Avenida Sergio Pique, 324, Campinas',
                        dataPagamento: '2025-10-14',
                        dataServico: '2025-10-15',
                        contratoAtivo: false,
                        valorContrato: 500.00,
                        horasDuracao: 3,
                        comprovantePagamento: null
                    }
                ];

                // Ordenar por dataPagamento decrescente
                const sorted = mockContratos.sort((a, b) => 
                    new Date(b.dataPagamento).getTime() - new Date(a.dataPagamento).getTime()
                );
                
                setContratos(sorted);
            } catch (error) {
                console.error('Erro ao carregar contratos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEditarPerfil = () => {
        router.push('/Musico/Editar');
    };

    const formatarData = (dataISO: string) => {
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR');
    };

    const getStatusIcon = (contrato: Contrato) => {
        if (contrato.contratoAtivo && contrato.comprovantePagamento) {
            return '/icons/check-verde.svg';
        }
        return '/icons/pendente.svg';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-[#1379E6]">SoundBridge</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">{nomeMusico}</span>
                    <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Image src="/icons/details/menu.png" alt="Menu" width={20} height={20} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                        {nomeMusico?.charAt(0) || 'U'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Contratos</h2>
                    <Button
                        label="Editar"
                        icon="pi pi-pencil"
                        onClick={handleEditarPerfil}
                        className="py-2 px-6"
                        style={{
                            background: '#1379E6',
                            border: 'none',
                            borderRadius: '999px',
                            color: 'white',
                            fontSize: '14px'
                        }}
                    />
                </div>

                {/* Lista de Contratos */}
                <div className="flex flex-col gap-4">
                    {contratos.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Nenhum contrato encontrado.</p>
                    ) : (
                        contratos.map((contrato) => (
                            <div
                                key={contrato.id}
                                className="flex items-center gap-6 px-6 py-4 bg-green-50 rounded-lg border border-green-100"
                            >
                                {/* Ícones de Status */}
                                <div className="flex flex-col items-center gap-1">
                                    <Image
                                        src={getStatusIcon(contrato)}
                                        alt="Status"
                                        width={24}
                                        height={24}
                                    />
                                    <Image
                                        src="/icons/contrato.svg"
                                        alt="Contrato"
                                        width={20}
                                        height={20}
                                    />
                                </div>

                                {/* Músico */}
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">Músico</p>
                                    <p className="text-sm text-gray-700">{contrato.nomeMusico}</p>
                                </div>

                                {/* Data do pagamento */}
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">Data do pagamento:</p>
                                    <p className="text-sm text-gray-700">{formatarData(contrato.dataPagamento)}</p>
                                </div>

                                {/* Local da apresentação */}
                                <div className="flex-[2]">
                                    <p className="text-xs text-gray-500 mb-1">Local da apresentação</p>
                                    <p className="text-sm text-gray-700">{contrato.localApresentacao}</p>
                                </div>

                                {/* Nome do contratante */}
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">Nome do contratante</p>
                                    <p className="text-sm text-gray-700">{contrato.nomeContratante}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
