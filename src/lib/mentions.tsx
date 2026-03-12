import { Fragment, type ReactNode } from 'react'

const mentionTokenRegex = /(@[A-Za-z0-9_.-]+)/g

const normalizeMention = (value: string) => value.replace(/^@+/, '').trim().toLowerCase()

export const extractMentions = (value: string) =>
  Array.from(
    new Set(
      (value.match(mentionTokenRegex) ?? [])
        .map(normalizeMention)
        .filter(Boolean),
    ),
  )

export const mentionsUser = (value: string, username: string) =>
  extractMentions(value).includes(normalizeMention(username))

export const renderTextWithMentions = (value: string): ReactNode =>
  value.split(mentionTokenRegex).map((part, index) => {
    const isMention = mentionTokenRegex.test(part)
    mentionTokenRegex.lastIndex = 0

    if (!isMention) return <Fragment key={`${part}-${index}`}>{part}</Fragment>

    return (
      <span key={`${part}-${index}`} className="font-semibold text-primary">
        {part}
      </span>
    )
  })
