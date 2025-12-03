"use client";

import Link from 'next/link';
import { useEffect, useState } from "react";
import { Button } from 'primereact/button';

export default function ContratanteProfile() {
    const [usuario, setUsuario] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const token = localStorage.getItem("soundbridge/token");
            const response = await fetch("http://localhost:8080/v1/contratante/me", {
                headers: { "Authorization": `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Erro ao buscar dados");

            const data = await response.json();
            setUsuario(data);
            setFormData(data); 
        } catch (err) {
            console.error(err);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await convertToBase64(file);
                setFormData((prev) => ({ ...prev, fotoPerfil: base64 }));
            } catch (error) {
                console.error("Erro ao converter imagem:", error);
            }
        }
    };

    const handleRemovePhoto = () => {
        setFormData((prev) => ({ ...prev, fotoPerfil: "" }));
        const fileInput = document.getElementById('upload-foto');
        if(fileInput) fileInput.value = "";
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            
            const payload = {
                nome: formData.nome,
                telefone: formData.telefone,
                nomeEstabelecimento: formData.nomeEstabelecimento,
                tipoEstabelecimento: formData.tipoEstabelecimento,
                fotoPerfil: formData.fotoPerfil
            };

            const response = await fetch(`http://localhost:8080/v1/contratante/${usuario.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Erro ao atualizar");

            const dataAtualizada = await response.json();
            setUsuario(dataAtualizada);
            setIsEditing(false);
            alert("Perfil atualizado com sucesso!");

        } catch (err) {
            alert("Erro ao salvar alterações.");
        }
    };

    const handleCancel = () => {
        setFormData(usuario); 
        setIsEditing(false);
    };

    if (!usuario) return <p className="p-10">Carregando...</p>;

    const inputClass = (editavel) => 
        `mt-1 p-2 border rounded-md w-full transition-colors ${editavel ? 'bg-white border-blue-400' : 'bg-gray-100 text-gray-600'}`;

    return (
        <div className="min-h-screen w-full bg-white">
            <header className="w-full flex justify-between items-center px-8 py-4 border-b">
                <Link href="/Home" className="text-2xl font-bold text-blue-600 no-underline">SoundBridge</Link>
                <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-700">{usuario.nome}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                        {usuario.nome?.charAt(0) || 'U'}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto mt-10 px-4 pb-10">
                <h2 className="text-2xl font-semibold mb-6">Perfil</h2>
                <div className="w-full h-24 rounded-lg bg-gradient-to-r from-blue-200 via-gray-200 to-yellow-100" />

                <div className="mt-8 flex items-center gap-6">
                    <div className="relative">
                        <img 
                            src={formData.fotoPerfil || "/perfil.png"} 
                            alt="Foto" 
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" 
                        />
                        
                        <input 
                            id="upload-foto"
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="hidden" 
                            disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{usuario.nome}</h3>
                        <p className="text-sm text-gray-500">{usuario.email}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Link href="/Contratante/Home">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Contratos</button>
                        </Link>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Editar</button>
                        ) : (
                            <>
                                <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancelar</button>
                                <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Salvar</button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    
                    <div className="flex flex-col">
                        <label className="font-medium">Nome Completo</label>
                        <input 
                            type="text" 
                            name="nome" 
                            value={formData.nome || ""} 
                            onChange={handleInputChange} 
                            className={inputClass(isEditing)} 
                            readOnly={!isEditing} 
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium text-gray-500">E-mail (Não editável)</label>
                        <input 
                            type="email" 
                            value={usuario.email || ""} 
                            className="mt-1 p-2 border rounded-md w-full bg-gray-200 text-gray-500 cursor-not-allowed" 
                            readOnly 
                            disabled
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Telefone</label>
                        <input 
                            type="text" 
                            name="telefone" 
                            value={formData.telefone || ""} 
                            onChange={handleInputChange} 
                            className={inputClass(isEditing)} 
                            readOnly={!isEditing} 
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Nome do estabelecimento</label>
                        <input 
                            type="text" 
                            name="nomeEstabelecimento" 
                            value={formData.nomeEstabelecimento || ""} 
                            onChange={handleInputChange} 
                            className={inputClass(isEditing)} 
                            readOnly={!isEditing} 
                            placeholder="Digite o nome do estabelecimento" 
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Tipo de estabelecimento</label>
                        <select 
                            name="tipoEstabelecimento" 
                            value={formData.tipoEstabelecimento || ""} 
                            onChange={handleInputChange} 
                            className={inputClass(isEditing)} 
                            disabled={!isEditing}
                        >
                            <option value="">Selecione...</option>
                            <option value="Barzinho">Barzinho</option>
                            <option value="Casa de Show">Casa de Show</option>
                            <option value="Restaurante">Restaurante</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Foto de Perfil</label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <label 
                                    htmlFor="upload-foto" 
                                    className="mt-1 flex-1 p-2 border rounded-md bg-white text-left cursor-pointer border-blue-400 text-blue-600 hover:bg-blue-50 flex justify-between items-center"
                                >
                                    <span>Anexar nova foto</span>
                                    <span>📎</span>
                                </label>

                                {formData.fotoPerfil && (
                                    <button 
                                        onClick={handleRemovePhoto}
                                        className="mt-1 p-2 border border-red-400 text-red-600 rounded-md hover:bg-red-50"
                                        title="Remover foto"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="mt-1 p-2 border rounded-md w-full bg-gray-100 text-gray-500">
                                {usuario.fotoPerfil ? "Foto definida" : "Sem foto"}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}