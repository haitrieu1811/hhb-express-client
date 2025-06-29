import React from 'react'
import { useSearchParams } from 'react-router'

export default function useQueryParams() {
  const [searchParams] = useSearchParams()
  const queryParams = React.useMemo(() => Object.fromEntries([...searchParams]), [searchParams])
  return queryParams
}
