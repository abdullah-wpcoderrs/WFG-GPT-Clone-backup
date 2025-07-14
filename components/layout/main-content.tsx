import type React from "react"
interface MainContentProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function MainContent({ children, title, description }: MainContentProps) {
  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {(title || description) && (
          <div className="mb-6">
            {title && <h1 className="text-2xl font-semibold text-[#2C2C2C] mb-2">{title}</h1>}
            {description && <p className="text-gray-600">{description}</p>}
          </div>
        )}

        <div className="space-y-6">{children}</div>
      </div>
    </main>
  )
}
