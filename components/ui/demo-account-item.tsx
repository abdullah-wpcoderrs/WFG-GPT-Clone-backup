import type React from "react"
import { Crown, ShieldCheck, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const iconMap: { [key: string]: React.ReactElement } = {
  SUPER_ADMIN: <Crown className="h-5 w-5 text-yellow-500" />,
  ADMIN: <ShieldCheck className="h-5 w-5 text-blue-500" />,
  USER: <User className="h-5 w-5 text-gray-500" />,
}

const badgeVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" | null | undefined } = {
    SUPER_ADMIN: "destructive",
    ADMIN: "default",
    USER: "secondary",
  }

export type DemoAccount = {
  name: string
  email: string
  role: "SUPER_ADMIN" | "ADMIN" | "USER"
  team: string
}

interface DemoAccountItemProps {
  account: DemoAccount
  onClick: (email: string) => void
}

export function DemoAccountItem({ account, onClick }: DemoAccountItemProps) {
  return (
    <div
      onClick={() => onClick(account.email)}
      className="flex cursor-pointer items-center rounded-lg border p-4 transition-colors hover:bg-gray-50 bg-white"
    >
      <div className="mr-3 flex-shrink-0">{iconMap[account.role]}</div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex-grow min-w-0">
            <p className="font-medium text-gray-900 truncate">{account.name}</p>
            <p className="text-sm text-blue-600 truncate">{account.email}</p>
            <p className="text-xs text-gray-500 mt-0.5">{account.team}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <Badge 
              variant={badgeVariantMap[account.role]}
              className="text-xs font-medium px-2 py-1"
            >
              {account.role.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
