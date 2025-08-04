import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { useSearchFilters } from '@/hooks';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/stores/authStore';

function useProviderValue() {
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/settings/inventory'
  );

  const { user } = useAuth();
  const findMyDevicesQuery = useQuery(
    trpc.device.findMyDevices.queryOptions(filters, {
      initialData: {
        devices: user?.devices || [],
        count: user?.devices?.length || 0,
      },
    })
  );

  return {
    findMyDevicesQuery,
    filters,
    setFilters,
    resetFilters,
  };
}

const InventoryContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function InventoryProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <InventoryContext.Provider value={value}>
      {props.children}
    </InventoryContext.Provider>
  );
}

export function useInventoryContext() {
  const inventoryContext = React.useContext(InventoryContext);

  if (!inventoryContext) {
    throw new Error(
      'useInventoryContext has to be used within <InventoryProvider>'
    );
  }

  return inventoryContext;
}
