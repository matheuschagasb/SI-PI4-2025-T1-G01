'use client';

import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { GenreFilters } from './GenreFilters';
import { MusicianCard } from './MusicianCard';
import { useState, useEffect } from 'react';

// Interface for API response structure
interface ApiMusician {
  id: string;
  nome: string;
  biografia: string;
  cidade: string;
  estado: string;
  generoMusical: string;
  email: string;
  telefone: string;
  fotoPerfil?: string; // Add fotoPerfil to the API interface
}

// Interface for the Musician data used in the frontend
interface Musician {
  id: string;
  name: string;
  genre: string;
  subgenre: string;
  rating: number;
  price: number;
  image: string;
  cidade: string;
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMusicians = async () => {
      setLoading(true);
      setError(null);
      try {
        const genreQuery = selectedGenre ? `?genero=${selectedGenre}` : '';
        const response = await fetch(`http://localhost:8080/v1/musico${genreQuery}`);
        if (!response.ok) {
          throw new Error('Failed to fetch musicians');
        }
        const data: ApiMusician[] = await response.json();
        const mappedMusicians: Musician[] = data.map((apiMusician: ApiMusician) => {
          let imageUrl = '/default-musician.jpg'; // Default image
          if (apiMusician.fotoPerfil) {
            // Prepend data URI prefix if it's not already there
            if (!apiMusician.fotoPerfil.startsWith('data:')) {
              imageUrl = `data:image/jpeg;base64,${apiMusician.fotoPerfil}`; // Assuming JPEG for simplicity
            } else {
              imageUrl = apiMusician.fotoPerfil;
            }
          }
          return {
            id: apiMusician.id,
            name: apiMusician.nome,
            genre: apiMusician.generoMusical,
            subgenre: '',
            rating: 0,
            price: 0,
            image: imageUrl, // Use fetched fotoPerfil
            cidade: apiMusician.cidade,
          };
        });
        setMusicians(mappedMusicians);
      } catch (err: any) {
        setError(err.message || 'Error fetching musicians');
        setMusicians([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicians();
  }, [selectedGenre]);

  const filteredMusicians = musicians.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genre.toLowerCase().includes(search.toLowerCase()) ||
      m.cidade.toLowerCase().includes(search.toLowerCase());

    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* Top Banner */}
        <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center text-sm">
          <p className="font-medium">Bem-Vindo!</p>
          <button className="text-white hover:text-gray-300 transition-colors">
            <i className="pi pi-times"></i>
          </button>
        </div>

        {/* Main Nav */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <Link href="#" className="text-2xl font-bold text-blue-600 no-underline hover:text-blue-700 transition-colors">
              SoundBridge
            </Link>

            {/* Search Bar */}
            <div className="flex-1 w-full max-w-xl mx-4">
              <span className="p-input-icon-right w-full">
                <i className="pi pi-search text-gray-400" />
                <InputText
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome, cidade ou estilo..."
                  className="w-full p-inputtext-sm"
                />
              </span>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700 hidden sm:block"></span>
              
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors" title="Idioma">
                <i className="pi pi-globe text-xl"></i>
              </button>
              
              <Link href="/Contratante">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 pr-2 rounded-full border border-gray-200 transition-all shadow-sm hover:shadow-md">
                  <i className="pi pi-bars text-lg ml-2 text-gray-600"></i>
                  <Avatar icon="pi pi-user" shape="circle" className="bg-blue-600 text-white" />
                </div>
              </Link>
            </div>
          </div>

          {/* Genre Filters */}
          <div className="mt-6 border-t border-gray-100 pt-4">
             {/* Envolvendo o componente de filtros para garantir espaçamento */}
            <GenreFilters
              onSelectGenre={setSelectedGenre}
              selectedGenre={selectedGenre}
            />
          </div>
        </div>
      </header>

      {/* Cards de músicos */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {loading && (
            <div className="flex justify-center items-center py-12">
                <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
                <span className="ml-3 text-lg text-gray-600">Carregando músicos...</span>
            </div>
        )}
        
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center mt-8">
                <i className="pi pi-exclamation-circle mr-2"></i>
                Erro: {error}
            </div>
        )}
        
        {!loading && !error && filteredMusicians.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <i className="pi pi-search text-4xl mb-3 block opacity-20"></i>
            <p className="text-lg">Nenhum músico encontrado.</p>
          </div>
        )}

        {/* Grid Layout Corrigido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!loading && !error && filteredMusicians.map((musician) => (
            <div key={musician.id} className="h-full">
                <MusicianCard musician={musician} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}