// src/components/ui/Pagination/Pagination.tsx

import React from 'react';
import { PaginationPrevButton, PaginationNextButton } from '../Button';
import { usePagination } from './usePagination';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { pageNumbers, isFirstPage, isLastPage, isDisabled } = usePagination({
    currentPage,
    totalPages,
  });

  const handlePrev = () => {
    if (!isFirstPage && !isDisabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage && !isDisabled) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.wrapperPagination}>
      <PaginationPrevButton 
        onClick={handlePrev}
        disabled={isFirstPage || isDisabled}
      />
      </div>
      <div className={styles.wrapperPages}>
      <div className={styles.pages}>
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            className={`
              ${styles.pageButton} 
              ${page === currentPage ? styles.active : ''} 
              ${page === '...' ? styles.dots : ''}
            `}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...' || isDisabled}
          >
            {page}
          </button>
        ))}
      </div>
      </div>
        <div className={styles.wrapperPagination}>
      <PaginationNextButton 
        onClick={handleNext}
        disabled={isLastPage || isDisabled}
      />
      </div>
    </div>
  );
};