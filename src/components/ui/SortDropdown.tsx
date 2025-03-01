'use client';

import { useRef, useState } from 'react';
import { OrderOption, OrderSequence, SortOption } from '@/core/@types';
import { useClickOutside } from '@/core/hooks';
import {
  Button,
  ButtonProps,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

export type SortOptionProps = {
  options: SortOption[];
  orders: OrderOption[];
  sortBy: string;
  order: OrderSequence;
  onChange: (sortBy: string, order: OrderSequence) => void;
  buttonProps?: ButtonProps;
};

export function SortDropdown({
  options,
  orders,
  sortBy,
  order,
  onChange,
  buttonProps,
}: SortOptionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useClickOutside(ref, buttonRef, () => setIsOpen(false), [ref, isOpen]);
  return (
    <div className="relative">
      <Button
        variant="outlined"
        color="primary"
        size="large"
        onClick={() => setIsOpen(true)}
        {...buttonProps}
        ref={buttonRef}
      >
        <p className="whitespace-nowrap w-24 normal-case overflow-hidden text-ellipsis">
          การเรียงลำดับ
        </p>
      </Button>
      <div
        className={
          isOpen
            ? 'absolute z-20 left-0 top-12 bg-white text-black shadow-[2px_5px_15px_0px_rgba(204,204,204,1)] rounded-lg py-2 border'
            : 'hidden'
        }
        ref={ref}
      >
        <div className="flex flex-col text-black px-4 py-2 gap-4">
          <FormControl>
            <FormLabel id="sort">Sort</FormLabel>
            <RadioGroup
              aria-labelledby="sort"
              defaultValue={sortBy}
              value={sortBy}
              onChange={(e) => onChange(e.target.value, order)}
              name="sort-buttons-group"
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Divider />
          <FormControl>
            <FormLabel id="order">Order</FormLabel>
            <RadioGroup
              aria-labelledby="order"
              defaultValue={order}
              value={order}
              onChange={(e) =>
                onChange(sortBy, e.target.value as OrderSequence)
              }
              name="order-buttons-group"
            >
              {orders.map((order) => (
                <FormControlLabel
                  key={order.value}
                  value={order.value}
                  control={<Radio />}
                  label={order.label(sortBy)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </div>
  );
}
