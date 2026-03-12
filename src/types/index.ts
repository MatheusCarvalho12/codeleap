export interface Post {
  id: number
  username: string
  created_datetime: string
  title: string
  content: string
}

export interface PostsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Post[]
}

export interface CreatePostPayload {
  username: string
  title: string
  content: string
}

export interface UpdatePostPayload {
  title: string
  content: string
}

export interface Comment {
  id: string
  postId: number
  username: string
  content: string
  createdAt: string
}

export interface DraftMediaAttachment {
  id: string
  name: string
  src: string
  type: 'image'
}

export interface MediaAttachment extends DraftMediaAttachment {
  postId: number
}

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}
