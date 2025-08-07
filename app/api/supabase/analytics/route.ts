import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/client'
import { analyticsAPI } from '@/lib/supabase/api/analytics'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to view analytics
    const { data: userProfile } = await supabase
      .from('users')
      .select('role, team_id')
      .eq('id', user.id)
      .single()

    if (!userProfile || !['admin', 'super_admin'].includes(userProfile.role || '')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'dashboard'
    const teamId = userProfile.role === 'super_admin' 
      ? searchParams.get('teamId') || undefined 
      : userProfile.team_id

    const dateRange = {
      from: searchParams.get('from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      to: searchParams.get('to') || new Date().toISOString()
    }

    let data, error

    switch (type) {
      case 'usage':
        ({ data, error } = await analyticsAPI.getUsageStats({ teamId, dateRange }))
        break
      case 'costs':
        ({ data, error } = await analyticsAPI.getCostAnalysis({ teamId, dateRange }))
        break
      case 'audit':
        ({ data, error } = await analyticsAPI.getAuditStats({ teamId, dateRange }))
        break
      case 'dashboard':
      default:
        ({ data, error } = await analyticsAPI.getDashboardMetrics(teamId, dateRange))
        break
    }

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}