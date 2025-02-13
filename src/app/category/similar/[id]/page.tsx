'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Movie } from '@/types/movie-type';
import PaginationControl from '@/components/Pagination';
import MovieList from '@/components/MovieList';

const SimilarMoviesPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [similarMoviesData, setSimilarMoviesData] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
  const API_TOKEN = process.env.API_TOKEN;

  const getSimilarMovies = async (movieId: string, page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}/similar?language=en-US&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      setTotalPages(response.data.total_pages);
      setSimilarMoviesData(response.data.results);
    } catch (err) {
      console.error('Error fetching similar movies:', err);
      setError('An error occurred while fetching similar movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      console.log('Fetching similar movies for movieId:', id);
      getSimilarMovies(id as string, currentPage);
    }
  }, [id, currentPage]);

  const handleMovieClick = (movieId: number) => {
    router.push(`/detail/${movieId}`);
  };

  return (
    <div className="m-5 flex flex-col justify-between max-w-[1280px] mx-auto pt-14 pr-5 pl-5 mt-20">
      <h3 className="font-inter text-[24px] font-semibold">Similar Movies</h3>
      {loading && <p>Loading similar movies...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <MovieList movies={similarMoviesData} onMovieClick={handleMovieClick} />

      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default SimilarMoviesPage;
