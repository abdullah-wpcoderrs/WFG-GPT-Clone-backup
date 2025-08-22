# Real-Time User-to-User Chat Integration Documentation

## Overview

This document outlines the implementation of a real-time user-to-user messaging system for the GPT Desk application. The system will allow users within teams to communicate directly with each other in real-time, complementing the existing AI chat functionality.

## Current Architecture Analysis

### Existing Components That Can Be Reused

1. **Chat Interface Component** (`components/chat/chat-interface.tsx`)
   - **Reusable**: Message rendering, scroll behavior, input handling
   - **Modifications Needed**: Remove AI-specific features, add user presence indicators

2. **Supabase Real-time Infrastructure**
   - **Already Available**: Supabase Realtime subscriptions
   - **Current Usage**: Limited real-time features mentioned in documentation

3. **Database Schema**
   - **Existing Tables**: `users`, `teams`, `chat_sessions`, `chat_messages`
   - **Modifications Needed**: New tables for user conversations and presence

4. **Authentication System**
   - **Current**: Mock authentication with role-based access
   - **Available**: Supabase Auth integration ready

## Required Technologies and Dependencies

### New Dependencies to Add

```json
{
  "dependencies": {
    "@supabase/realtime-js": "^2.9.3",
    "react-use": "^17.4.0",
    "use-sound": "^4.0.1",
    "react-intersection-observer": "^9.5.3"
  }
}
```

### Existing Dependencies That Support Real-time

- `@supabase/supabase-js`: Already installed for real-time subscriptions
- `lucide-react`: For additional icons (online/offline indicators)
- `date-fns`: For message timestamps
- `@radix-ui/react-*`: For UI components

## Database Schema Extensions

### New Tables Required

#### 1. User Conversations Table
```sql
CREATE TABLE user_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    participant_2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_id UUID,
    is_archived BOOLEAN DEFAULT false,
    
    -- Ensure unique conversations between two users
    CONSTRAINT unique_conversation UNIQUE (
        LEAST(participant_1_id, participant_2_id),
        GREATEST(participant_1_id, participant_2_id)
    )
);
```

#### 2. User Messages Table
```sql
CREATE TABLE user_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES user_conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'file', 'image'
    file_url TEXT,
    file_name TEXT,
    file_size BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    read_by JSONB DEFAULT '[]'::jsonb, -- Array of user IDs who have read the message
    metadata JSONB DEFAULT '{}'::jsonb
);
```

#### 3. User Presence Table
```sql
CREATE TABLE user_presence (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'offline', -- 'online', 'away', 'busy', 'offline'
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_page TEXT,
    is_typing_to UUID REFERENCES users(id) ON DELETE SET NULL,
    typing_started_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. Message Reactions Table (Optional Enhancement)
```sql
CREATE TABLE message_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES user_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction VARCHAR(10) NOT NULL, -- emoji or reaction type
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_message_reaction UNIQUE (message_id, user_id, reaction)
);
```

### Indexes for Performance
```sql
-- User conversations indexes
CREATE INDEX idx_user_conversations_participant_1 ON user_conversations(participant_1_id);
CREATE INDEX idx_user_conversations_participant_2 ON user_conversations(participant_2_id);
CREATE INDEX idx_user_conversations_updated_at ON user_conversations(updated_at DESC);

-- User messages indexes
CREATE INDEX idx_user_messages_conversation_id ON user_messages(conversation_id);
CREATE INDEX idx_user_messages_sender_id ON user_messages(sender_id);
CREATE INDEX idx_user_messages_created_at ON user_messages(created_at DESC);
CREATE INDEX idx_user_messages_content_search ON user_messages USING gin(to_tsvector('english', content));

-- User presence indexes
CREATE INDEX idx_user_presence_status ON user_presence(status);
CREATE INDEX idx_user_presence_last_seen ON user_presence(last_seen);
```

### Database Functions
```sql
-- Function to get or create conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(user1_id UUID, user2_id UUID)
RETURNS UUID AS $$
DECLARE
    conversation_id UUID;
    p1_id UUID := LEAST(user1_id, user2_id);
    p2_id UUID := GREATEST(user1_id, user2_id);
