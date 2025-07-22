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
      className="flex cursor-pointer items-center rounded-lg border p-3 transition-colors hover:bg-gray-50"
    >
      <div className="mr-4">{iconMap[account.role]}</div>
      <div className="flex-grow">
        <p className="font-semibold">{account.name}</p>
        <p className="text-sm text-gray-500">{account.email}</p>
      </div>
      <div className="flex items-center space-x-4">
        <Badge variant={badgeVariantMap[account.role]}>{account.role.replace("_", " ")}</Badge>
        <p className="hidden text-sm text-gray-500 sm:block">{account.team}</p>
      </div>
    </div>
  )
}
