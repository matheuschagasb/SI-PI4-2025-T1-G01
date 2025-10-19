import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { GenreFilters } from "../Home/GenreFilters";
import { MusicianCard } from "../Home/MusicianCard";

interface Musician {
  id: number;
  name: string;
  genre: string;
  subgenre: string;
  rating: number;
  price: number;
  image: string;
}

export const Home = () => {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Mock de músicos
  const musicians: Musician[] = [
    {
      id: 1,
      name: "Lucas Moraes",
      genre: "Pop",
      subgenre: "R&B",
      rating: 2.58,
      price: 250,
      image: "/musicians/lucas.jpg",
    },
    {
      id: 2,
      name: "Banda Horizonte Azul",
      genre: "Rock",
      subgenre: "Alternativo",
      rating: 4.89,
      price: 320,
      image: "/musicians/horizonte.jpg",
    },
    {
      id: 3,
      name: "DJ Lunna",
      genre: "Techno",
      subgenre: "House",
      rating: 4.57,
      price: 280,
      image: "/musicians/lunna.jpg",
    },
    {
      id: 4,
      name: "Maria Luiza & Os Ventos",
      genre: "MPB",
      subgenre: "Samba",
      rating: 4.78,
      price: 300,
      image: "/musicians/maria.jpg",
    },
    {
      id: 5,
      name: "Thiago Costa",
      genre: "Trap",
      subgenre: "Hip-hop",
      rating: 4.81,
      price: 560,
      image: "/musicians/thiago.jpg",
    },
    {
      id: 6,
      name: "Clara Mendes",
      genre: "Indie",
      subgenre: "Pop",
      rating: 4.89,
      price: 240,
      image: "/musicians/clara.jpg",
    },
    {
      id: 7,
      name: "Grupo Som da Terra",
      genre: "Forró",
      subgenre: "Sertanejo",
      rating: 5.0,
      price: 260,
      image: "/musicians/terra.jpg",
    },
    {
      id: 8,
      name: "Pedro Nunes",
      genre: "Jazz",
      subgenre: "Soul",
      rating: 4.88,
      price: 270,
      image: "/musicians/pedro.jpg",
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
    <div className="p-4">
      {/* Header */}
      <header className="flex justify-between items-center py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-sky-600">SoundBridge</h1>

        <div className="flex items-center gap-2 w-1/3">
          <span className="p-input-icon-right w-full">
            <i className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="  Buscar por nome, cidade ou estilo..."
              className="w-full"
            />
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-700">Guilherme</span>
          <Avatar icon="pi pi-user" shape="circle" />
        </div>
      </header>

      {/* Filtros */}
      <section className="mt-6">
        <GenreFilters onSelectGenre={setSelectedGenre} selectedGenre={selectedGenre} />
      </section>

      {/* Cards de músicos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {filteredMusicians.map((musician) => (
          <MusicianCard key={musician.id} musician={musician} />
        ))}
      </section>
    </div>
  );
};
