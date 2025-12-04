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
    dataPagamento: string | null;
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

    const mapAndSetContracts = (fetchedContratos: any[], musicianId: string) => {
        const currentMusicoNome = localStorage.getItem('soundbridge/nome') || 'Músico';

        const contratosFormatados = fetchedContratos.map(contrato => ({
            id: contrato.id,
            musicoId: musicianId,
            contratanteId: contrato.contratante.id,
            nomeMusico: currentMusicoNome,
            nomeContratante: contrato.contratante.nome,
            localApresentacao: contrato.localEvento,
            dataPagamento: contrato.dataPagamento,
            dataServico: contrato.dataEvento,
            contratoAtivo: contrato.status === 'CONFIRMADO',
            valorContrato: contrato.valorTotal,
            horasDuracao: contrato.duracao,
            comprovantePagamento: contrato.comprovantePagamentoUrl,
        }));
        setContratos(contratosFormatados);
    };

    const fetchContracts = async (musicianId: string, authToken: string) => {
        try {
            const apiUrl = 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/v1/contratos?musicoId=${musicianId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch contracts: ${response.status} ${response.statusText}`);
            }

            const fetchedContratos = await response.json();
            mapAndSetContracts(fetchedContratos, musicianId);

        } catch (error: any) {
            console.error("Error fetching contracts:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const id = localStorage.getItem('soundbridge/id');
                const nomeArmazenado = localStorage.getItem('soundbridge/nome');
                const token = localStorage.getItem('soundbridge/token');
                
                if (!id || !token) {
                    console.error("Musician ID or token not found in localStorage. Redirecting to login.");
                    router.push('/Login');
                    return;
                }

                if (nomeArmazenado) {
                    setNomeMusico(nomeArmazenado);
                } else {
                    const responseName = await fetch(`http://localhost:3001/v1/musico/${id}`);
                    if (responseName.ok) {
                        const musicoData = await responseName.json();
                        setNomeMusico(musicoData.nome || 'Músico');
                        localStorage.setItem('soundbridge/nome', musicoData.nome);
                    }
                }

                await fetchContracts(id, token);
                
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
        if (contrato.contratoAtivo) {
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

                <div className="flex flex-col gap-4">
                    {contratos.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Nenhum contrato encontrado.</p>
                    ) : (
                        contratos.map((contrato) => (
                            <div
                                key={contrato.id}
                                className="flex items-center gap-6 px-6 py-4 bg-green-50 rounded-lg border border-green-100"
                            >

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

                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">Músico</p>
                                    <p className="text-sm text-gray-700">{contrato.nomeMusico}</p>
                                </div>

                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">Data do pagamento:</p>
                                    <p className="text-sm text-gray-700">{contrato.dataPagamento ? formatarData(contrato.dataPagamento) : 'N/A'}</p>
                                </div>

                                <div className="flex-[2]">
                                    <p className="text-xs text-gray-500 mb-1">Local da apresentação</p>
                                    <p className="text-sm text-gray-700">{contrato.localApresentacao}</p>
                                </div>

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
