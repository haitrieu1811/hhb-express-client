import moment from 'moment'
import { Link } from 'react-router'

import PATH from '~/constants/path'
import { convertMomentFromNowToVietnamese } from '~/lib/utils'
import { BlogItem as BlogItemType } from '~/types/blogs.types'

export default function BlogItem({ blogData }: { blogData: BlogItemType }) {
  return (
    <div className='grid gap-2'>
      <Link
        to={PATH.BLOG_DETAIL({
          name: blogData.title,
          id: blogData._id
        })}
      >
        <img
          src={blogData.thumbnail.url}
          alt={blogData.title}
          className='w-full aspect-video object-cover rounded-md'
        />
      </Link>
      <Link
        to={PATH.BLOG_DETAIL({
          name: blogData.title,
          id: blogData._id
        })}
        className='font-medium hover:underline text-sm line-clamp-2'
      >
        {blogData.title}
      </Link>
      <p className='text-sm text-muted-foreground'>
        {convertMomentFromNowToVietnamese(moment(blogData.createdAt).fromNow())}
      </p>
    </div>
  )
}
