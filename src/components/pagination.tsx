import { createSearchParams, useLocation, useNavigate } from 'react-router'

import { useSearchParams } from 'react-router'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination'

const RANGE = 2

type PaginationProps = {
  totalPages: number
}

export default function PaginationV2({ totalPages }: PaginationProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])

  const page = Number(queryParams.page) || 1

  const renderPagination = () => {
    let dotBefore = false
    let dotAfter = false

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <PaginationItem key={index}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <PaginationItem key={index}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }

    return Array(totalPages)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        const isActive = pageNumber === page

        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < totalPages - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < totalPages - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < totalPages - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= totalPages - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }

        return (
          <PaginationItem
            key={index}
            onClick={() =>
              navigate({
                pathname: location.pathname,
                search: createSearchParams({
                  ...queryParams,
                  page: pageNumber.toString()
                }).toString()
              })
            }
          >
            <PaginationLink isActive={isActive}>{pageNumber}</PaginationLink>
          </PaginationItem>
        )
      })
  }

  return (
    <Pagination>
      <PaginationContent>
        {page === 1 ? (
          <PaginationItem className='pointer-events-none opacity-50'>
            <PaginationPrevious />
          </PaginationItem>
        ) : (
          <PaginationItem
            onClick={() =>
              navigate({
                pathname: location.pathname,
                search: createSearchParams({
                  ...queryParams,
                  page: (page - 1).toString()
                }).toString()
              })
            }
          >
            <PaginationPrevious />
          </PaginationItem>
        )}

        {renderPagination()}

        {page === totalPages ? (
          <PaginationItem className='pointer-events-none opacity-50'>
            <PaginationNext />
          </PaginationItem>
        ) : (
          <PaginationItem
            onClick={() =>
              navigate({
                pathname: location.pathname,
                search: createSearchParams({
                  ...queryParams,
                  page: (page + 1).toString()
                }).toString()
              })
            }
          >
            <PaginationNext />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
