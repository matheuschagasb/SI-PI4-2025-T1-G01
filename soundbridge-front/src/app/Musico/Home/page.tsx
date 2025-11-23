'use client';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

interface Musician {
    id: string;
    cpf: string;
    nome: string;
    email: string;
    biografia: string;
    genero: string;
    generoMusical: string;
    senha: string;
    chavePix: string;
    telefone: string;
}

export default function MusicoHomePage() {
    const [musicianData, setMusicianData] = useState<Musician | null>(null);
    const [originalMusicianData, setOriginalMusicianData] = useState<Musician | null>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchMusicianData = async () => {
        setLoading(true);
        try {
            const id = localStorage.getItem('soundbridge/id');
            const response = await fetch(`http://localhost:8080/v1/musico/${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch musician data. Status: ${response.status}`);
            }
            
            const responseText = await response.text();
            try {
                const data = JSON.parse(responseText);
                setMusicianData(data);
                setOriginalMusicianData(data);
            } catch (parseError) {
                throw new Error("Failed to parse JSON response.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMusicianData();
    }, []);

    const handleChange = (field: keyof Musician, value: any) => {
        setMusicianData((prevData) => (prevData ? { ...prevData, [field]: value } : null));
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setMusicianData(originalMusicianData);
        setEditing(false);
    };

    const handleSave = async () => {
        if (!musicianData) return;
        try {
            const response = await fetch(`http://localhost:8080/v1/musico/${musicianData.cpf}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(musicianData),
            });

            if (!response.ok) {
                throw new Error("Failed to save musician data.");
            }

            const updatedData = await response.json();
            setOriginalMusicianData(updatedData);
            setMusicianData(updatedData);
            setEditing(false);
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    const genres = [
        { label: 'Rock', value: 'Rock' },
        { label: 'Pop', value: 'Pop' },
        { label: 'Jazz', value: 'Jazz' },
        { label: 'Clássica', value: 'Classica' },
        { label: 'Sertanejo', value: 'Sertanejo' },
        { label: 'Funk', value: 'Funk' },
        { label: 'Eletrônica', value: 'Eletronica' },
        { label: 'Hip Hop', value: 'Hiphop' },
        { label: 'Reggae', value: 'Reggae' },
    ];

    const genders = [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' },
    ];

    const inputClass = 'w-full h-10 px-4 border border-gray-200 rounded-[999px] text-[12px] focus:border-blue-400 focus:ring-0';
    const inputStyle = { boxShadow: 'none', backgroundColor: '#fafafa' };
    const disabledInputStyle = { boxShadow: 'none', backgroundColor: '#f0f0f0', color: '#6c757d' };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ProgressSpinner />
            </div>
        );
    }
    
    if (!musicianData) {
        return <div className="flex justify-center items-center min-h-screen">Error: Musician not found.</div>
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-white p-8">
            <div className="w-full max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Avatar label={musicianData.nome?.charAt(0) || 'U'} size='xlarge' className='p-overlay-badge mr-4' />
                        <div>
                            <p className='text-xl font-bold'>{musicianData.nome}</p>
                            <p className='text-sm text-gray-500'>{musicianData.email}</p>
                        </div>
                    </div>
                    {!editing && <Button 
                                    label='Editar' 
                                    severity="info" 
                                    icon='pi pi-pencil' 
                                    onClick={handleEdit} 
                                    className="py-2 px-4" 
                                    style={{ background: '#1379E6', border: 'none', borderRadius: '999px', color: 'white' }} 
                                />}
                    {editing && (
                        <div className="flex gap-2">
                            <Button 
                                label='Salvar' 
                                icon='pi pi-check' 
                                onClick={handleSave} 
                                className="py-2 px-4" 
                                style={{ background: '#28a745', border: 'none', borderRadius: '999px', color: 'white' }} />
                            <Button 
                                label='Cancelar' 
                                icon='pi pi-times' 
                                severity="secondary"
                                onClick={handleCancel} 
                                className="py-2 px-4" 
                                style={{ background: '#6c757d', border: 'none', borderRadius: '999px', color: 'white' }} />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="nome">Nome Artístico</label>
                        <InputText 
                            id="nome" 
                            value={musicianData.nome} 
                            onChange={(e) => handleChange('nome', e.target.value)} 
                            disabled={!editing} 
                            className={inputClass} 
                            style={!editing ? disabledInputStyle : inputStyle} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="cpf">CPF</label>
                        <InputText 
                            id="cpf" 
                            value={musicianData.cpf} 
                            onChange={(e) => handleChange('cpf', e.target.value)} 
                            disabled={!editing} 
                            className={inputClass} 
                            style={!editing ? disabledInputStyle : inputStyle} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="genero">Gênero</label>
                        <Dropdown 
                            id="genero" 
                            value={musicianData.genero} 
                            options={genders} 
                            onChange={(e) => handleChange('genero', e.value)} 
                            placeholder="Selecione o gênero" 
                            disabled={!editing} 
                            className={inputClass} 
                            panelClassName="text-[12px]" 
                            style={!editing ? disabledInputStyle : inputStyle} />
                    </div>
                    
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label htmlFor="biografia">Biografia</label>
                        <InputTextarea 
                            id="biografia" 
                            value={musicianData.biografia} 
                            onChange={(e) => handleChange('biografia', e.target.value)} 
                            rows={4} autoResize disabled={!editing} 
                            className="w-full px-4 border border-gray-200 rounded-[20px] text-[12px] focus:border-blue-400 focus:ring-0" 
                            style={!editing ? disabledInputStyle : inputStyle} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="generoMusical">Estilos Musicais</label>
                        <Dropdown 
                            id="generoMusical" 
                            value={musicianData.generoMusical} 
                            options={genres} 
                            onChange={(e) => handleChange('generoMusical', e.value)} 
                            placeholder="Selecione seu estilo" disabled={!editing} 
                            className={inputClass} panelClassName="text-[12px]" 
                            style={!editing ? disabledInputStyle : inputStyle} />
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <h2 className="text-lg font-semibold mb-4 border-t pt-4">Dados da Conta</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email">Email</label>
                                <InputText 
                                    id="email" 
                                    value={musicianData.email} 
                                    onChange={(e) => handleChange('email', e.target.value)} 
                                    disabled={!editing} 
                                    className={inputClass} 
                                    style={!editing ? disabledInputStyle : inputStyle} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="senha">Senha</label>
                                <Password 
                                    id="senha" 
                                    value={musicianData.senha} 
                                    onChange={(e) => handleChange('senha', e.target.value)} 
                                    disabled={!editing} 
                                    feedback={false} 
                                    toggleMask 
                                    className={inputClass} 
                                    style={!editing ? disabledInputStyle : inputStyle} 
                                    inputStyle={{width: '100%'}}/>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="chavePix">Chave PIX</label>
                                <InputText 
                                    id="chavePix" 
                                    value={musicianData.chavePix} 
                                    onChange={(e) => handleChange('chavePix', e.target.value)} 
                                    disabled={!editing} 
                                    className={inputClass} 
                                    style={!editing ? disabledInputStyle : inputStyle} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
