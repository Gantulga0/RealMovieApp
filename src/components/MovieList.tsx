import React from 'react';
import { Movie } from '@/types/movie-type';
import Image from 'next/image';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movieId: number) => void;
}

const MovieList: React.FC<MovieListProps> = ({ movies, onMovieClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 pt-9">
      {movies.length > 0 ? (
        movies.map((movie) => (
          <Card
            key={movie.id}
            className="w-full max-w-[230px] mx-auto cursor-pointer"
            onClick={() => onMovieClick(movie.id)}
          >
            <CardHeader className="p-0">
              <Image
                src={`${process.env.TMDB_IMAGE_SERVICE_URL}/w1280/${movie.poster_path}`}
                alt={movie.title}
                className="object-cover rounded"
                width={250}
                height={350}
                quality={100}
              />
            </CardHeader>
            <CardFooter className="flex flex-col p-2 items-start">
              <div className="flex items-center gap-x-1">
                <Star className="text-yellow-400 w-4 fill-yellow-400" />
                <p className="text-sm leading-5 font-medium">
                  {movie.vote_average}
                </p>
                <p className="text-muted-foreground text-xs pt-[2px]">/10</p>
              </div>
              <div className="h-14 overflow-hidden text-ellipsis line-clamp-2 text-lg text-foreground">
                {movie.title}
              </div>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>No movies found.</p>
      )}
    </div>
  );
};

export default MovieList;
