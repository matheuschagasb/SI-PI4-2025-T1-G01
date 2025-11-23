'use client';

import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { GenreFilters } from './GenreFilters';
import { MusicianCard } from './MusicianCard';
import { useState, useEffect } from 'react'; // Added useEffect

// Interface for API response structure
interface ApiMusician {
  id: string; // UUID string
  nome: string;
  biografia: string;
  cidade: string;
  estado: string;
  generoMusical: string;
  email: string;
  telefone: string;
}

// Interface for the Musician data used in the frontend
interface Musician {
  id: string;
  name: string;
  genre: string;
  subgenre: string; // Placeholder or derived
  rating: number; // Placeholder
  price: number; // Placeholder
  image: string; // Placeholder
  cidade: string; // Added for search
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [musicians, setMusicians] = useState<Musician[]>([]); // State for fetched musicians
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

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
        const mappedMusicians: Musician[] = data.map((apiMusician: ApiMusician) => ({
          id: apiMusician.id,
          name: apiMusician.nome,
          genre: apiMusician.generoMusical,
          subgenre: '', // Default value as API does not provide it
          rating: 0, // Default value as API does not provide it
          price: 0, // Default value as API does not provide it
          image: '/default-musician.jpg', // Placeholder image
          cidade: apiMusician.cidade, // Mapped from API
        }));
        setMusicians(mappedMusicians);
      } catch (err: any) {
        setError(err.message || 'Error fetching musicians');
        setMusicians([]); // Clear musicians on error
      } finally {
        setLoading(false);
      }
    };

    fetchMusicians();
  }, [selectedGenre]); // Refetch when selectedGenre changes

  // Filtering for search input (genre filtering is now handled by API query)
  const filteredMusicians = musicians.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genre.toLowerCase().includes(search.toLowerCase()) ||
      m.cidade.toLowerCase().includes(search.toLowerCase()); // Search by city

    return matchSearch;
  });

  return (
    <div>
      {/* Header */}
      <header className="site-header">
        <div className="top-banner">
          <p className="top-banner-text">Bem-Vindo!</p>
          <button className="close-button">
            <img src="/icons/close.svg" alt="Close" />
          </button>
        </div>
        <div className="main-nav-wrapper container">
          <a href="#" className="logo">
            SoundBridge
          </a>
          <div className="search-bar">
            <span className="p-input-icon-right w-full">
              <i className="pi pi-search" />
              <InputText
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, cidade ou estilo..."
                className="w-full"
              />
            </span>
          </div>
          <div className="user-actions">
            <span className="user-name">Guilherme</span>
            <button className="action-btn">
              <img src="/icons/language.svg" alt="Languages" />
            </button>
            <Link href="/Contratante">
              <button className="profile-btn">
                <img src="/icons/details/menu.png" alt="Menu" />
                <Avatar icon="pi pi-user" shape="circle" />
              </button>
            </Link>
          </div>
        </div>
        <GenreFilters
          onSelectGenre={setSelectedGenre}
          selectedGenre={selectedGenre}
        />
      </header>

      {/* Cards de músicos */}
      <main id="section-artists" className="container">
        {loading && <p className="text-center text-lg mt-8">Carregando músicos...</p>}
        {error && <p className="text-center text-red-500 text-lg mt-8">Erro: {error}</p>}
        {!loading && !error && filteredMusicians.length === 0 && (
          <p className="text-center text-lg mt-8">Nenhum músico encontrado.</p>
        )}
        <div className="artist-grid">
          {!loading && !error && filteredMusicians.map((musician) => (
            <MusicianCard key={musician.id} musician={musician} />
          ))}
        </div>
      </main>
    </div>
  );
}
