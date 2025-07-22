import type React from "react"
interface MainContentProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function MainContent({ children, title, description }: MainContentProps) {
  return (
    <main className="flex-1 flex flex-col min-h-0">
      {(title || description) && (
        <div className="mb-6 flex-shrink-0 px-6 pt-6">
          {title && <h1 className="text-2xl font-semibold text-[#2C2C2C] mb-2">{title}</h1>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}
      <div className="flex-1 min-h-0 px-6 pb-6">{children}</div>
    </main>
  )
}
