import { useEffect, useState } from "react"

const useDebounce = (inputText, delay = 300) => {

  const [debouncedSearch, setDebounceSearch] = useState(inputText)

  useEffect(() => {

    let timer = setTimeout(() => {

      setDebounceSearch(inputText)
    }, delay)

    return () => clearTimeout(timer)
  }, [inputText])

  return debouncedSearch
}

export default useDebounce
