'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Movie } from '@/types/movie-type';
import { useRouter } from 'next/navigation';
import PaginationControl from '@/components/Pagination';
import MovieList from '@/components/MovieList';
import { Skeleton } from '@/components/ui/skeleton';

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
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 pt-9">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="w-full max-w-[200px] mx-auto">
              <Skeleton className="w-full h-[350px] mb-4" />
              <Skeleton className="w-full h-4 mb-2" />
              <Skeleton className="w-24 h-4" />
            </div>
          ))}
        </div>
      )}
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
