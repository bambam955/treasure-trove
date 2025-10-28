import { Fragment } from 'react'
import { Post } from './Post'

interface PostItem {
  _id: string
  title: string
  contents?: string
  author?: string
}

interface PostListProps {
  posts?: PostItem[]
}

export function PostList({ posts = [] }: PostListProps) {
  return (
    <div>
      {posts.map((post) => (
        <Fragment key={post._id}>
          <Post {...post} />
          <hr />
        </Fragment>
      ))}
    </div>
  )
}
