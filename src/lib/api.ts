import axios from 'axios'
import type { Post, PostsResponse, CreatePostPayload, UpdatePostPayload } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://dev.codeleap.co.uk/careers/',
})

export const listPosts = async (offset = 0, limit = 10): Promise<PostsResponse> => {
  const { data } = await api.get<PostsResponse>('', { params: { limit, offset } })
  return data
}

export const createPost = async (payload: CreatePostPayload): Promise<Post> => {
  const { data } = await api.post<Post>('', payload)
  return data
}

export const updatePost = async (id: number, payload: UpdatePostPayload): Promise<Post> => {
  const { data } = await api.patch<Post>(`${id}/`, payload)
  return data
}

export const deletePost = async (id: number): Promise<void> => {
  await api.delete(`${id}/`)
}
