"use client"

import { useEffect, useState } from 'react'

export default function useGetCategory() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await fetch('/api/category/getCategory', {
                    method: "GET",
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                
                if (!response.ok) {
                    throw new Error('Failed to fetch categories')
                }
                
                const result = await response.json()
                setData(result.data || [])
            } catch (error) {
                console.error('Error fetching categories:', error)
                setError(error.message)
                setData([])
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return { data, loading, error }
}