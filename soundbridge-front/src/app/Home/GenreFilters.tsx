import React, { useRef } from "react";

interface GenreFiltersProps {
  onSelectGenre: (genre: string | null) => void;
  selectedGenre: string | null;
}

const genres = [
  { label: "Samba", icon: "/icons/samba.png" },
  { label: "Rock Clássico", icon: "/icons/rock-classico.png" }, 
  { label: "Pop", icon: "/icons/pop.png" },
  { label: "Sertanejo Raiz", icon: "/icons/sertanejo-raiz.png" }, 
  { label: "Jazz", icon: "/icons/jazz.png" },
  { label: "Sertanejo Universitário", icon: "/icons/sertanejo-universitario.png" }, 
  { label: "MPB", icon: "/icons/mpb.png" },
  { label: "Bossa nova", icon: "/icons/bossa-nova.png" },
  { label: "Axé", icon: "/icons/axe.png" }, 
  { label: "Rap", icon: "/icons/rap.png" }, 
  { label: "Blues", icon: "/icons/blues.png" },
  { label: "Funk", icon: "/icons/funk.png" }, 
  { label: "Música Eletrônica", icon: "/icons/musica-eletronica.png" },
  { label: "Pagode", icon: "/icons/pagode.png" },
  { label: "Forró", icon: "/icons/forro.png" }, 
  { label: "Reggae", icon: "/icons/reggae.png" },
  { label: "Clássica", icon: "/icons/classica.png" },
  { label: "Indie", icon: "/icons/indie.png" },
  { label: "Gospel", icon: "/icons/gospel.png" },

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
