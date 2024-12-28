import { useState } from 'react';

export function useValidState<T>(
  initialValue: T | null,
  defaultValue: T,
  ...possibleValues: T[]
) {
  const [value, setValue] = useState<T>(
    initialValue && possibleValues.includes(initialValue)
      ? initialValue
      : defaultValue,
  );
  return [value, setValue] as const;
}
