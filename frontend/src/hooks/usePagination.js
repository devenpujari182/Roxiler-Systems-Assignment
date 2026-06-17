import { useState } from 'react'

const usePagination = (defaultLimit = 10) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(defaultLimit)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const setPaginationData = ({ totalPages: tp, totalItems: ti, currentPage: cp }) => {
    if (tp !== undefined) setTotalPages(tp)
    if (ti !== undefined) setTotalItems(ti)
    if (cp !== undefined) setPage(cp)
  }

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p)
  }

  const nextPage = () => goToPage(page + 1)
  const prevPage = () => goToPage(page - 1)

  return {
    page,
    limit,
    totalPages,
    totalItems,
    setPage: goToPage,
    setLimit: (l) => { setLimit(l); setPage(1) },
    setPaginationData,
    nextPage,
    prevPage,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

export default usePagination
