# Migration Guide: From Mock Data to Supabase Backend

This guide will help you migrate your existing GPT Desk application from using mock data to the new Supabase backend.

## Overview

The migration involves:
1. Setting up Supabase (covered in `SUPABASE_SETUP.md`)
2. Updating authentication system
3. Replacing mock data with API calls
4. Updating components to use new data structure
5. Testing the migration

## Step 1: Update Authentication

### Replace the old auth hook with Supabase auth:

**Before:**
```typescript
// hooks/use-auth.tsx
import { mockUsers } from "@/lib/mock-data"
```

**After:**
```typescript
// Use the new Supabase auth hook
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
```

### Update your layout.tsx:

```typescript
// app/layout.tsx
import { SupabaseAuthProvider } from "@/hooks/use-supabase-auth"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Step 2: Update API Routes

### Replace existing API routes:

**Before:**
```typescript
// app/api/gpts/route.ts
import { mockGPTs } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json(mockGPTs)
}
```

**After:**
```typescript
// Use the new Supabase routes
// app/api/supabase/gpts/route.ts (already created)
```

### Update your components to use new endpoints:

**Before:**
```typescript
const response = await fetch("/api/gpts")
```

**After:**
```typescript
const response = await fetch("/api/supabase/gpts")
```

## Step 3: Update Components

### Update GPTs Page:

```typescript
// app/dashboard/admin/gpts/page.tsx

// Replace this:
import { mockGPTs } from "@/lib/mock-data"

// With this:
import { gptsAPI } from "@/lib/supabase/api/gpts"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"

export default function AdminGPTsPage() {
  const { user } = useSupabaseAuth() // Instead of useAuth()
  const [gpts, setGpts] = useState<GPT[]>([])

  useEffect(() => {
    const fetchGpts = async () => {
      try {
        // Use the new API endpoint
        const response = await fetch("/api/supabase/gpts")
        if (response.ok) {
          const data = await response.json()
          setGpts(data)
        }
      } catch (error) {
        console.error("Failed to fetch GPTs:", error)
      }
    }

    fetchGpts()
  }, [])

  // Rest of your component...
}
```

### Update Chat Sessions Page:

```typescript
// app/dashboard/admin/chats/page.tsx

// Replace mock data imports
import { chatAPI } from "@/lib/supabase/api/chat"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"

export default function AdminChatsPage() {
  const { user } = useSupabaseAuth()
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/supabase/chat/sessions")
        if (response.ok) {
          const data = await response.json()
          setSessions(data)
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error)
      }
    }

    fetchSessions()
  }, [])

  // Rest of your component...
}
```

## Step 4: Update Type Definitions

### Update your types to match the database schema:

```typescript
// types/index.ts

// Replace with database types
export type { Database } from '@/lib/supabase/database.types'

// Use the generated types
export type User = Database['public']['Tables']['users']['Row']
export type GPT = Database['public']['Tables']['gpts']['Row']
export type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type Template = Database['public']['Tables']['templates']['Row']
```

## Step 5: Update Data Fetching Patterns

### Use the new API services directly in components:

```typescript
// Instead of importing mock data
import { gptsAPI, chatAPI, usersAPI } from '@/lib/supabase/api'

// In your component
const [gpts, setGpts] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const loadData = async () => {
    try {
      const { data, error } = await gptsAPI.getGPTs({
        teamId: user?.team_id,
        status: 'active'
      })
      
      if (error) {
        console.error('Error:', error)
      } else {
        setGpts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  loadData()
}, [user])
```

## Step 6: Handle Loading and Error States

### Add proper loading and error handling:

```typescript
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/supabase/gpts')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [])

// In your JSX
if (loading) return <div>Loading...</div>
if (error) return <div>Error: {error}</div>
```

## Step 7: Update Form Submissions

### Update create/update operations:

```typescript
// Creating a new GPT
const handleCreateGPT = async (gptData) => {
  try {
    const response = await fetch('/api/supabase/gpts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gptData),
    })

    if (!response.ok) {
      throw new Error('Failed to create GPT')
    }

    const newGPT = await response.json()
    setGpts(prev => [newGPT, ...prev])
    
    toast({
      title: "Success",
      description: "GPT created successfully",
    })
  } catch (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    })
  }
}
```

## Step 8: Update Authentication Flows

### Update login/logout handling:

```typescript
// Login component
import { useSupabaseAuth } from '@/hooks/use-supabase-auth'

export default function LoginPage() {
  const { signIn, loading } = useSupabaseAuth()
  
  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password)
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error,
        variant: "destructive",
      })
    } else {
      router.push('/dashboard')
    }
  }

  // Rest of component...
}
```

## Step 9: Update Permission Checks

### Use the new permission system:

```typescript
import { usePermissions } from '@/hooks/use-supabase-auth'

export default function SomeComponent() {
  const { canManageUsers, canViewAnalytics, isAdmin } = usePermissions()

  return (
    <div>
      {canManageUsers && (
        <Button>Manage Users</Button>
      )}
      {canViewAnalytics && (
        <Link href="/analytics">View Analytics</Link>
      )}
    </div>
  )
}
```

## Step 10: Test the Migration

### Create a testing checklist:

- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] GPTs can be created, read, updated, deleted
- [ ] Chat sessions work properly
- [ ] Messages are saved and retrieved
- [ ] File uploads work (if implemented)
- [ ] Team permissions are enforced
- [ ] Analytics data is displayed correctly
- [ ] Audit logs are being created

### Test with different user roles:

1. **Regular User**: Can create GPTs, chat, manage own data
2. **Admin**: Can manage team members, view team analytics
3. **Super Admin**: Can manage all teams, view all data

## Common Issues and Solutions

### Issue: Authentication not working
**Solution**: Check your Supabase URL and keys in `.env.local`

### Issue: RLS policies blocking access
**Solution**: Verify RLS policies are correctly set up and user has proper team assignment

### Issue: Type errors
**Solution**: Regenerate database types with `supabase gen types typescript`

### Issue: Data not loading
**Solution**: Check browser console for errors, verify API endpoints are correct

## Performance Considerations

### Implement pagination for large datasets:

```typescript
const [gpts, setGpts] = useState([])
const [hasMore, setHasMore] = useState(true)
const [offset, setOffset] = useState(0)
const limit = 20

const loadMore = async () => {
  const { data } = await gptsAPI.getGPTs({
    limit,
    offset,
    teamId: user?.team_id
  })
  
  if (data && data.length > 0) {
    setGpts(prev => [...prev, ...data])
    setOffset(prev => prev + limit)
    setHasMore(data.length === limit)
  } else {
    setHasMore(false)
  }
}
```

### Use React Query for better caching:

```typescript
import { useQuery } from '@tanstack/react-query'

const { data: gpts, isLoading, error } = useQuery({
  queryKey: ['gpts', user?.team_id],
  queryFn: () => gptsAPI.getGPTs({ teamId: user?.team_id }),
  enabled: !!user?.team_id
})
```

## Rollback Plan

If you need to rollback:

1. Keep your mock data files
2. Switch back to the old auth hook
3. Revert API endpoint changes
4. Update components to use mock data again

## Next Steps

After successful migration:

1. Remove mock data files
2. Remove old API routes
3. Add real-time subscriptions for live updates
4. Implement advanced analytics
5. Add file processing capabilities
6. Set up monitoring and alerting

Your application now has a robust, scalable backend with proper authentication, authorization, and data persistence!