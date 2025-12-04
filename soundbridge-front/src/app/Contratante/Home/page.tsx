'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import Image from 'next/image';
import { TabView, TabPanel } from 'primereact/tabview';
import Link from 'next/link';

const apiUrl = 'http://localhost:3001';
interface Contrato {
  id: string;
  musico: {
    id: string;
    nome: string;
    biografia: string;
    cidade: string;
    estado: string;
    generoMusical: string;
    email: string;
    telefone: string;
    fotoPerfil: string;
    fotosBanda: string[];
    preco: string;
    chavePix: string;
  };
  contratante: {
    id: string;
    nome: string;
    nomeEstabelecimento: string;
    fotoPerfil: string;
  };
  dataEvento: string;
  duracao: number;
  valorTotal: number;
  status: 'PENDENTE' | 'CONFIRMADO' | 'CONCLUIDO';
  localEvento: string;
  observacoes: string;
  dataPagamento: string | null;
  comprovantePagamentoUrl: string | null;
}

export default function ContratanteHomePage() {
    const [contratos, setContratos] = useState<Contrato[]>([]);
    const [loading, setLoading] = useState(true);
    const [nomeContratante, setNomeContratante] = useState<string>('');
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

    const fetchContracts = async (authToken: string) => {
        try {
            const response = await fetch(`${apiUrl}/v1/contratos/contratante`, {
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
            setContratos(fetchedContratos);

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
                    console.error("Contratante ID or token not found in localStorage. Redirecting to login.");
                    router.push('/Login');
                    return;
                }

                if (nomeArmazenado) {
                    setNomeContratante(nomeArmazenado);
                }

                await fetchContracts(token);
                
            } catch (error) {
                console.error('Erro ao carregar contratos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handlePagar = async (contratoId: string) => {
        const token = localStorage.getItem('soundbridge/token');
        if (!token) {
            router.push('/Login');
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/v1/contratos/${contratoId}/confirmar-pagamento`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao processar pagamento.');
            }

            alert('Pagamento confirmado com sucesso!');
            await fetchContracts(token); // Refresh contracts
        } catch (error: any) {
            console.error("Payment error:", error);
            alert(`Erro no pagamento: ${error.message}`);
        }
    };

    const formatarData = (dataISO: string) => {
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusIcon = (status: Contrato['status']) => {
        switch (status) {
            case 'CONFIRMADO':
                return '/icons/check-verde.svg';
            case 'PENDENTE':
                return '/icons/pendente.svg';
            case 'CONCLUIDO':
                return '/icons/check-verde.svg'; // Or another icon for concluded
            default:
                return '/icons/pendente.svg';
        }
    };

    const filteredContracts = (status: Contrato['status']) => {
        return contratos.filter(c => c.status === status);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    const renderContratoCard = (contrato: Contrato) => (
        <div
            key={contrato.id}
            className="flex items-center gap-6 px-6 py-4 bg-gray-50 rounded-lg border border-gray-200 mb-4"
        >
            <div className="flex flex-col items-center gap-1">
                <Image
                    src={getStatusIcon(contrato.status)}
                    alt={contrato.status}
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
                <p className="text-sm text-gray-700">{contrato.musico.nome}</p>
            </div>

            <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Data do Evento</p>
                <p className="text-sm text-gray-700">{formatarData(contrato.dataEvento)}</p>
            </div>
            
            <div className="flex-[2]">
                <p className="text-xs text-gray-500 mb-1">Local</p>
                <p className="text-sm text-gray-700">{contrato.localEvento}</p>
            </div>

            <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Valor</p>
                <p className="text-sm text-gray-700">R$ {contrato.valorTotal.toFixed(2)}</p>
            </div>

            {contrato.status === 'PENDENTE' && (
                <Button
                    label="Pagar"
                    onClick={() => handlePagar(contrato.id)}
                    className="p-button-success"
                    style={{
                        background: '#28a745',
                        border: 'none',
                        borderRadius: '999px',
                        color: 'white',
                        fontSize: '14px',
                        padding: '8px 16px'
                    }}
                />
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
            <Link href="#" className="text-2xl font-bold text-blue-600 no-underline hover:text-blue-700 transition-colors">
              SoundBridge
            </Link>
                            <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">{nomeContratante}</span>
                    <button className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                        {nomeContratante?.charAt(0) || 'U'}
                    </button>
                </div>
            </header>

            <main className="px-8 py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Meus Contratos</h2>

                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="Pendentes">
                        {filteredContracts('PENDENTE').length > 0 ? (
                           filteredContracts('PENDENTE').map(renderContratoCard)
                        ) : <p>Nenhum contrato pendente.</p>}
                    </TabPanel>
                    <TabPanel header="Confirmados">
                        {filteredContracts('CONFIRMADO').length > 0 ? (
                           filteredContracts('CONFIRMADO').map(renderContratoCard)
                        ) : <p>Nenhum contrato confirmado.</p>}
                    </TabPanel>
                    <TabPanel header="Concluídos">
                        {filteredContracts('CONCLUIDO').length > 0 ? (
                           filteredContracts('CONCLUIDO').map(renderContratoCard)
                        ) : <p>Nenhum contrato concluído.</p>}
                    </TabPanel>
                </TabView>
            </main>
        </div>
    );
}
