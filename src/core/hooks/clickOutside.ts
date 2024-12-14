import { DependencyList, RefObject, useEffect } from 'react';

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  skip: boolean,
  onClickOutside: () => void,
  deps?: DependencyList,
) {
  useEffect(() => {
    if (skip) {
      return;
    }
    const handleOutSideClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as HTMLElement)) {
        onClickOutside();
      }
    };
    window.addEventListener('mousedown', handleOutSideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutSideClick);
    };
  }, [deps]);
}
