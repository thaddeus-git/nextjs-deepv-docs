import MermaidDiagram from './MermaidDiagram'
import { ReactNode } from 'react'

interface CodeProps {
  children: ReactNode
  className?: string
}

function CustomCode({ children, className }: CodeProps) {
  const language = className?.replace('language-', '') || ''
  const codeString = String(children).replace(/\n$/, '')

  // Handle Mermaid diagrams
  if (language === 'mermaid' || codeString.trim().startsWith('flowchart') || codeString.trim().startsWith('graph')) {
    return <MermaidDiagram chart={codeString} />
  }

  // Handle regular code blocks
  return (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
      <code className={className}>
        {children}
      </code>
    </pre>
  )
}

function CustomPre({ children }: { children: ReactNode }) {
  return <>{children}</>
}

function CustomInlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  )
}

export const mdxComponents = {
  code: CustomCode,
  pre: CustomPre,
  // Override inline code
  'code:not(pre code)': CustomInlineCode,
  // Add proper styling for common elements
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-6 border-b border-gray-200 pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }: { children: ReactNode }) => (
    <p className="text-gray-700 leading-7 mb-4">
      {children}
    </p>
  ),
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="list-disc pl-6 mb-4 space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: ReactNode }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2">
      {children}
    </ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="text-gray-700">
      {children}
    </li>
  ),
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">
      {children}
    </blockquote>
  ),
  table: ({ children }: { children: ReactNode }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border border-gray-300">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: { children: ReactNode }) => (
    <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">
      {children}
    </th>
  ),
  td: ({ children }: { children: ReactNode }) => (
    <td className="border border-gray-300 px-4 py-2">
      {children}
    </td>
  ),
}