// Marcos Roberto - 24010753
'use client';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRouter } from 'next/navigation';
import AgendaMusico from '../../AgendaMusico'; 

interface Musician {
    id: string;
    cpf: string;
    nome: string;
    email: string;
    biografia: string;
    genero: string;
    generoMusical: string;
    senha: string;
    telefone: string;
    fotoPerfil?: string;
    fotosBanda?: string[];
    preco?: string;
}

export default function MusicoEditarPage() {
    const [musicianData, setMusicianData] = useState<Musician | null>(null);
    // Guarda uma cópia original para poder restaurar ao cancelar edição
    const [originalMusicianData, setOriginalMusicianData] = useState<Musician | null>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchMusicianData = async () => {
        setLoading(true);
        try {
            const id = localStorage.getItem('soundbridge/id');
            const response = await fetch(`http://localhost:3001/v1/musico/${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch musician data. Status: ${response.status}`);
            }

            // Lê a resposta como texto para conseguir tratar erros de JSON inválido
            const responseText = await response.text();
            try {
                const data = JSON.parse(responseText);

                // Converte base64 "cru" em data URL para exibir no <img>/<Avatar>
                if (data.fotoPerfil && !data.fotoPerfil.startsWith('data:')) {
                    data.fotoPerfil = `data:image/jpeg;base64,${data.fotoPerfil}`;
                }
                if (data.fotosBanda && Array.isArray(data.fotosBanda)) {
                    data.fotosBanda = data.fotosBanda
                        .map((photo: string) => {
                            if (photo && !photo.startsWith('data:')) {
                                return `data:image/jpeg;base64,${photo}`;
                            }
                            return photo;
                        })
                        .filter(Boolean);
                }

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

    const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                const base64String = readerEvent.target?.result as string;
                // Atualiza apenas o campo fotoPerfil sem perder o resto dos dados
                setMusicianData((prevData) =>
                    prevData ? { ...prevData, fotoPerfil: base64String } : null
                );
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBandPhotosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            // Converte todos os arquivos selecionados em base64 (data URLs) de forma assíncrona
            const filePromises = Array.from(files).map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (readerEvent) => {
                        resolve(readerEvent.target?.result as string);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(filePromises).then(base64Strings => {
                setMusicianData(prevData => {
                    if (!prevData) return null;
                    const existingPhotos = prevData.fotosBanda || [];
                    return {
                        ...prevData,
                        fotosBanda: [...existingPhotos, ...base64Strings]
                    };
                });
            });
        }
    };

    const handleRemoveBandPhoto = (index: number) => {
        setMusicianData(prevData => {
            if (!prevData || !prevData.fotosBanda) return prevData;
            const newFotos = [...prevData.fotosBanda];
            newFotos.splice(index, 1);
            return { ...prevData, fotosBanda: newFotos };
        });
    };

    const handleChange = (field: keyof Musician, value: any) => {
        setMusicianData((prevData) =>
            prevData ? { ...prevData, [field]: value } : null
        );
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        // Restaura o estado original e sai do modo edição
        setMusicianData(originalMusicianData);
        setEditing(false);
    };

    const handleSave = async () => {
        if (!musicianData) return;

        // Cria uma cópia para poder ajustar apenas o formato enviado à API
        const dataToSend: any = { ...musicianData };

        // Remove o prefixo "data:image..." para enviar apenas o base64 puro à API
        if (dataToSend.fotoPerfil && dataToSend.fotoPerfil.startsWith('data:image')) {
            dataToSend.fotoPerfil = dataToSend.fotoPerfil.split(',')[1];
        }

        if (dataToSend.fotosBanda) {
            dataToSend.fotosBanda = dataToSend.fotosBanda.map((photo: string) => {
                if (photo.startsWith('data:image')) {
                    return photo.split(',')[1];
                }
                return photo;
            });
        }

        try {
            const response = await fetch(`http://localhost:3001/v1/musico/${musicianData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error("Failed to save musician data.");
            }

            const updatedData = await response.json();
            setOriginalMusicianData(updatedData);
            setMusicianData(updatedData);
            setEditing(false);

            // Atualiza o nome salvo na sessão (ex.: header, avatar, etc.)
            localStorage.setItem('soundbridge/nome', updatedData.nome);
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    const handleVoltar = () => {
        router.push('/Musico/Home');
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
                        <div className="relative mr-4">
                            <Avatar 
                                image={musicianData.fotoPerfil}
                                label={musicianData.nome?.charAt(0) || 'U'}
                                size='xlarge'
                                shape="circle"
                                className='p-overlay-badge'
                            />
                            {editing && (
                                <>
                                    <label
                                        htmlFor="profile-image-upload"
                                        className="absolute bottom-0 right-0 cursor-pointer bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                                    >
                                        <i className="pi pi-pencil text-sm"></i>
                                        <input
                                            id="profile-image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfileImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </>
                            )}
                        </div>
                        <div>
                            <p className='text-xl font-bold'>{musicianData.nome}</p>
                            <p className='text-sm text-gray-500'>{musicianData.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!editing && (
                            <>
                                <Button 
                                    label='Voltar' 
                                    icon='pi pi-arrow-left' 
                                    severity="secondary"
                                    onClick={handleVoltar} 
                                    className="py-2 px-4" 
                                    style={{ background: '#6c757d', border: 'none', borderRadius: '999px', color: 'white' }} 
                                />
                                <Button 
                                    label='Editar' 
                                    severity="info" 
                                    icon='pi pi-pencil' 
                                    onClick={handleEdit} 
                                    className="py-2 px-4" 
                                    style={{ background: '#1379E6', border: 'none', borderRadius: '999px', color: 'white' }} 
                                />
                            </>
                        )}
                        {editing && (
                            <>
                                <Button 
                                    label='Salvar' 
                                    icon='pi pi-check' 
                                    onClick={handleSave} 
                                    className="py-2 px-4" 
                                    style={{ background: '#28a745', border: 'none', borderRadius: '999px', color: 'white' }} 
                                />
                                <Button 
                                    label='Cancelar' 
                                    icon='pi pi-times' 
                                    severity="secondary"
                                    onClick={handleCancel} 
                                    className="py-2 px-4" 
                                    style={{ background: '#6c757d', border: 'none', borderRadius: '999px', color: 'white' }} 
                                />
                            </>
                        )}
                    </div>
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
                            style={!editing ? disabledInputStyle : inputStyle}
                        />
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
                            style={!editing ? disabledInputStyle : inputStyle}
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label htmlFor="biografia">Biografia</label>
                        <InputTextarea 
                            id="biografia" 
                            value={musicianData.biografia} 
                            onChange={(e) => handleChange('biografia', e.target.value)} 
                            rows={4}
                            autoResize
                            disabled={!editing} 
                            className="w-full px-4 border border-gray-200 rounded-[20px] text-[12px] focus:border-blue-400 focus:ring-0" 
                            style={!editing ? disabledInputStyle : inputStyle}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="generoMusical">Estilos Musicais</label>
                        <Dropdown 
                            id="generoMusical" 
                            value={musicianData.generoMusical} 
                            options={genres} 
                            onChange={(e) => handleChange('generoMusical', e.value)} 
                            placeholder="Selecione seu estilo"
                            disabled={!editing} 
                            className={inputClass}
                            panelClassName="text-[12px]" 
                            style={!editing ? disabledInputStyle : inputStyle}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="preco">Preço por Hora</label>
                        <InputText
                            id="preco"
                            value={musicianData.preco}
                            onChange={(e) => handleChange('preco', e.target.value)}
                            disabled={!editing}
                            className={inputClass}
                            style={!editing ? disabledInputStyle : inputStyle}
                            placeholder="Ex: 150.00"
                        />
                    </div>
                    <div className="md:col-span-2 mt-4">
                        <h2 className="text-lg font-semibold mb-4 border-t pt-4">Minha Disponibilidade</h2>
                        <AgendaMusico 
                            musicoId={musicianData.id} 
                            isEditing={editing} 
                        />
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
                                    style={!editing ? disabledInputStyle : inputStyle}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="chavePix">Chave PIX</label>
                                <InputText 
                                    id="chavePix" 
                                    value={musicianData.telefone} 
                                    onChange={(e) => handleChange('telefone', e.target.value)} 
                                    disabled={!editing} 
                                    className={inputClass} 
                                    style={!editing ? disabledInputStyle : inputStyle}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <h2 className="text-lg font-semibold mb-4 border-t pt-4">Fotos da Banda</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {musicianData.fotosBanda?.map((photo, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={photo}
                                        alt={`Foto da banda ${index + 1}`}
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                    {editing && (
                                        <Button 
                                            icon="pi pi-times"
                                            rounded
                                            text
                                            severity="danger"
                                            onClick={() => handleRemoveBandPhoto(index)}
                                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-black/50"
                                        />
                                    )}
                                </div>
                            ))}
                            {editing && (
                                <label
                                    htmlFor="band-photos-upload"
                                    className="cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-500"
                                >
                                    <i className="pi pi-plus text-2xl"></i>
                                    <span>Adicionar Fotos</span>
                                    <input
                                        id="band-photos-upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleBandPhotosChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}