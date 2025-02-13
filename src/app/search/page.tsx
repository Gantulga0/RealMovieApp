'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Movie } from '@/types/movie-type';
import { useRouter, useSearchParams } from 'next/navigation';
import PaginationControl from '@/components/Pagination';
import MovieList from '@/components/MovieList';
import GenreSelector from '@/components/GenreSelector';

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenreID, setSelectedGenreID] = useState<string[]>([]);
  const [totalMovies, setTotalMovies] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const searchParams = useSearchParams();
  const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
  const API_TOKEN = process.env.API_TOKEN;

  const router = useRouter();

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
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.status_message || 'API error');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMovies = async (genreIds: string[], query: string = '') => {
    try {
      setLoading(true);
      let url = `${TMDB_BASE_URL}/discover/movie?language=en&page=${currentPage}`;

      if (genreIds.length) {
        url += `&with_genres=${genreIds.join(',')}`;
      }

      if (query) {
        url = `${TMDB_BASE_URL}/search/movie?query=${query}&page=${currentPage}&language=en`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
      setTotalMovies(response.data.total_results);
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

  const getSearchData = (query: string) => {
    getMovies(selectedGenreID, query);
  };

  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      setSearchQuery(query);
      getSearchData(query);
    }
  }, [searchParams]);

  const handleGenreSelect = (genreId: string) => {
    const updatedGenres = selectedGenreID.includes(genreId)
      ? selectedGenreID.filter((item) => item !== genreId)
      : [...selectedGenreID, genreId];

    setSelectedGenreID(updatedGenres);

    const queryParams = new URLSearchParams();
    queryParams.set('genresID', updatedGenres.join(','));
    if (searchQuery) {
      queryParams.set('query', searchQuery);
    }
    router.push(`/genres?${queryParams.toString()}`);
    setCurrentPage(1);
  };

  useEffect(() => {
    getGenresList();
  }, []);

  useEffect(() => {
    getMovies(selectedGenreID, searchQuery);
  }, [selectedGenreID, currentPage, searchQuery]);

  const handleMovieClick = (movieId: number) => {
    router.push(`/detail/${movieId}`);
  };

  return (
    <div className="m-5 flex justify-between max-w-[1280px] mx-auto pt-14 pr-5 pl-5 mt-16 max-md:flex-col">
      {!loading && !error && genres.length > 0 && (
        <GenreSelector
          genres={genres}
          selectedGenreID={selectedGenreID}
          onGenreSelect={handleGenreSelect}
        />
      )}

      <div className="separator orientation-vertical" />
      <div>
        <p className="text-lg font-semibold">Total Movies: {totalMovies}</p>
        <MovieList movies={movies} onMovieClick={handleMovieClick} />
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Page;
