/** Flatten a Lexical rich-text value to plain text — used for JSON-LD (e.g. FAQPage answers). */
type LexicalNode = { text?: string; children?: LexicalNode[]; [k: string]: unknown }

export function lexicalToPlainText(data: unknown): string {
  const root = (data as { root?: LexicalNode } | null)?.root
  if (!root) return ''
  const walk = (node: LexicalNode): string => {
    if (typeof node?.text === 'string') return node.text
    if (Array.isArray(node?.children)) return node.children.map(walk).join(' ')
    return ''
  }
  return walk(root).replace(/\s+/g, ' ').trim()
}
