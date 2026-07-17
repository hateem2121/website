import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/** Renders Payload Lexical rich text with the site's prose styling (see `.prose-run` in globals.css). */
export function RichText({ data, className = '' }: { data: unknown; className?: string }) {
  if (!data || typeof data !== 'object') return null
  return (
    <div className={`prose-run ${className}`.trim()}>
      <LexicalRichText data={data as SerializedEditorState} />
    </div>
  )
}
