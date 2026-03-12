import { useDeferredValue, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { usePosts } from '../../hooks/usePosts'
import { extractMentions, mentionsUser } from '../../lib/mentions'
import { usePostExtrasStore } from '../../store/usePostExtrasStore'
import { PostCard } from './PostCard'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useUserStore } from '../../store/useUserStore'

type SortOption = 'recent' | 'oldest' | 'title' | 'most-discussed'
type FilterOption = 'all' | 'mine' | 'liked' | 'with-media' | 'mentions-me'

export const PostList = () => {
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [query, setQuery] = useState('')
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = usePosts()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const username = useUserStore((s) => s.username)
  const likedPostIds = usePostExtrasStore((s) => s.likedPostIds)
  const commentsByPost = usePostExtrasStore((s) => s.commentsByPost)
  const mediaByPost = usePostExtrasStore((s) => s.mediaByPost)
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12 text-primary bg-white">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-center text-muted py-12 bg-white">
        Failed to load posts. Please refresh.
      </p>
    )
  }

  const posts = data?.pages.flatMap((p) => p.results) ?? []
  const filteredPosts = posts
    .filter((post) => {
      if (filterBy === 'mine') return post.username === username
      if (filterBy === 'liked') return likedPostIds.includes(post.id)
      if (filterBy === 'with-media') return (mediaByPost[post.id] ?? []).length > 0
      if (filterBy === 'mentions-me') {
        return (
          mentionsUser(post.content, username) ||
          (commentsByPost[post.id] ?? []).some((comment) => mentionsUser(comment.content, username))
        )
      }
      return true
    })
    .filter((post) => {
      if (!deferredQuery) return true

      const haystack = [
        post.title,
        post.content,
        post.username,
        ...extractMentions(post.content),
        ...(commentsByPost[post.id] ?? []).map((comment) => comment.content),
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(deferredQuery)
    })
    .sort((left, right) => {
      if (sortBy === 'oldest') {
        return new Date(left.created_datetime).getTime() - new Date(right.created_datetime).getTime()
      }

      if (sortBy === 'title') {
        return left.title.localeCompare(right.title)
      }

      if (sortBy === 'most-discussed') {
        return (commentsByPost[right.id] ?? []).length - (commentsByPost[left.id] ?? []).length
      }

      return new Date(right.created_datetime).getTime() - new Date(left.created_datetime).getTime()
    })

  return (
    <section className="mt-6 flex flex-col gap-4">
      <div className="rounded-2xl border border-app-border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-bold text-black">Explore posts</h3>
            <p className="text-sm text-muted">
              Sort, filter, search, and surface posts that mention you or include media.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, author or mention"
              className="h-10 min-w-[220px] rounded-lg border border-app-border px-3 text-sm outline-none transition-colors focus:border-primary"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 rounded-lg border border-app-border px-3 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A-Z</option>
              <option value="most-discussed">Most discussed</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {([
            ['all', 'All'],
            ['mine', 'My posts'],
            ['liked', 'Liked'],
            ['with-media', 'With media'],
            ['mentions-me', 'Mentions me'],
          ] as Array<[FilterOption, string]>).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilterBy(value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                filterBy === value
                  ? 'border-primary bg-primary text-white'
                  : 'border-app-border bg-white text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted">
        <span>{filteredPosts.length} posts visible</span>
        <span>{posts.length} loaded from the API</span>
      </div>

      <div className="flex flex-col gap-4">
      <AnimatePresence mode="popLayout">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </AnimatePresence>
      </div>

      {!isLoading && filteredPosts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-app-border bg-white px-4 py-12 text-center text-sm text-muted">
          No posts match the current search and filters.
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4 text-primary">
          <LoadingSpinner size={24} />
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <p className="text-center text-muted text-sm py-4">No more posts</p>
      )}
    </section>
  )
}
