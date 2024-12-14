import { useEffect, useState } from 'react';

export function useDebounceSearchTerm(searchTerm: string, init?: string) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(init ?? ''); // Store the debounced value
  // Debounce effect
  useEffect(() => {
    // Set a timeout to update the debouncedSearchTerm after 3 seconds of inactivity
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1500);

    // Cleanup function to clear the timeout if the input changes
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]); // Runs when searchTerm changes
  return {
    debouncedSearchTerm,
    setDebouncedSearchTerm,
  };
}
