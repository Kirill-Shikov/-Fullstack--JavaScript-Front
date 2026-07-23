// src/components/ui/Pagination/usePagination.ts

interface UsePaginationProps {
  currentPage: number;
  totalPages: number;
}

export const usePagination = ({
  currentPage,
  totalPages,
}: UsePaginationProps) => {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 1) {
      pages.push(1);
      return pages;
    }

    // Всегда показываем первую страницу
    pages.push(1);

    // === ЛОГИКА ДЛЯ СТРАНИЦ 3-7 ===
    if (currentPage >= 3 && currentPage <= totalPages - 2) {
      // Многоточие слева
      pages.push('...');
      // Только текущая страница
      pages.push(currentPage);
      // Многоточие справа
      pages.push('...');
    }
    // === ЛОГИКА ДЛЯ СТРАНИЦ 1-2 ===
    else if (currentPage <= 2) {
      // Показываем страницы 2 и 3, если они есть
      if (totalPages >= 2) pages.push(2);
      if (totalPages >= 3) pages.push(3);
      if (totalPages > 3) pages.push('...');
    }
    // === ЛОГИКА ДЛЯ СТРАНИЦ 8-10 ===
    else if (currentPage >= totalPages - 1) {
      pages.push('...');
      if (totalPages >= 2) pages.push(totalPages - 2);
      if (totalPages >= 1) pages.push(totalPages - 1);
    }

    // Всегда показываем последнюю страницу (если больше 1)
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const isDisabled = totalPages <= 1;

  return {
    pageNumbers: getPageNumbers(),
    isFirstPage,
    isLastPage,
    isDisabled,
  };
};