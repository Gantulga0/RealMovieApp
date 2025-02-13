'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Movie } from '@/types/movie-type';
import { useRouter } from 'next/navigation';
import PaginationControl from '@/components/Pagination';
import MovieList from '@/components/MovieList';

const TopRatedMovie = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [topRatedMoviesData, setTopRatedMoviesData] = useState<Movie[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
  const API_TOKEN = process.env.API_TOKEN;

  const router = useRouter();

  const getMovieData = async (page: number) => {
    try {
      setLoading(true);
      const topRatedResponse = await axios.get(
        `${TMDB_BASE_URL}/movie/top_rated?language=en-US&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      setTotalPages(topRatedResponse.data.total_pages);
      setTopRatedMoviesData(topRatedResponse.data.results);
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

  useEffect(() => {
    getMovieData(currentPage);
  }, [currentPage]);

  const handleMovieClick = (movieId: number) => {
    router.push(`/detail/${movieId}`);
  };

  return (
    <div className="m-5 flex flex-col justify-between max-w-[1280px] mx-auto pt-14 pr-5 pl-5 mt-20">
      <div className="flex justify-between">
        <h3 className="font-inter text-[24px] font-semibold leading-[32px] tracking-[-0.6px]">
          Top Rated Movies
        </h3>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {topRatedMoviesData && topRatedMoviesData.length > 0 ? (
        <MovieList
          movies={topRatedMoviesData}
          onMovieClick={handleMovieClick}
        />
      ) : (
        <p>No top-rated movies available.</p>
      )}

      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TopRatedMovie;
