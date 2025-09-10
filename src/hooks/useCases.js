// hooks/useCases.js
import { useEffect, useState } from 'react'
import { getPostTeasers } from '../utils/getPostTeasers'

export function useCases() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    getPostTeasers()
      .then((data) => {
        if (!isMounted) return
        setCases(data)
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err)
        setLoading(false)
      })

    return () => { isMounted = false }
  }, [])

  return { cases, loading, error }
}
