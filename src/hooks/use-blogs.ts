import { useQuery } from '@tanstack/react-query'
import React from 'react'

import blogsApis from '~/apis/blogs.apis'

export default function useBlogs() {
  const getBlogsQuery = useQuery({
    queryKey: ['get-blogs'],
    queryFn: () => blogsApis.getBlogs()
  })

  const blogs = React.useMemo(() => getBlogsQuery.data?.data.data.blogs ?? [], [getBlogsQuery.data?.data.data.blogs])

  const totalBlogs = getBlogsQuery.data?.data.data.pagination.totalRows ?? 0

  return {
    blogs,
    totalBlogs,
    getBlogsQuery
  }
}
