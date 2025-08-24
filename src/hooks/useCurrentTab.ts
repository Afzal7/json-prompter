import { useState, useEffect } from 'react'

// Hook to get current tab URL
export function useCurrentTab() {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getCurrentTab = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        setUrl(tab?.url || null)
      } catch (error) {
        console.error('Error getting current tab:', error)
      } finally {
        setLoading(false)
      }
    }

    getCurrentTab()
  }, [])

  return { url, loading }
}