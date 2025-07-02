import { useQuery } from '@tanstack/react-query'
import React from 'react'

import blogsApis from '~/apis/blogs.apis'

export default function useBlog({ blogId }: { blogId: string }) {
  const getBlogQuery = useQuery({
    queryKey: ['get-blog', blogId],
    queryFn: () => blogsApis.getBlog(blogId),
    enabled: !!blogId
  })

  const blog = React.useMemo(() => getBlogQuery.data?.data.data.blog, [getBlogQuery.data?.data.data.blog])

  return {
    blog,
    getBlogQuery
  }
}
