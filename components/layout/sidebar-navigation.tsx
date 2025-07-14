"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

interface SidebarNavigationProps {
  items: NavigationItem[]
}

export function SidebarNavigation({ items }: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "bg-white border-r border-[#E0E0E0] transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-[#E0E0E0]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center hover:bg-gray-50"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-12 transition-all duration-200",
                  isActive
                    ? "bg-[#EAF9FD] text-[#66BB6A] border border-[#66BB6A]/20"
                    : "hover:bg-gray-50 text-gray-700",
                  isCollapsed && "justify-center px-2",
                )}
              >
                <Icon
                  className={cn("w-5 h-5", isCollapsed ? "" : "mr-3", isActive ? "text-[#66BB6A]" : "text-gray-500")}
                />

                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.description && <span className="text-xs text-gray-500">{item.description}</span>}
                  </div>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
