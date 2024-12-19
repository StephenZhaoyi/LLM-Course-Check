import React from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const getPageNumbers = () => {
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-1 mt-4">

      <button
        className={`size-8 p-1 rounded ${
          currentPage === 1 ? "text-gray-400" : "text-tum-blue"
        }`}
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
      >
        &lt;
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`size-8 p-1 ${
            currentPage === page
              ? "bg-tum-blue text-white"
              : "text-tum-blue"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        className={`size-8 p-1 rounded ${
          currentPage === totalPages ? "text-gray-400" : "text-tum-blue"
        }`}
        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
