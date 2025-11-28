import { GraphQLClient } from 'graphql-request'

// Use production URL if available, fallback to dev
const SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
  process.env.NEXT_PUBLIC_SUBGRAPH_URL_DEV ||
  'https://api.studio.thegraph.com/query/1716126/omega-tools/version/latest'

const API_KEY = process.env.NEXT_PUBLIC_GRAPH_API_KEY

// Create headers with API key if available (only add auth if we have a real key)
const headers: Record<string, string> = {}

if (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') {
  headers.Authorization = `Bearer ${API_KEY}`
}

export const graphQLClient = new GraphQLClient(SUBGRAPH_URL, { headers })

export async function querySubgraph<T = any>(query: string, variables?: any): Promise<T> {
  try {
    const data = await graphQLClient.request<T>(query, variables)
    return data
  } catch (error) {
    console.error('GraphQL query error:', error)
    throw error
  }
}

// Export URL and headers for direct use with other clients
export const subgraphUrl = SUBGRAPH_URL
export const subgraphHeaders = headers
