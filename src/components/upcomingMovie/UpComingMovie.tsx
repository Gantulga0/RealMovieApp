import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Movie } from '@/types/movie-type';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const UpComingMovie = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [upComingMovie, setUpComingMovie] = useState<Movie[]>();

  const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
  const API_TOKEN = process.env.API_TOKEN;

  const router = useRouter();

  const getMovieData = async () => {
    try {
      setLoading(true);
      const upcomingResponse = await axios.get(
        `${TMDB_BASE_URL}/movie/upcoming?language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      setUpComingMovie(upcomingResponse.data.results);
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.status_message || 'API error');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovieData();
  }, []);

  const firstTenMovies = upComingMovie?.slice(0, 10);

  const handleSeeMoreClick = () => {
    router.push('/category/upcoming');
  };

  const handleMovieClick = (movieId: number) => {
    router.push(`/detail/${movieId}`);
  };

  return (
    <div className="m-5 flex flex-col justify-between max-w-[1280px] mx-auto pt-14 pr-5 pl-5">
      <div className="flex justify-between">
        <h3 className="font-inter text-[24px] font-semibold leading-[32px] tracking-[-0.6px]">
          Upcoming
        </h3>
        <Button
          variant="link"
          className="font-inter text-sm font-semibold"
          onClick={handleSeeMoreClick}
        >
          See more
          <ArrowRight />
        </Button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {firstTenMovies && firstTenMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 pt-9">
          {firstTenMovies.map((movie) => (
            <Card
              key={movie.id}
              className="w-full max-w-[200px] mx-auto cursor-pointer"
              onClick={() => handleMovieClick(movie.id)}
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
              <CardFooter className="flex flex-col p-2 items-start ">
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
          ))}
        </div>
      ) : (
        <p>No upcoming movies available.</p>
      )}
    </div>
  );
};

export default UpComingMovie;
