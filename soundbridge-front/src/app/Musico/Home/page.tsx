// Matheus Chagas - 24015048
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar } from 'primereact/avatar';

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

    // Converte o formato vindo da API para o formato usado na tela
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
            // aqui status 'CONFIRMADO' da API vira booleano contratoAtivo
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
                // erro detalhado caso backend não responda 2xx
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
                
                // Se não tiver id/token, volta para login
                if (!id || !token) {
                    console.error("Musician ID or token not found in localStorage. Redirecting to login.");
                    router.push('/Login');
                    return;
                }

                if (nomeArmazenado) {
                    setNomeMusico(nomeArmazenado);
                } else {
                    // Se o nome não estiver em cache, busca do backend e salva no localStorage
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

    // Decide qual ícone mostrar dependendo se o contrato está ativo ou não
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
                <Link href="#" className="text-2xl font-bold text-blue-600 no-underline hover:text-blue-700 transition-colors">
                    SoundBridge
                </Link>

                <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-700 hidden sm:block"></span>
                    
                    <button
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        title="Idioma"
                    >
                        <i className="pi pi-globe text-xl"></i>
                    </button>
                    
                    <Link href="/Musico/Editar">
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 pr-2 rounded-full border border-gray-200 transition-all shadow-sm hover:shadow-md">
                            <i className="pi pi-bars text-lg ml-2 text-gray-600"></i>
                            <Avatar icon="pi pi-user" shape="circle" className="bg-blue-600 text-white" />
                        </div>
                    </Link>
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
                                    <p className="text-sm text-gray-700">
                                        {contrato.dataPagamento ? formatarData(contrato.dataPagamento) : 'N/A'}
                                    </p>
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