import type { DraftMediaAttachment, MediaAttachment } from '../types'

export const MAX_MEDIA_ATTACHMENTS = 4

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

export const readImagesAsDrafts = async (files: File[]) => {
  const imageFiles = files.filter((file) => file.type.startsWith('image/'))

  const drafts = await Promise.all(
    imageFiles.map(async (file): Promise<DraftMediaAttachment> => ({
      id: crypto.randomUUID(),
      name: file.name,
      src: await readFileAsDataUrl(file),
      type: 'image',
    })),
  )

  return drafts
}

export const assignPostIdToMedia = (postId: number, media: DraftMediaAttachment[]): MediaAttachment[] =>
  media.map((item) => ({ ...item, postId }))
