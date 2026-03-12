import { Header } from '../components/layout/Header'
import { CreatePostForm } from '../components/post/CreatePostForm'
import { PostList } from '../components/post/PostList'

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-app-bg px-0 sm:px-4 sm:py-8">
      <main className="mx-auto max-w-feed overflow-hidden bg-white shadow-card sm:rounded-2xl sm:border sm:border-app-border">
        <Header />
        <div className="px-4 py-6 sm:px-6 sm:py-7">
          <CreatePostForm />
          <PostList />
        </div>
      </main>
    </div>
  )
}
