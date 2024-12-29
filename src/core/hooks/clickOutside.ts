import { DependencyList, RefObject, useEffect } from 'react';

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  ref2: RefObject<HTMLElement | null>,
  onClickOutside: () => void,
  deps?: DependencyList,
) {
  useEffect(() => {
    const handleOutSideClick = (event: MouseEvent) => {
      if (
        !ref.current?.contains(event.target as HTMLElement) &&
        !ref2.current?.contains(event.target as HTMLElement)
      ) {
        onClickOutside();
      }
    };
    window.addEventListener('mousedown', handleOutSideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutSideClick);
    };
  }, [deps]);
}
