'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '@/types/movie-type';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [director, setDirector] = useState<string | null>(null);
  const [writers, setWriters] = useState<string[]>([]);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  const { id } = useParams();
  const router = useRouter();

  const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
  const API_TOKEN = process.env.API_TOKEN;

  useEffect(() => {
    if (!id) return;

    const getMovieDetails = async () => {
      setLoading(true);
      try {
        const [
          movieResponse,
          creditsResponse,
          similarMoviesResponse,
          videoResponse,
        ] = await Promise.all([
          axios.get(`${TMDB_BASE_URL}/movie/${id}?language=en-US`, {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }),
          axios.get(`${TMDB_BASE_URL}/movie/${id}/credits?language=en-US`, {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }),
          axios.get(
            `${TMDB_BASE_URL}/movie/${id}/similar?language=en-US&page=1`,
            {
              headers: {
                Authorization: `Bearer ${API_TOKEN}`,
              },
            }
          ),
          axios.get(`${TMDB_BASE_URL}/movie/${id}/videos?language=en-US`, {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }),
        ]);

        setMovie(movieResponse.data);
        setCast(creditsResponse.data.cast);

        const directorData = creditsResponse.data.crew.find(
          (member: any) => member.job === 'Director'
        );
        const writerData = creditsResponse.data.crew.filter(
          (member: any) => member.job === 'Writer'
        );

        setDirector(directorData ? directorData.name : null);
        setWriters(writerData.map((writer: any) => writer.name));
        setSimilarMovies(similarMoviesResponse.data.results);

        const trailer = videoResponse.data.results.find(
          (video: any) => video.type === 'Trailer'
        );
        setTrailerUrl(
          trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
        );
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data.status_message || 'API error');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    getMovieDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movie) return <p>No movie details available.</p>;

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleSeeMoreClick = () => {
    router.push(`/category/similar/${id}`);
  };

  const handleMovieClick = (movieId: number) => {
    router.push(`/detail/${movieId}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-[1100px]">
      <div className="flex flex-col">
        <div className="w-full mt-20">
          <div className="justify-between flex">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">{movie.title}</h2>
              <p className="text-lg mb-5">
                {movie.release_date} · {formatRuntime(movie.runtime)}
              </p>
            </div>
            <div>
              <p className="font-semibold text-xs max-md:hidden">Rating</p>
              <div className="flex items-center p-0 m-0">
                <Star className="text-yellow-400 w-7 h-7 fill-yellow-400" />
                <div>
                  <div className="flex items-center">
                    <p className="font-semibold text-sm ">
                      {movie.vote_average}
                    </p>
                    <p className="font-medium text-xs  text-gray-400">/10</p>
                  </div>
                  <p className="font-medium text-xs  text-gray-400">
                    {movie.vote_count}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:flex sm:gap-8">
            <div className="flex gap-10 max-sm:hidden">
              {movie.poster_path && (
                <Image
                  src={`${process.env.TMDB_IMAGE_SERVICE_URL}/w500/${movie.poster_path}`}
                  alt={movie.title}
                  width={290}
                  height={148}
                  className="rounded h-[148px] sm:h-[428px] sm:w-[290]"
                />
              )}
            </div>

            <div className="w-[760px] h-[211px] sm:h-[428px] max-md:w-[375px] mb-8">
              {trailerUrl ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={trailerUrl}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Movie Trailer"
                  className="rounded"
                ></iframe>
              ) : (
                <div className="bg-red-400 w-full h-full"></div>
              )}
            </div>
          </div>

          <div className="max-md:flex max-md: gap-5">
            <div className="hidden max-sm:block">
              {movie.poster_path && (
                <Image
                  src={`${process.env.TMDB_IMAGE_SERVICE_URL}/original/${movie.poster_path}`}
                  alt={movie.title}
                  width={100}
                  height={148}
                  className="rounded w-[100px] h-[148px]"
                />
              )}
            </div>
            <div className="max-md:w-full ">
              <div className="">
                <ul className="flex gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre.id} variant="outline">
                      {genre.name}
                    </Badge>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-sm sm:text-base">{movie.overview}</p>
            </div>
          </div>
        </div>
        <div>
          {director && (
            <div className="mt-6 flex gap-4 items-center">
              <h3 className="text-base font-bold w-16">Director</h3>
              <p>{director}</p>
            </div>
          )}
          <hr />
        </div>

        {writers.length > 0 && (
          <div className="mt-6 flex gap-4 items-center">
            <h3 className="text-base font-bold  w-16">Writers</h3>
            <ul>
              {writers.map((writer, index) => (
                <li key={index}>{writer}</li>
              ))}
            </ul>
          </div>
        )}
        <hr />
        <div className="sm:mt-0 flex gap-4 items-center">
          <h3 className="text-base font-bold w-16 max-md:mr-6">Stars</h3>
          <div className="flex gap-2 flex-wrap">
            {cast.length > 0 ? (
              cast.slice(0, 6).map((actor) => (
                <div key={actor.cast_id} className="text-center">
                  <p className="text-sm mt-2">{actor.name}</p>
                </div>
              ))
            ) : (
              <p>No cast available.</p>
            )}
          </div>
        </div>
        <hr />

        {similarMovies.length > 0 && (
          <div className="mt-6 sm:mt-0 flex gap-4 items-center flex-col">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-base font-bold">More like this</h3>
              <Button
                variant="link"
                className="font-inter text-sm font-semibold"
                onClick={handleSeeMoreClick}
              >
                See more
                <ArrowRight />
              </Button>
            </div>

            <div className="mt-6 sm:mt-0 flex flex-wrap gap-4 justify-center">
              {similarMovies.slice(0, 5).map((similarMovie) => (
                <Card
                  key={similarMovie.id}
                  className="w-full max-w-[157px] mx-auto sm:max-w-[197px]"
                  onClick={() => handleMovieClick(similarMovie.id)}
                >
                  <CardHeader className="p-0">
                    <Image
                      src={`${process.env.TMDB_IMAGE_SERVICE_URL}/w1280/${similarMovie.poster_path}`}
                      alt={similarMovie.title}
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
                        {similarMovie.vote_average}
                      </p>
                      <p className="text-muted-foreground text-xs pt-[2px]">
                        /10
                      </p>
                    </div>
                    <div className="h-14 overflow-hidden text-ellipsis line-clamp-2 text-lg text-foreground">
                      {similarMovie.title}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        <hr />
      </div>
    </div>
  );
};

export default Page;
