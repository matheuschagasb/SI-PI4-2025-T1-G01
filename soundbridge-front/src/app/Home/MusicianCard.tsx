import { Card } from "primereact/card";
import Link from "next/link";

interface Musician {
  id: string; // Mudei para string para bater com o Home
  name: string;
  genre: string;
  subgenre: string;
  rating: number;
  price: string | number; // Aceita os dois
  image: string;
}

interface MusicianCardProps {
  musician: Musician;
}

export const MusicianCard = ({ musician }: MusicianCardProps) => {
  return (
    <Link href={`/Perfil/${musician.id}`} className="block h-full">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-xl overflow-hidden cursor-pointer h-full">
        <div className="relative h-52 w-full">
            <img
            src={musician.image}
            alt={musician.name}
            className="w-full h-full object-cover"
            />
        </div>
        <div className="p-3 flex flex-col justify-between h-[calc(100%-13rem)]">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 truncate">{musician.name}</h3>
            <p className="text-gray-500 text-sm truncate">
                {musician.genre} {musician.subgenre ? `/ ${musician.subgenre}` : ''}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
            {/* <div className="flex items-center gap-1">
              <i className="pi pi-star-fill text-yellow-500 text-sm"></i>
              <span className="text-gray-700 text-sm font-medium">
                {musician.rating ? Number(musician.rating).toFixed(1) : 'N/A'}
              </span>
            </div> */}
            <span className="font-bold text-blue-600 text-sm">
              R$ {musician.price} <span className="text-gray-400 font-normal text-xs">/h</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};