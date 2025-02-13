import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GenreSelectorProps {
  genres: { id: number; name: string }[];
  selectedGenreID: string[];
  onGenreSelect: (genreId: string) => void;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({
  genres,
  selectedGenreID,
  onGenreSelect,
}) => {
  return (
    <div className="w-[387px]">
      <h1 className="text-3xl font-bold mb-10">Search Filter</h1>
      <h1 className="font-bold text-2xl">Genres</h1>
      <h2 className="text-base font-bold mb-5 mt-2">See list of movies by genre</h2>
      {genres.map((genre) => {
        const isSelected = selectedGenreID.includes(genre.id.toString());
        return (
          <Badge
            key={genre.id}
            variant="outline"
            className={`${
              isSelected
                ? 'bg-black text-white dark:bg-white dark:text-black m-2 cursor-pointer'
                : 'm-2 cursor-pointer'
            }`}
            onClick={() => onGenreSelect(genre.id.toString())}
          >
            {genre.name}
            <ChevronRight className="stroke-1" />
          </Badge>
        );
      })}
    </div>
  );
};

export default GenreSelector;
