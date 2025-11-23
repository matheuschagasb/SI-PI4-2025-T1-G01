import React, { useRef } from "react";

interface GenreFiltersProps {
  onSelectGenre: (genre: string | null) => void;
  selectedGenre: string | null;
}

const genres = [
  { label: 'Rock', icon: '/icons/rock-classico.png' },
  { label: 'Pop', icon: '/icons/pop.png' },
  { label: 'Jazz', icon: '/icons/jazz.png' },
  { label: 'Clássica', icon: '/icons/classica.png' },
  { label: 'Sertanejo', icon: '/icons/sertanejo-raiz.png' }, // Using sertanejo-raiz for general Sertanejo
  { label: 'Funk', icon: '/icons/funk.png' },
  { label: 'Eletrônica', icon: '/icons/musica-eletronica.png' },
  { label: 'Hip Hop', icon: '/icons/rap.png' }, // Using rap as a close alternative
  { label: 'Reggae', icon: '/icons/reggae.png' },
];

export const GenreFilters = ({ onSelectGenre, selectedGenre }: GenreFiltersProps) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
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
              className={`category-item ${selectedGenre === genre.label ? 'active' : ''}`}
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
