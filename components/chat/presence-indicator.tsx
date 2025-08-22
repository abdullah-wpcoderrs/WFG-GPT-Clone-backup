"use client"

import { UserPresenceStatus, formatPresenceStatus } from '@/lib/chatMockData'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Circle } from 'lucide-react'

interface PresenceIndicatorProps {
  status: UserPresenceStatus
  lastSeen?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function PresenceIndicator({ 
  status, 
  lastSeen, 
  showText = false, 
  size = 'md' 
}: PresenceIndicatorProps) {
  const getStatusColor = (status: UserPresenceStatus) => {
    switch (status) {
      case UserPresenceStatus.ONLINE:
        return 'text-green-500'
      case UserPresenceStatus.AWAY:
        return 'text-yellow-500'
      case UserPresenceStatus.BUSY:
        return 'text-red-500'
      case UserPresenceStatus.OFFLINE:
        return 'text-gray-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusBadgeColor = (status: UserPresenceStatus) => {
    switch (status) {
      case UserPresenceStatus.ONLINE:
        return 'bg-green-100 text-green-800 border-green-200'
      case UserPresenceStatus.AWAY:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case UserPresenceStatus.BUSY:
        return 'bg-red-100 text-red-800 border-red-200'
      case UserPresenceStatus.OFFLINE:
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2'
      case 'lg':
        return 'w-4 h-4'
      default:
        return 'w-3 h-3'
    }
  }

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const tooltipContent = status === UserPresenceStatus.ONLINE 
    ? 'Online' 
    : lastSeen 
      ? `Last seen ${formatLastSeen(lastSeen)}`
      : formatPresenceStatus(status)

  if (showText) {
    return (
      <Badge className={`text-xs ${getStatusBadgeColor(status)}`}>
        <Circle className={`${getSizeClass('sm')} mr-1 fill-current ${getStatusColor(status)}`} />
        {formatPresenceStatus(status)}
      </Badge>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <Circle 
              className={`${getSizeClass(size)} ${getStatusColor(status)} fill-current ${
                status === UserPresenceStatus.ONLINE ? 'presence-indicator-online' : ''
              }`} 
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}