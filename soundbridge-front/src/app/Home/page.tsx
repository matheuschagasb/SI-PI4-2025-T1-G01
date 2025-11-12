'use client';

import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { GenreFilters } from './GenreFilters';
import { MusicianCard } from './MusicianCard';
import { useState } from 'react';

interface Musician {
  id: number;
  name: string;
  genre: string;
  subgenre: string;
  rating: number;
  price: number;
  image: string;
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Mock de músicos
  const musicians: Musician[] = [
    {
      id: 1,
      name: 'Lucas Moraes',
      genre: 'Pop',
      subgenre: 'R&B',
      rating: 2.58,
      price: 250,
      image: '/musicians/lucas.jpg',
    },
    {
      id: 2,
      name: 'Banda Horizonte Azul',
      genre: 'Rock',
      subgenre: 'Alternativo',
      rating: 4.89,
      price: 320,
      image: '/musicians/horizonte.jpg',
    },
    {
      id: 3,
      name: 'DJ Lunna',
      genre: 'Techno',
      subgenre: 'House',
      rating: 4.57,
      price: 280,
      image: '/musicians/lunna.jpg',
    },
    {
      id: 4,
      name: 'Maria Luiza & Os Ventos',
      genre: 'MPB',
      subgenre: 'Samba',
      rating: 4.78,
      price: 300,
      image: '/musicians/maria.jpg',
    },
    {
      id: 5,
      name: 'Thiago Costa',
      genre: 'Trap',
      subgenre: 'Hip-hop',
      rating: 4.81,
      price: 560,
      image: '/musicians/thiago.jpg',
    },
    {
      id: 6,
      name: 'Clara Mendes',
      genre: 'Indie',
      subgenre: 'Pop',
      rating: 4.89,
      price: 240,
      image: '/musicians/clara.jpg',
    },
    {
      id: 7,
      name: 'Grupo Som da Terra',
      genre: 'Forró',
      subgenre: 'Sertanejo',
      rating: 5.0,
      price: 260,
      image: '/musicians/terra.jpg',
    },
    {
      id: 8,
      name: 'Pedro Nunes',
      genre: 'Jazz',
      subgenre: 'Soul',
      rating: 4.88,
      price: 270,
      image: '/musicians/pedro.jpg',
    },
  ];

  // Filtragem
  const filteredMusicians = musicians.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genre.toLowerCase().includes(search.toLowerCase()) ||
      m.subgenre.toLowerCase().includes(search.toLowerCase());

    const matchGenre = selectedGenre
      ? m.genre.toLowerCase() === selectedGenre.toLowerCase()
      : true;

    return matchSearch && matchGenre;
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
            <button className="profile-btn">
              <img src="/icons/details/menu.png" alt="Menu" />
              <Avatar icon="pi pi-user" shape="circle" />
            </button>
          </div>
        </div>
        <GenreFilters
          onSelectGenre={setSelectedGenre}
          selectedGenre={selectedGenre}
        />
      </header>

      {/* Cards de músicos */}
      <main id="section-artists" className="container">
        <div className="artist-grid">
          {filteredMusicians.map((musician) => (
            <MusicianCard key={musician.id} musician={musician} />
          ))}
        </div>
      </main>
    </div>
  );
}
