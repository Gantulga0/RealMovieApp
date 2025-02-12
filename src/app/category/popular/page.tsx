'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Movie } from '@/types/movie-type';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Star } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { useRouter } from 'next/navigation';

const PopularMovie = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [popularMoviesData, setPopularMoviesData] = useState<Movie[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
  const API_TOKEN = process.env.API_TOKEN;

  const router = useRouter();

  const getMovieData = async (page: number) => {
    try {
      setLoading(true);
      const popularResponse = await axios.get(
        `${TMDB_BASE_URL}/movie/popular?language=en-US&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      setPopularMoviesData(popularResponse.data.results);
      setTotalPages(popularResponse.data.total_pages);
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

  const createPageArray = (totalPages: number, currentPage: number) => {
    const pages: (number | string)[] = [];

    if (currentPage > 1) {
      pages.push(currentPage - 1);
    }
    pages.push(currentPage);
    if (currentPage < totalPages) {
      pages.push(currentPage + 1);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    return pages;
  };

  const pageNumbers = createPageArray(totalPages, currentPage);

  const handleMovieClick = (movieId: number) => {
    router.push(`/detail/${movieId}`);
  };

  return (
    <div className="m-5 flex flex-col justify-between max-w-[1280px] mx-auto pt-8 pr-5 pl-5 mt-20">
      <div className="flex justify-between">
        <h3 className="font-inter text-[24px] font-semibold leading-[32px] tracking-[-0.6px]">
          Popular
        </h3>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {popularMoviesData && popularMoviesData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 pt-9">
          {popularMoviesData.map((movie) => (
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
          ))}
        </div>
      ) : (
        <p>No popular movies available.</p>
      )}
      <Pagination className="mt-[32px] flex justify-end max-md:w-[300px]">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </PaginationItem>

          {pageNumbers.map((page, index) => {
            const key = `${page}-${index}`;
            if (page === '...') {
              return (
                <PaginationItem key={key}>
                  <PaginationLink href="#">...</PaginationLink>
                </PaginationItem>
              );
            } else {
              return (
                <PaginationItem key={key}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page as number)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
          })}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PopularMovie;
