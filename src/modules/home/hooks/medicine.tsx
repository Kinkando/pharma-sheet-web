import { useContext, useEffect, useState } from 'react';
import { getMedicines, getWarehouses } from '@/core/repository';
import { GlobalContext } from '@/core/context';
import { FilterMedicine, Medicine, Warehouse } from '@/core/@types';

export function useMedicine() {
  const { alert } = useContext(GlobalContext);

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const data = await getWarehouses();
      setWarehouses(data ?? []);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    }
  };

  const fetchMedicine = async (filter: FilterMedicine) => {
    try {
      const { data } = await getMedicines(filter);
      setMedicines(data ?? []);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    }
  };

  return {
    warehouses,
    medicines,
    fetchMedicine,
  };
}
