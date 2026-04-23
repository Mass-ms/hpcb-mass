import rss from '@astrojs/rss'
import { getAllPosts, getDatabase } from '../../lib/notion/client'
import { getPostLink } from '../../lib/blog-helpers'
import { WORK_TAG_NAMES } from '../../constants'

export async function GET() {
  const [posts, database] = await Promise.all([getAllPosts(), getDatabase()])
  const items = posts.filter((post) =>
    post.Tags.some((tag) => WORK_TAG_NAMES.includes(tag.name))
  )

  return rss({
    title: `${database.Title} - 作品・出演`,
    description: database.Description,
    site: import.meta.env.SITE,
    items: items.map((post) => ({
      link: new URL(getPostLink(post.Slug), import.meta.env.SITE).toString(),
      title: post.Title,
      description: post.Excerpt,
      pubDate: new Date(post.Date),
    })),
  })
}
