// Matheus Chagas - 24015048
import React, { useRef } from "react";

interface GenreFiltersProps {
  onSelectGenre: (genre: string | null) => void;
  selectedGenre: string | null;
}

// Lista fixa de gêneros com rótulo e caminho do ícone
const genres = [
  { label: 'Rock', icon: '/icons/rock-classico.png' },
  { label: 'Pop', icon: '/icons/pop.png' },
  { label: 'Jazz', icon: '/icons/jazz.png' },
  { label: 'Clássica', icon: '/icons/classica.png' },
  { label: 'Sertanejo', icon: '/icons/sertanejo-raiz.png' },
  { label: 'Funk', icon: '/icons/funk.png' },
  { label: 'Eletrônica', icon: '/icons/musica-eletronica.png' },
  { label: 'Hip Hop', icon: '/icons/rap.png' },
  { label: 'Reggae', icon: '/icons/reggae.png' },
];

export const GenreFilters = ({ onSelectGenre, selectedGenre }: GenreFiltersProps) => {
  // Ref para acessar diretamente o elemento <ul> e controlar o scroll horizontal
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      // Faz o scroll suave para a esquerda em 200px
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      // Faz o scroll suave para a direita em 200px
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <nav className="category-nav">
      <div className="category-nav-inner container">
        <button className="nav-arrow prev" onClick={scrollLeft}>
          <img src="/icons/details/seta-esquerda.png" alt="Previous" />
        </button>
        <ul className="category-list" ref={scrollContainerRef}>
          {genres.map((genre) => (
            <li
              key={genre.label}
              // Marca visualmente como ativa se for o gênero selecionado
              className={`category-item ${selectedGenre === genre.label ? 'active' : ''}`}
              // Se clicar no mesmo gênero, limpa o filtro (null); senão, seleciona o novo gênero
              onClick={() => onSelectGenre(selectedGenre === genre.label ? null : genre.label)}
            >
              {genre.icon.endsWith('.svg') ? (
                <div className="merged-icon">
                  <img src={genre.icon} alt={`${genre.label} icon`} />
                </div>
              ) : (
                <img src={genre.icon} alt={`${genre.label} icon`} />
              )}
              <span>{genre.label}</span>
            </li>
          ))}
        </ul>
        <button className="nav-arrow next" onClick={scrollRight}>
          <img src="/icons/details/seta-direita.png" alt="Next" />
        </button>
      </div>
    </nav>
  );
};