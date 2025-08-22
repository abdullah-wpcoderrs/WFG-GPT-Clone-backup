// User presence status enum
export enum UserPresenceStatus {
  ONLINE = 'online',
  AWAY = 'away', 
  BUSY = 'busy',
  OFFLINE = 'offline'
}

// Message type enum
export enum MessageType {
  TEXT = 'text',
  FILE = 'file',
  IMAGE = 'image'
}

// Conversation status enum
export enum ConversationStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

// Mock data for user conversations
export const mockUserConversations = [
  {
    id: 'conv-1',
    participant_1_id: 'user-1',
    participant_2_id: 'user-2',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z',
    last_message_at: '2024-01-15T14:30:00Z',
    last_message_id: 'msg-3',
    is_archived: false,
    participant_1: {
      id: 'user-1',
      full_name: 'John Doe',
      email: 'john@company.com',
      avatar_url: null,
      status: 'active' as const
    },
    participant_2: {
      id: 'user-2', 
      full_name: 'Sarah Wilson',
      email: 'sarah@company.com',
      avatar_url: null,
      status: 'active' as const
    },
    last_message: {
      content: 'Thanks for the update on the project!',
      created_at: '2024-01-15T14:30:00Z',
      sender_id: 'user-2'
    }
  },
  {
    id: 'conv-2',
    participant_1_id: 'user-1',
    participant_2_id: 'user-3',
    created_at: '2024-01-14T09:15:00Z',
    updated_at: '2024-01-15T11:45:00Z',
    last_message_at: '2024-01-15T11:45:00Z',
    last_message_id: 'msg-6',
    is_archived: false,
    participant_1: {
      id: 'user-1',
      full_name: 'John Doe', 
      email: 'john@company.com',
      avatar_url: null,
      status: 'active' as const
    },
    participant_2: {
      id: 'user-3',
      full_name: 'Mike Johnson',
      email: 'mike@company.com', 
      avatar_url: null,
      status: 'active' as const
    },
    last_message: {
      content: 'Let me review the documents and get back to you',
      created_at: '2024-01-15T11:45:00Z',
      sender_id: 'user-1'
    }
  }
]

// Mock data for user messages
export const mockUserMessages = [
  {
    id: 'msg-1',
    conversation_id: 'conv-1',
    sender_id: 'user-1',
    content: 'Hi Sarah, how is the project coming along?',
    message_type: MessageType.TEXT,
    file_url: null,
    file_name: null,
    file_size: null,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    is_edited: false,
    is_deleted: false,
    read_by: ['user-1', 'user-2'],
    metadata: {},
    sender: {
      id: 'user-1',
      full_name: 'John Doe',
      avatar_url: null
    }
  },
  {
    id: 'msg-2', 
    conversation_id: 'conv-1',
    sender_id: 'user-2',
    content: 'Hi John! The project is going well. We\'re about 70% complete.',
    message_type: MessageType.TEXT,
    file_url: null,
    file_name: null,
    file_size: null,
    created_at: '2024-01-15T10:15:00Z',
    updated_at: '2024-01-15T10:15:00Z',
    is_edited: false,
    is_deleted: false,
    read_by: ['user-1', 'user-2'],
    metadata: {},
    sender: {
      id: 'user-2',
      full_name: 'Sarah Wilson',
      avatar_url: null
    }
  },
  {
    id: 'msg-3',
    conversation_id: 'conv-1', 
    sender_id: 'user-2',
    content: 'Thanks for the update on the project!',
    message_type: MessageType.TEXT,
    file_url: null,
    file_name: null,
    file_size: null,
    created_at: '2024-01-15T14:30:00Z',
    updated_at: '2024-01-15T14:30:00Z',
    is_edited: false,
    is_deleted: false,
    read_by: ['user-2'],
    metadata: {},
    sender: {
      id: 'user-2',
      full_name: 'Sarah Wilson',
      avatar_url: null
    }
  }
]

// Mock data for user presence
export const mockUserPresence = [
  {
    user_id: 'user-1',
    status: UserPresenceStatus.ONLINE,
    last_seen: '2024-01-15T15:00:00Z',
    current_page: '/dashboard/user/messages',
    is_typing_to: null,
    typing_started_at: null,
    updated_at: '2024-01-15T15:00:00Z'
  },
  {
    user_id: 'user-2',
    status: UserPresenceStatus.AWAY,
    last_seen: '2024-01-15T14:45:00Z',
    current_page: '/dashboard/user',
    is_typing_to: null,
    typing_started_at: null,
    updated_at: '2024-01-15T14:45:00Z'
  },
  {
    user_id: 'user-3',
    status: UserPresenceStatus.OFFLINE,
    last_seen: '2024-01-15T12:00:00Z',
    current_page: null,
    is_typing_to: null,
    typing_started_at: null,
    updated_at: '2024-01-15T12:00:00Z'
  }
]

// Mock data for team members search
export const mockTeamMembers = [
  {
    id: 'user-2',
    full_name: 'Sarah Wilson',
    email: 'sarah@company.com',
    avatar_url: null,
    status: 'active' as const,
    team_id: 'team-1'
  },
  {
    id: 'user-3', 
    full_name: 'Mike Johnson',
    email: 'mike@company.com',
    avatar_url: null,
    status: 'active' as const,
    team_id: 'team-1'
  },
  {
    id: 'user-4',
    full_name: 'Emily Davis',
    email: 'emily@company.com',
    avatar_url: null,
    status: 'active' as const,
    team_id: 'team-1'
  },
  {
    id: 'user-5',
    full_name: 'David Brown',
    email: 'david@company.com',
    avatar_url: null,
    status: 'active' as const,
    team_id: 'team-1'
  }
]

// Format relative time for message timestamps
export const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format user presence status
export const formatPresenceStatus = (status: UserPresenceStatus): string => {
  switch (status) {
    case UserPresenceStatus.ONLINE:
      return 'Online'
    case UserPresenceStatus.AWAY:
      return 'Away'
    case UserPresenceStatus.BUSY:
      return 'Busy'
    case UserPresenceStatus.OFFLINE:
      return 'Offline'
    default:
      return 'Unknown'
  }
}

// Format typing indicator text
export const formatTypingIndicator = (userNames: string[]): string => {
  if (userNames.length === 0) return ''
  if (userNames.length === 1) return `${userNames[0]} is typing...`
  if (userNames.length === 2) return `${userNames[0]} and ${userNames[1]} are typing...`
  return `${userNames[0]} and ${userNames.length - 1} others are typing...`
}