import { Button } from "primereact/button";

interface GenreFiltersProps {
  onSelectGenre: (genre: string | null) => void;
  selectedGenre: string | null;
}

const genres = [
  { label: "Todos", icon: "pi pi-filter" }, 
  { label: "Samba", icon: "pi pi-volume-up" },
  { label: "Rock", icon: "pi pi-bolt" },
  { label: "Pop", icon: "pi pi-star" },
  { label: "Sertanejo", icon: "pi pi-star" },
  { label: "Jazz", icon: "pi pi-music" },
  { label: "MPB", icon: "pi pi-heart" },
  { label: "Forró", icon: "pi pi-gift" },
  { label: "Rap", icon: "pi pi-microphone" },
  { label: "Blues", icon: "pi pi-headphones" },
];

export const GenreFilters = ({ onSelectGenre, selectedGenre }: GenreFiltersProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {genres.map((genre) => (
        <Button
          key={genre.label}
          label={genre.label}
          icon={genre.icon}
          onClick={() =>
            genre.label === "Todos"
              ? onSelectGenre(null)
              : onSelectGenre(selectedGenre === genre.label ? null : genre.label)
          }
          className={`px-4 py-2 border-none ${
            (selectedGenre === null && genre.label === "Todos") ||
            selectedGenre === genre.label
              ? "bg-sky-600 text-white"
              : "bg-gray-100 text-gray-700"
          } rounded-full shadow-sm hover:shadow-md transition-all duration-200`}
        />
      ))}
    </div>
  );
};
