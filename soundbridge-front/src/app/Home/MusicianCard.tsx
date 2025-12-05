import { Card } from "primereact/card";
import Link from "next/link";

interface Musician {
  id: number;
  name: string;
  genre: string;
  subgenre: string;
  rating: number;
  price: string;
  image: string;
}

interface MusicianCardProps {
  musician: Musician;
}

export const MusicianCard = ({ musician }: MusicianCardProps) => {
  return (
    <Link href={`/Perfil/${musician.id}`} className="block">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-xl overflow-hidden cursor-pointer">
        <img
          src={musician.image}
          alt={musician.name}
          className="w-full h-52 object-cover"
        />
        <div className="p-3">
          <h3 className="font-semibold text-lg">{musician.name}</h3>
          <p className="text-gray-500 text-sm">
            {musician.genre} / {musician.subgenre}
          </p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
            </div>
            <span className="font-medium text-gray-800">
              R$ {musician.price} hora
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