BEGIN
    -- Try to find existing conversation
    SELECT id INTO conversation_id
    FROM user_conversations
    WHERE participant_1_id = p1_id AND participant_2_id = p2_id;
    
    -- If not found, create new conversation
    IF conversation_id IS NULL THEN
        INSERT INTO user_conversations (participant_1_id, participant_2_id)
        VALUES (p1_id, p2_id)
        RETURNING id INTO conversation_id;
    END IF;
    
    RETURN conversation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update conversation last message
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_conversations
    SET 
        last_message_at = NEW.created_at,
        last_message_id = NEW.id,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating conversation
CREATE TRIGGER update_conversation_on_message
    AFTER INSERT ON user_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();
```

## API Services Implementation

### User Chat API Service
```typescript
// lib/supabase/api/user-chat.ts
export class UserChatAPI {
  private supabase = createSupabaseClient()

  // Get user's conversations
  async getConversations(userId: string) {
    const { data, error } = await this.supabase
      .from('user_conversations')
      .select(`
        *,
        participant_1:users!participant_1_id(id, full_name, avatar_url, status),
        participant_2:users!participant_2_id(id, full_name, avatar_url, status),
        last_message:user_messages!last_message_id(content, created_at, sender_id)
      `)
      .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
      .eq('is_archived', false)
      .order('last_message_at', { ascending: false })

    return { data, error }
  }

