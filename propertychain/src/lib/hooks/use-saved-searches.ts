/**
 * useSavedSearches Hook - PropertyChain
 * 
 * Manages saved property searches
 */

import { useState, useEffect } from 'react'

interface SavedSearch {
  id: string
  name?: string
  query: string
  filters: any
  sortBy: string
  createdAt: Date
  notifications: boolean
}

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])

  // Load saved searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('propertychain-saved-searches')
    if (stored) {
      try {
        const searches = JSON.parse(stored)
        setSavedSearches(searches.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt)
        })))
      } catch (error) {
        console.error('Failed to load saved searches:', error)
      }
    }
  }, [])

  // Save search
  const saveSearch = (searchData: Omit<SavedSearch, 'id' | 'createdAt' | 'notifications'>) => {
    const newSearch: SavedSearch = {
      ...searchData,
      id: `search-${Date.now()}`,
      createdAt: new Date(),
      notifications: true,
    }

    const updated = [...savedSearches, newSearch]
    setSavedSearches(updated)
    
    localStorage.setItem('propertychain-saved-searches', JSON.stringify(updated))
    
    return newSearch.id
  }

  // Remove saved search
  const removeSavedSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id)
    setSavedSearches(updated)
    localStorage.setItem('propertychain-saved-searches', JSON.stringify(updated))
  }

  // Toggle notifications for a search
  const toggleNotifications = (id: string) => {
    const updated = savedSearches.map(s => 
      s.id === id ? { ...s, notifications: !s.notifications } : s
    )
    setSavedSearches(updated)
    localStorage.setItem('propertychain-saved-searches', JSON.stringify(updated))
  }

  // Check if current search is saved
  const isSearchSaved = (query: string, filters: any, sortBy: string) => {
    return savedSearches.some(s => 
      s.query === query && 
      JSON.stringify(s.filters) === JSON.stringify(filters) && 
      s.sortBy === sortBy
    )
  }

  return {
    savedSearches,
    saveSearch,
    removeSavedSearch,
    toggleNotifications,
    isSearchSaved,
  }
}