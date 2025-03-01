'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Close, Search } from '@mui/icons-material';
import { CircularProgress, TextField, TextFieldProps } from '@mui/material';
import { useDebounceSearchTerm } from '@/core/hooks';

export type DelaySearchBoxProps = {
  onSearch: (search: string) => void;
  props?: TextFieldProps;
};

export function DelaySearchBox({ onSearch, ...props }: DelaySearchBoxProps) {
  const searchParam = useSearchParams();
  const [search, setSearch] = useState(searchParam.get('search') || '');
  const { debouncedSearchTerm, setDebouncedSearchTerm } = useDebounceSearchTerm(
    search,
    searchParam.get('search') ?? '',
  );
  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [onSearch, debouncedSearchTerm]);

  return (
    <TextField
      placeholder="ค้นหา"
      className="w-full"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setDebouncedSearchTerm(search);
        }
      }}
      slotProps={{
        input: {
          startAdornment: (
            <div
              className="mr-2 cursor-pointer"
              onClick={() => setDebouncedSearchTerm(search)}
            >
              <Search />
            </div>
          ),
          endAdornment:
            search !== debouncedSearchTerm ? (
              <div className="ml-2 mt-2 cursor-pointer">
                <CircularProgress color="primary" size={24} />
              </div>
            ) : search ? (
              <div className="ml-2 cursor-pointer">
                <Close
                  onClick={() => {
                    setSearch('');
                    setDebouncedSearchTerm('');
                  }}
                />
              </div>
            ) : undefined,
        },
      }}
      {...props}
    />
  );
}
