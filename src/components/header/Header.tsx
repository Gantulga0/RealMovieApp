'use client';
import {
  Film,
  Search,
  Moon,
  Sun,
  ChevronRight,
  ChevronDown,
  X,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Movie } from '@/types/movie-type';
import { Genre } from '@/types/genre-type';

export function Header() {
  const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
  const API_TOKEN = process.env.API_TOKEN;

  const [genreList, setGenreList] = useState<Genre[]>([]);
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string>('');
  const [moviesList, setMoviesList] = useState<Movie[]>([]);

  const router = useRouter();
  const getMovieData = async () => {
    try {
      const genreResponse = await axios.get(
        `${TMDB_BASE_URL}/genre/movie/list?language=en`,
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      setGenreList(genreResponse.data.genres);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching data.');
    } finally {
    }
  };

  const getSearchData = async (query: string) => {
    try {
      const searchResponse = await axios.get(
        `${TMDB_BASE_URL}/search/movie?query=${query}&language=en-US&page=1`,
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      console.log(searchResponse.data);
      setMoviesList(searchResponse.data.results);
    } catch (err) {
      setError('An error occurred while fetching search data.');
      console.log(err);
    } finally {
    }
  };

  const handleGenreSelect = (genreId: string) => {
    router.push(`/genres?genresID=${genreId}`);
  };

  useEffect(() => {
    getMovieData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      getSearchData(searchQuery);
    } else {
      setMoviesList([]);
    }
  }, [searchQuery]);

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleMovieClick = (movieId: number) => {
    setSearchQuery('');
    router.push(`/detail/${movieId}`);
  };

  const firstFiveMovies = moviesList.slice(0, 5);

  const handleSeeAllResult = () => {
    setSearchQuery('');
    router.push(`/search?query=${searchQuery}`);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-20 h-[59px] bg-background flex items-center justify-between mx-auto px-5 w-full">
      <div className="max-w-[1280px] fixed top-0 inset-x-0 z-20 h-[59px] bg-background flex items-center justify-between mx-auto px-5">
        <div className="flex gap-2 text-indigo-700">
          <Film />
          <button
            className="font-inter text-xl italic font-bold leading-5 tracking-[0.32px]"
            onClick={handleHomeClick}
          >
            MovieZ
          </button>
        </div>
        {/* THis is Desktop version */}
        <div className="hidden md:flex md:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-[97px] h-[36px] p-2.5 px-4 justify-center items-center gap-2 rounded-md border hover:bg-slate-100 duration-75 ease-in-out">
              <ChevronDown />
              Genre
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[580px] h-[300] p-5">
              <h1 className="font-bold text-2xl">Genres</h1>
              <h2 className="text-base">See list of movies by genre</h2>
              <DropdownMenuSeparator className="mt-3 mb-3" />

              {genreList.map((genre) => (
                <Badge
                  key={genre.id}
                  variant={'outline'}
                  className="mr-4 mb-4 cursor-pointer"
                  onClick={() => handleGenreSelect(genre.id.toString())}
                >
                  {genre.name}
                  <ChevronRight className="stroke-1" />
                </Badge>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            placeholder="Search"
            className="h-[36px] w-[379px]"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {error && <p>Error: {error}</p>}

          {firstFiveMovies.length > 0 ? (
            <div className="flex flex-col w-[577px]  absolute top-14 rounded-sm max-md:w-[450px] overflow-y-scroll max-md:hidden">
              {firstFiveMovies.map((movie) => (
                <Card
                  key={movie.id}
                  className="w-full max-w-[577px] mx-auto rounded-none cursor-pointer flex p-4 justify-between items-end max-md:max-w-[450px] transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:opacity-90"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <div className="flex">
                    <CardHeader className="p-0">
                      <Image
                        src={`${process.env.TMDB_IMAGE_SERVICE_URL}/w1280/${movie.poster_path}`}
                        alt={movie.title}
                        className="object-cover"
                        width={67}
                        height={100}
                        quality={100}
                      />
                    </CardHeader>
                    <CardFooter className="flex flex-col p-2 items-start ">
                      <div className="text-xl font-bold">{movie.title}</div>
                      <div className="flex items-center gap-x-1">
                        <Star className="text-yellow-400 w-4 fill-yellow-400" />
                        <p className="text-sm leading-5 font-medium">
                          {movie.vote_average}
                        </p>
                        <p className="text-muted-foreground text-xs pt-[2px]">
                          /10
                        </p>
                      </div>
                      <p>{movie.release_date}</p>
                    </CardFooter>
                  </div>

                  <Button
                    variant="link"
                    className="font-inter text-sm font-semibold flex"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    See more
                    <ArrowRight />
                  </Button>
                </Card>
              ))}
              <div
                className={
                  isDarkMode
                    ? 'bg-black text-white  p-3 cursor-pointer border'
                    : 'bg-white text-black p-3 cursor-pointer border'
                }
                onClick={() => handleSeeAllResult()}
              >
                See all result for : &quot;{searchQuery}&quot;
              </div>
            </div>
          ) : (
            <p></p>
          )}
        </div>
        <div
          className={`absolute top-0 left-0 flex justify-between items-center h-[59px] px-5 bg-background w-full transition-all duration-300 ease-in-out ${
            isSearchVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-[-100px]'
          } md:hidden`}
        >
          <div className="absolute top-3 left-20">
            <Search className="absolute top-2 left-2 w-[18px] h-[18px]" />
            <Input
              placeholder="Search"
              className="h-[36px] pl-9"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {/* this is mobile version */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex justify-center items-center border rounded w-9 h-9">
                  <ChevronDown className="text-white" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[330px] p-5 ml-5">
                <h1 className="font-bold text-2xl">Genres</h1>
                <h2 className="text-base">See list of movies by genre</h2>
                <DropdownMenuSeparator className="mt-3 mb-3" />
                {genreList.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant={'secondary'}
                    className="mr-4 mb-4 cursor-pointer"
                    onClick={() => handleGenreSelect(genre.id.toString())}
                  >
                    {genre.name}
                    <ChevronRight className="stroke-1" />
                  </Badge>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {firstFiveMovies.length > 0 ? (
            <div className="flex flex-col w-[335px]  absolute top-14 rounded-sm overflow-y-scroll h-[550px]">
              {firstFiveMovies.map((movie) => (
                <Card
                  key={movie.id}
                  className="w-full max-w-[577px] mx-auto rounded-none cursor-pointer flex p-4 justify-between items-end max-md:max-w-[450px] transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:opacity-90"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <div className="flex">
                    <CardHeader className="p-0">
                      <Image
                        src={`${process.env.TMDB_IMAGE_SERVICE_URL}/w1280/${movie.poster_path}`}
                        alt={movie.title}
                        className="object-cover"
                        width={67}
                        height={100}
                        quality={100}
                      />
                    </CardHeader>
                    <CardFooter className="flex flex-col p-2 items-start ">
                      <div className="text-xl font-bold">{movie.title}</div>
                      <div className="flex items-center gap-x-1">
                        <Star className="text-yellow-400 w-4 fill-yellow-400" />
                        <p className="text-sm leading-5 font-medium">
                          {movie.vote_average}
                        </p>
                        <p className="text-muted-foreground text-xs pt-[2px]">
                          /10
                        </p>
                      </div>
                      <p>{movie.release_date}</p>
                    </CardFooter>
                  </div>

                  <Button
                    variant="link"
                    className="font-inter text-sm font-semibold flex"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    See more
                    <ArrowRight />
                  </Button>
                </Card>
              ))}
              <div
                className={
                  isDarkMode
                    ? 'bg-black text-white  p-3 cursor-pointer border'
                    : 'bg-white text-black p-3 cursor-pointer border'
                }
                onClick={() => handleSeeAllResult()}
              >
                See all result for : &quot;{searchQuery}&quot;
              </div>
            </div>
          ) : (
            <p></p>
          )}
          <Button variant="outline" onClick={toggleSearch}>
            <X />
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <Button
            variant="outline"
            className="w-9 h-9 md:hidden"
            onClick={toggleSearch}
          >
            <Search />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="w-9 h-9"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
