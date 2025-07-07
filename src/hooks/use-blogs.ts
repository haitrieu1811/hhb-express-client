import { useQuery } from '@tanstack/react-query'
import React from 'react'

import blogsApis from '~/apis/blogs.apis'
import { PaginationReqParams } from '~/types/utils.types'

export default function useBlogs(query?: PaginationReqParams) {
  const getBlogsQuery = useQuery({
    queryKey: ['get-blogs', query],
    queryFn: () => blogsApis.getBlogs(query)
  })

  const blogs = React.useMemo(() => getBlogsQuery.data?.data.data.blogs ?? [], [getBlogsQuery.data?.data.data.blogs])

  const totalBlogs = getBlogsQuery.data?.data.data.pagination.totalRows ?? 0

  return {
    blogs,
    totalBlogs,
    getBlogsQuery
  }
}
