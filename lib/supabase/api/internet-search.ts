// Internet Search API Service
// This service handles internet search functionality with caching

import { createSupabaseAdminClient } from '@/lib/supabase/client'

export class InternetSearchAPI {
  private supabase = createSupabaseAdminClient()

  // Search the internet using multiple providers
  async searchInternet(query: string, options?: {
    provider?: 'google' | 'bing' | 'duckduckgo'
    maxResults?: number
    useCache?: boolean
  }) {
    try {
      const { provider = 'google', maxResults = 10, useCache = true } = options || {}

      // Check cache first if enabled
      if (useCache) {
        const cachedResult = await this.getCachedResults(query, provider)
        if (cachedResult) {
          return {
            success: true,
            results: cachedResult,
            source: 'cache'
          }
        }
      }

      // Perform actual search based on provider
      let searchResults
      switch (provider) {
        case 'google':
          searchResults = await this.searchGoogle(query, maxResults)
          break
        case 'bing':
          searchResults = await this.searchBing(query, maxResults)
          break
        case 'duckduckgo':
          searchResults = await this.searchDuckDuckGo(query, maxResults)
          break
        default:
          throw new Error(`Unsupported search provider: ${provider}`)
      }

      // Cache the results if cache is enabled
      if (useCache && searchResults) {
        await this.cacheSearchResults(query, provider, searchResults)
      }

      return {
        success: true,
        results: searchResults,
        source: 'live'
      }
    } catch (error) {
      console.error('Error searching internet:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        results: []
      }
    }
  }

  // Google Custom Search implementation
  private async searchGoogle(query: string, maxResults: number) {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID

    if (!apiKey || !searchEngineId) {
      throw new Error('Google Search API credentials not configured')
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=${Math.min(maxResults, 10)}`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Google Search API error: ${data.error?.message || 'Unknown error'}`)
    }

    return this.formatGoogleResults(data)
  }

  // Bing Search implementation
  private async searchBing(query: string, maxResults: number) {
    const apiKey = process.env.BING_SEARCH_API_KEY

    if (!apiKey) {
      throw new Error('Bing Search API key not configured')
    }

    const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=${Math.min(maxResults, 50)}`

    const response = await fetch(url, {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Bing Search API error: ${data.error?.message || 'Unknown error'}`)
    }

    return this.formatBingResults(data)
  }

  // DuckDuckGo Search implementation (using their instant answer API)
  private async searchDuckDuckGo(query: string, maxResults: number) {
    // Note: DuckDuckGo doesn't provide a comprehensive search API
    // This is a simplified implementation using their instant answer API
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error('DuckDuckGo Search API error')
    }

    return this.formatDuckDuckGoResults(data)
  }

  // Format Google search results
  private formatGoogleResults(data: any) {
    if (!data.items) return []

    return data.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
      formattedUrl: item.formattedUrl,
      source: 'google'
    }))
  }

  // Format Bing search results
  private formatBingResults(data: any) {
    if (!data.webPages?.value) return []

    return data.webPages.value.map((item: any) => ({
      title: item.name,
      link: item.url,
      snippet: item.snippet,
      displayLink: item.displayUrl,
      formattedUrl: item.url,
      source: 'bing'
    }))
  }

  // Format DuckDuckGo search results
  private formatDuckDuckGoResults(data: any) {
    const results = []

    // Add abstract if available
    if (data.Abstract) {
      results.push({
        title: data.Heading || 'DuckDuckGo Answer',
        link: data.AbstractURL || '',
        snippet: data.Abstract,
        displayLink: data.AbstractSource || '',
        formattedUrl: data.AbstractURL || '',
        source: 'duckduckgo'
      })
    }

    // Add related topics
    if (data.RelatedTopics) {
      data.RelatedTopics.forEach((topic: any) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || 'Related Topic',
            link: topic.FirstURL,
            snippet: topic.Text,
            displayLink: new URL(topic.FirstURL).hostname,
            formattedUrl: topic.FirstURL,
            source: 'duckduckgo'
          })
        }
      })
    }

    return results
  }

  // Get cached search results
  private async getCachedResults(query: string, provider: 'google' | 'bing' | 'duckduckgo') {
    try {
      const { data, error } = await this.supabase
        .rpc('get_cached_search_results', {
          p_query: query,
          p_provider: provider
        })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error getting cached search results:', error)
      return null
    }
  }

  // Cache search results
  private async cacheSearchResults(query: string, provider: 'google' | 'bing' | 'duckduckgo', results: any) {
    try {
      const { error } = await this.supabase
        .rpc('cache_search_results', {
          p_query: query,
          p_provider: provider,
          p_results: results
        })

      if (error) throw error
    } catch (error) {
      console.error('Error caching search results:', error)
      // Don't throw here as caching failure shouldn't affect the search
    }
  }

  // Search and summarize results using AI
  async searchAndSummarize(query: string, options?: {
    provider?: 'google' | 'bing' | 'duckduckgo'
    maxResults?: number
    summaryLength?: 'short' | 'medium' | 'long'
  }) {
    try {
      const { maxResults = 5, summaryLength = 'medium' } = options || {}

      // Get search results
      const searchResponse = await this.searchInternet(query, { ...options, maxResults })
      
      if (!searchResponse.success) {
        throw new Error(searchResponse.error)
      }

      const results = searchResponse.results

      if (!results || results.length === 0) {
        return {
          success: true,
          summary: 'No search results found.',
          results: [],
          sources: []
        }
      }

      // Create summary prompt
      const snippets = results.map((result: any) => 
        `${result.title}: ${result.snippet}`
      ).join('\n\n')

      const summaryPrompt = `Based on the following search results for the query "${query}", provide a ${summaryLength} summary:

${snippets}

Please provide a comprehensive and accurate summary based on these search results.`

      // You would use your AI service here to generate the summary
      // For now, we'll return the raw results
      return {
        success: true,
        summary: `Search results for "${query}" (${results.length} results found)`,
        results: results,
        sources: results.map((r: any) => r.displayLink),
        prompt: summaryPrompt // Include for AI processing
      }
    } catch (error) {
      console.error('Error searching and summarizing:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        summary: '',
        results: [],
        sources: []
      }
    }
  }

  // Clean up expired cache entries
  async cleanupExpiredCache() {
    try {
      const { count, error } = await this.supabase
        .from('internet_search_cache')
        .delete({ count: 'exact' })
        .lt('expires_at', new Date().toISOString())

      if (error) throw error

      return {
        success: true,
        deletedCount: count || 0
      }
    } catch (error) {
      console.error('Error cleaning up expired cache:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get search statistics
  async getSearchStatistics(teamId?: string) {
    try {
      let query = this.supabase
        .from('internet_search_cache')
        .select('provider, created_at')

      const { data, error } = await query

      if (error) throw error

      // Calculate statistics
      const stats = {
        totalSearches: data?.length || 0,
        searchesByProvider: {} as Record<string, number>,
        recentSearches: data?.slice(-10) || []
      }

      // Count searches by provider
      data?.forEach((search: any) => {
        const provider = search.provider
        stats.searchesByProvider[provider] = (stats.searchesByProvider[provider] || 0) + 1
      })

      return {
        success: true,
        statistics: stats
      }
    } catch (error) {
      console.error('Error getting search statistics:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        statistics: null
      }
    }
  }
}

export const internetSearchAPI = new InternetSearchAPI()