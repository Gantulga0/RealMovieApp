import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const createPageArray = (totalPages: number, currentPage: number) => {
    const pages: (number | string)[] = [];

    if (currentPage > 1) pages.push(currentPage - 1);
    pages.push(currentPage);
    if (currentPage < totalPages) pages.push(currentPage + 1);
    if (currentPage < totalPages - 2) pages.push('...');

    return pages;
  };

  const pageNumbers = createPageArray(totalPages, currentPage);

  return (
    <Pagination className="mt-[32px] flex justify-end">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => onPageChange(currentPage - 1)}
            />
          </PaginationItem>
        )}

        {pageNumbers.map((page, index) => {
          const key = `${page}-${index}`;
          return page === '...' ? (
            <PaginationItem key={key}>
              <PaginationLink href="#">...</PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={key}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => onPageChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControl;
