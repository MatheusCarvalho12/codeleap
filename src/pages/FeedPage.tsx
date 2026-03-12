import { Header } from '../components/layout/Header'
import { CreatePostForm } from '../components/post/CreatePostForm'
import { PostList } from '../components/post/PostList'

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header />
      <main className="mx-auto max-w-feed py-4 sm:py-6">
        <div className="rounded-none sm:rounded-2xl overflow-hidden shadow-card">
          <CreatePostForm />
          <PostList />
        </div>
      </main>
    </div>
  )
}