  // Get or create conversation between two users
  async getOrCreateConversation(user1Id: string, user2Id: string) {
    const { data, error } = await this.supabase
      .rpc('get_or_create_conversation', {
        user1_id: user1Id,
        user2_id: user2Id
      })

    return { data, error }
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, limit = 50, offset = 0) {
    const { data, error } = await this.supabase
      .from('user_messages')
      .select(`
        *,
        sender:users!sender_id(id, full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    return { data: data?.reverse(), error }
  }

  // Send a message
  async sendMessage(conversationId: string, senderId: string, content: string, messageType = 'text') {
    const { data, error } = await this.supabase
      .from('user_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        message_type: messageType
      })
      .select(`
        *,
        sender:users!sender_id(id, full_name, avatar_url)
      `)
      .single()

    return { data, error }
  }

  // Mark messages as read
  async markAsRead(messageIds: string[], userId: string) {
    const { error } = await this.supabase
      .from('user_messages')
      .update({
        read_by: this.supabase.raw(`read_by || '["${userId}"]'::jsonb`)
      })
      .in('id', messageIds)

    return { error }
  }

  // Update typing status
  async updateTypingStatus(userId: string, typingToUserId: string | null) {
    const { error } = await this.supabase
      .from('user_presence')
      .upsert({
        user_id: userId,
        is_typing_to: typingToUserId,
        typing_started_at: typingToUserId ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })

    return { error }
  }

  // Update user presence
  async updatePresence(userId: string, status: 'online' | 'away' | 'busy' | 'offline', currentPage?: string) {
    const { error } = await this.supabase
      .from('user_presence')
      .upsert({
        user_id: userId,
        status,
        current_page: currentPage,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    return { error }
  }

  // Search users for new conversations
  async searchUsers(query: string, currentUserId: string, teamId?: string) {
    let queryBuilder = this.supabase
      .from('users')
      .select('id, full_name, email, avatar_url, status, team_id')
      .neq('id', currentUserId)
      .eq('status', 'active')
      .ilike('full_name', `%${query}%`)

    if (teamId) {
      queryBuilder = queryBuilder.eq('team_id', teamId)
    }

    const { data, error } = await queryBuilder.limit(10)
    return { data, error }
  }
}

export const userChatAPI = new UserChatAPI()
```

### Real-time Subscriptions Hook
```typescript
// hooks/use-realtime-chat.ts
export function useRealtimeChat(conversationId: string, userId: string) {
  const [messages, setMessages] = useState<UserMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    const supabase = createSupabaseClient()

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as UserMessage])
        }
      )
      .subscribe()

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel('typing-indicators')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_presence'
        },
        (payload) => {
          const presence = payload.new as UserPresence
          if (presence.is_typing_to === userId) {
            setTypingUsers(prev => 
              presence.typing_started_at 
                ? [...prev.filter(id => id !== presence.user_id), presence.user_id]
                : prev.filter(id => id !== presence.user_id)
            )
          }
        }
      )
      .subscribe()

    // Subscribe to user presence
    const presenceChannel = supabase
      .channel('user-presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        (payload) => {
          const presence = payload.new as UserPresence
          setOnlineUsers(prev => 
            presence.status === 'online'
              ? [...prev.filter(id => id !== presence.user_id), presence.user_id]
              : prev.filter(id => id !== presence.user_id)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(messagesChannel)
      supabase.removeChannel(typingChannel)
      supabase.removeChannel(presenceChannel)
    }
  }, [conversationId, userId])

  return { messages, typingUsers, onlineUsers, setMessages }
}
```

## Component Architecture

### 1. User Chat Interface Component
```typescript
// components/chat/user-chat-interface.tsx
interface UserChatInterfaceProps {
  conversationId: string
  otherUser: User
  currentUser: User
}

export function UserChatInterface({ conversationId, otherUser, currentUser }: UserChatInterfaceProps) {
  // Real-time subscriptions
  const { messages, typingUsers, onlineUsers, setMessages } = useRealtimeChat(conversationId, currentUser.id)
  
  // Message handling
  const sendMessage = async (content: string) => {
    const { data, error } = await userChatAPI.sendMessage(conversationId, currentUser.id, content)
    if (data) {
      setMessages(prev => [...prev, data])
    }
  }

  // Typing indicators
  const handleTyping = useCallback(
    debounce(() => {
      userChatAPI.updateTypingStatus(currentUser.id, null)
    }, 1000),
    []
  )

  return (
    <Card className="flex flex-col h-full">
      {/* Header with user info and online status */}
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>{otherUser.full_name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3>{otherUser.full_name}</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${onlineUsers.includes(otherUser.id) ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm text-gray-500">
                {onlineUsers.includes(otherUser.id) ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Messages area */}
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {messages.map(message => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isOwn={message.sender_id === currentUser.id}
            />
          ))}
          
          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <TypingIndicator users={typingUsers} />
          )}
        </ScrollArea>
      </CardContent>

      {/* Input area */}
      <CardFooter>
        <MessageInput 
          onSendMessage={sendMessage}
          onTyping={() => {
            userChatAPI.updateTypingStatus(currentUser.id, otherUser.id)
            handleTyping()
          }}
        />
      </CardFooter>
    </Card>
  )
}
```

### 2. Conversations List Component
```typescript
// components/chat/conversations-list.tsx
export function ConversationsList({ currentUser }: { currentUser: User }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      const { data } = await userChatAPI.getConversations(currentUser.id)
      setConversations(data || [])
    }
    loadConversations()
  }, [currentUser.id])

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col">
      {/* Search header */}
      <div className="p-4 border-b">
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Conversations list */}
      <ScrollArea className="flex-1">
        {conversations.map(conversation => (
          <ConversationItem 
            key={conversation.id}
            conversation={conversation}
            currentUser={currentUser}
          />
        ))}
      </ScrollArea>
    </div>
  )
}
```

### 3. New Chat Dialog Component
```typescript
// components/chat/new-chat-dialog.tsx
export function NewChatDialog({ currentUser, onConversationCreated }: NewChatDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])

  const searchUsers = async (query: string) => {
    if (query.length < 2) return
    const { data } = await userChatAPI.searchUsers(query, currentUser.id, currentUser.team_id)
    setUsers(data || [])
  }

  const startConversation = async (otherUser: User) => {
    const { data } = await userChatAPI.getOrCreateConversation(currentUser.id, otherUser.id)
    if (data) {
      onConversationCreated(data)
    }
  }

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              searchUsers(e.target.value)
            }}
          />
          
          <div className="space-y-2">
            {users.map(user => (
              <div 
                key={user.id}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => startConversation(user)}
              >
                <Avatar>
                  <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.full_name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## Navigation Integration

### Add Messages to Navigation
```typescript
// Update navigation items in dashboard pages
const navigationItems = [
  // ... existing items
  {
    name: "Messages",
    href: "/dashboard/user/messages",
    icon: MessageSquare,
    description: "Chat with team members"
  },
  // ... rest of items
]
```

### New Messages Page
```typescript
// app/dashboard/user/messages/page.tsx
export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  return (
    <DashboardLayout navigationItems={navigationItems} title="Messages">
      <div className="flex h-full">
        <ConversationsList 
          currentUser={user}
          onConversationSelect={setSelectedConversation}
        />
        
        {selectedConversation ? (
          <UserChatInterface 
            conversationId={selectedConversation}
            currentUser={user}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </DashboardLayout>
  )
}
```

## Security Considerations

### Row Level Security (RLS) Policies
```sql
-- User conversations policies
CREATE POLICY "Users can view their own conversations" ON user_conversations
    FOR SELECT USING (
        auth.uid() = participant_1_id OR 
        auth.uid() = participant_2_id
    );

CREATE POLICY "Users can create conversations" ON user_conversations
    FOR INSERT WITH CHECK (
        auth.uid() = participant_1_id OR 
        auth.uid() = participant_2_id
    );

-- User messages policies
CREATE POLICY "Users can view messages in their conversations" ON user_messages
    FOR SELECT USING (
        conversation_id IN (
            SELECT id FROM user_conversations 
            WHERE participant_1_id = auth.uid() OR participant_2_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages to their conversations" ON user_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        conversation_id IN (
            SELECT id FROM user_conversations 
            WHERE participant_1_id = auth.uid() OR participant_2_id = auth.uid()
        )
    );

-- User presence policies
CREATE POLICY "Users can view team member presence" ON user_presence
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users 
            WHERE team_id = get_user_team_id(auth.uid())
        )
    );

CREATE POLICY "Users can update their own presence" ON user_presence
    FOR ALL USING (user_id = auth.uid());
```

## Performance Optimizations

### 1. Message Pagination
- Implement infinite scroll for message history
- Load messages in batches of 50
- Cache recent conversations

### 2. Real-time Connection Management
- Limit active subscriptions per user
- Implement connection pooling
- Use presence heartbeat to detect disconnections

### 3. Database Optimizations
- Implement message archiving for old conversations
- Use database partitioning for large message tables
- Implement read replicas for heavy read operations

## Testing Strategy

### 1. Unit Tests
- Message sending/receiving
- Real-time subscription handling
- Presence status updates

### 2. Integration Tests
- End-to-end conversation flow
- Real-time synchronization
- Cross-browser compatibility

### 3. Performance Tests
- Concurrent user load testing
- Message throughput testing
- Real-time latency measurements

## Deployment Considerations

### 1. Environment Variables
```env
# Add to .env.local
NEXT_PUBLIC_ENABLE_USER_CHAT=true
NEXT_PUBLIC_MAX_MESSAGE_LENGTH=1000
NEXT_PUBLIC_TYPING_TIMEOUT=3000
```

### 2. Supabase Configuration
- Enable real-time on required tables
- Configure connection limits
- Set up monitoring and alerts

### 3. CDN and Caching
- Cache user avatars and profiles
- Implement message caching strategy
- Use CDN for file attachments

This implementation provides a robust, scalable real-time chat system that integrates seamlessly with your existing GPT Desk architecture while maintaining security and performance standards.