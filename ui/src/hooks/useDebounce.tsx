import { useCallback, useEffect } from 'react'

export function useDebounce() {
  let timeout: NodeJS.Timeout

  const cancel = useCallback(() => {
    clearTimeout(timeout)
  }, [])

  const debounce = useCallback(
    (cb: () => void, time = 500) => {
      cancel()
      timeout = setTimeout(cb, time)
    },
    [cancel]
  )

  useEffect(() => {
    return cancel
  }, [])

  return [debounce, cancel]
}
