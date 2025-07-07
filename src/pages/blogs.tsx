import BlogItem from '~/components/blog-item'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import useBlogs from '~/hooks/use-blogs'

export default function BlogsPage() {
  const { blogs, totalBlogs } = useBlogs()
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>Danh sách bài viết</CardTitle>
        <CardDescription>Có {totalBlogs} bài viết</CardDescription>
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
  )
}
