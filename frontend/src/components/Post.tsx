import { User } from './User'

interface PostProps {
  title: string
  contents?: string
  author?: string
}

export function Post({ title, contents, author }: PostProps) {
  return (
    <article>
      <h3>{title}</h3>
      <div>{contents}</div>
      {author && (
        <em>
          <br />
          Written by <User id={author} />
        </em>
      )}
    </article>
  )
}
