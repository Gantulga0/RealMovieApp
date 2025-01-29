'use client';

import React, { useEffect } from 'react';
import { Film, Search, Moon, Sun, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '../ui/badge';

export function Header() {
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === 'dark';

  return (
    <div className="m-5 flex justify-between items-center max-w-[1280px] mx-auto pr-5 pl-5">
      <div className="flex gap-2 text-indigo-700">
        <Film />
        <button className="font-inter text-xl italic font-bold leading-5 tracking-[0.32px]">
          MovieZ
        </button>
      </div>
      <div className="hidden md:flex md:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-[97px] h-[36px] p-2.5 px-4 justify-center items-center gap-2 rounded-md border hover:bg-slate-100 duration-75 ease-in-out">
            Genre
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[580px] h-[300] p-5">
            <h1 className="font-bold text-2xl">Genres</h1>
            <h2 className="text-base">See list of movies by genre</h2>
            <DropdownMenuSeparator className="mt-3 mb-3" />

            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Action
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Adventure
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Animation
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Comedy
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Crime
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Documentary
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Drama
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Family
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Fantasy
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              History
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Horror
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Music
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Mystery
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Romance
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              Science Fiction
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 mb-4 cursor-pointer">
              TV Movie
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 cursor-pointer">
              Thriller
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 cursor-pointer">
              War
              <ChevronRight className="stroke-1" />
            </Badge>
            <Badge variant={'secondary'} className="mr-4 cursor-pointer">
              Western
              <ChevronRight className="stroke-1" />
            </Badge>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input placeholder="Search" className="h-[36px] w-[379px]" />
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="w-9 h-9 md:hidden">
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
  );
}

export default Header;
