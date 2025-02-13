'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import GenreSelector from '@/components/GenreSelector';
import MovieList from '@/components/MovieList';
import PaginationControl from '@/components/Pagination';
import { Movie } from '@/types/movie-type';
import { FaSpinner } from 'react-icons/fa';

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenreID, setSelectedGenreID] = useState<string[]>([]);
  const [totalMovies, setTotalMovies] = useState<number>(0);

  const searchParams = useSearchParams();
  const searchedGenreID = searchParams.get('genresID');
  const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
  const API_TOKEN = process.env.API_TOKEN;

  const router = useRouter();

  useEffect(() => {
    const getGenresList = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${TMDB_BASE_URL}/genre/movie/list?language=en`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }
        );
        setGenres(response.data.genres);
      } catch (err) {
        setError('An error occurred while fetching genres.');
      } finally {
        setLoading(false);
      }
    };

    getGenresList();
  }, []);

  useEffect(() => {
    if (searchedGenreID) {
      const genreIds = searchedGenreID.split(',');
      setSelectedGenreID(genreIds);
      const getMovies = async (genreIds: string[]) => {
        try {
          setLoading(true);
          const url = genreIds.length
            ? `${TMDB_BASE_URL}/discover/movie?language=en&with_genres=${genreIds.join(
                ','
              )}&page=${currentPage}`
            : `${TMDB_BASE_URL}/discover/movie?language=en&page=${currentPage}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          });
          setMovies(response.data.results);
          setTotalPages(response.data.total_pages);
          setTotalMovies(response.data.total_results);
        } catch (err) {
          setError('An error occurred while fetching movies.');
        } finally {
          setLoading(false);
        }
      };
      getMovies(genreIds);
    }
  }, [searchedGenreID, currentPage]);

  const handleGenreSelect = (genreId: string) => {
    const updatedGenres = selectedGenreID.includes(genreId)
      ? selectedGenreID.filter((item) => item !== genreId)
      : [...selectedGenreID, genreId];
    setSelectedGenreID(updatedGenres);
    const queryParams = new URLSearchParams();
    queryParams.set('genresID', updatedGenres.join(','));
    router.push(`/genres?${queryParams.toString()}`);
    setCurrentPage(1);
  };

  const handleMovieClick = (movieId: number) => {
    router.push(`/detail/${movieId}`);
  };

  return (
    <div className="m-5 flex justify-between max-w-[1280px] mx-auto pt-14 pr-5 pl-5 mt-16 max-md:flex-col">
      <GenreSelector
        genres={genres}
        selectedGenreID={selectedGenreID}
        onGenreSelect={handleGenreSelect}
      />

      <div className="hidden max-md:block pt-5 pl-3 font-bold text-xl">
        {totalMovies} titles
      </div>

      <div className="separator orientation-vertical" />
      {movies.length === 0 && !loading && !error && (
        <div className="text-center py-5">
          <p className="text-lg font-semibold border w-[800px] h-[95px] flex items-center justify-center rounded-xl">
            No results found
          </p>
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-4xl text-gray-600" />
        </div>
      )}
      <div>
        {!loading && !error && (
          <MovieList movies={movies} onMovieClick={handleMovieClick} />
        )}
        {movies.length > 0 && !loading && (
          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
