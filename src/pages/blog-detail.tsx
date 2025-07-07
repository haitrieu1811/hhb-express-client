import dompurify from 'dompurify'
import { Loader2 } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { useParams } from 'react-router'

import BlogItem from '~/components/blog-item'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import useBlog from '~/hooks/use-blog'
import useBlogs from '~/hooks/use-blogs'
import { convertMomentFromNowToVietnamese, getIdFromNameId } from '~/lib/utils'

export default function BlogDetailPage() {
  const params = useParams()
  const nameId = params.nameId
  const blogId = getIdFromNameId(nameId ?? '')

  const { blog, getBlogQuery } = useBlog({ blogId })
  const { blogs } = useBlogs()

  return (
    <div className='grid gap-4'>
      <Card>
        {blog && !getBlogQuery.isLoading && (
          <React.Fragment>
            <CardHeader>
              <CardTitle className='text-2xl'>{blog.title}</CardTitle>
              <CardDescription>
                Cập nhật {convertMomentFromNowToVietnamese(moment(blog.updatedAt).fromNow())}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                dangerouslySetInnerHTML={{
                  __html: dompurify.sanitize(blog.content)
                }}
                className='space-y-8'
              />
            </CardContent>
          </React.Fragment>
        )}
        {getBlogQuery.isLoading && (
          <div className='flex justify-center p-10'>
            <Loader2 className='animate-spin stroke-primary size-10 stroke-1' />
          </div>
        )}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Blog khác</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-12 gap-4'>
            {blogs.map((blog) => (
              <div key={blog._id} className='col-span-3'>
                <BlogItem blogData={blog} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
