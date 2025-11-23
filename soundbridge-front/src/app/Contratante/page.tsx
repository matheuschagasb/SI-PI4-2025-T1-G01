"use client";

import { useEffect, useState } from "react";

export default function ContratanteProfile() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        async function carregarDados() {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch("http://localhost:8080/v1/contratante/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar dados");
                }

                const data = await response.json();
                setUsuario(data);

            } catch (err) {
                console.error("Erro ao carregar usuário:", err);
            }
        }

        carregarDados();
    }, []);

    if (!usuario) {
        return <p className="p-10">Carregando...</p>;
    }

    return (
        <div className="min-h-screen w-full bg-white">
            {/* Header */}
            <header className="w-full flex justify-between items-center px-8 py-4 border-b">
                <h1 className="text-xl font-bold text-[#0A66C2]">SoundBridge</h1>

                <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-700">{usuario.nome}</span>
                    <button className="w-6 h-6 rounded-full bg-gray-300" />
                </div>
            </header>

            <main className="max-w-6xl mx-auto mt-10 px-4">
                <h2 className="text-2xl font-semibold mb-6">Perfil</h2>

                {/* Faixa colorida */}
                <div className="w-full h-24 rounded-lg bg-gradient-to-r from-blue-200 via-gray-200 to-yellow-100" />

                {/* Card do perfil */}
                <div className="mt-8 flex items-center gap-6">
                    <img
                        src="/perfil.png"
                        alt="Foto"
                        className="w-20 h-20 rounded-full object-cover"
                    />

                    <div>
                        <h3 className="text-lg font-semibold">{usuario.nome}</h3>
                        <p className="text-sm text-gray-500">{usuario.email}</p>
                    </div>

                    <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Editar
                    </button>
                </div>

                {/* Formulário */}
                <div className="grid grid-cols-2 gap-6 mt-10">
                    <div className="flex flex-col">
                        <label className="font-medium">Nome Completo</label>
                        <input
                            type="text"
                            value={usuario.nome}
                            className="mt-1 p-2 border rounded-md bg-gray-100"
                            readOnly
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Anexar fotos</label>
                        <button className="mt-1 p-2 border rounded-md bg-gray-100 text-left">
                            Anexar fotos
                        </button>
                    </div>

                    {/*
                    <div className="flex flex-col">
                        <label className="font-medium">Gênero</label>
                        <select
                            className="mt-1 p-2 border rounded-md bg-gray-100"
                            value={usuario.genero ?? ""}
                            readOnly
                        >
                            <option>Masculino</option>
                            <option>Feminino</option>
                            <option>Outro</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Tipo de estabelecimento</label>
                        <select
                            className="mt-1 p-2 border rounded-md bg-gray-100"
                            value={usuario.tipoEstabelecimento ?? ""}
                            readOnly
                        >
                            <option>Barzinho</option>
                            <option>Casa de Show</option>
                            <option>Restaurante</option>
                        </select>
                    </div>
                    */}
                </div>

            </main>
        </div>
    );
}
