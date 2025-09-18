'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
  id?: string
}

export default function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const diagramId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    })

    // Render the diagram
    if (containerRef.current) {
      mermaid.render(diagramId, chart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      }).catch((error) => {
        console.error('Mermaid rendering error:', error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre className="bg-red-50 border border-red-200 p-4 rounded text-red-700"><code>${chart}</code></pre>`
        }
      })
    }
  }, [chart, diagramId])

  return (
    <div 
      ref={containerRef}
      className="my-6 flex justify-center"
      style={{ minHeight: '100px' }}
    />
  )
}