import { useQuery } from '@tanstack/react-query';

import { RouterInput, trpc } from '@/lib/trpc';

export function useRolesQuery(filters: RouterInput['role']['findAll'] = {}) {
  const query = useQuery(trpc.role.findAll.queryOptions(filters));
  const rolesQueryKey = trpc.role.findAll.queryKey(filters);

  return { rolesQuery: query, rolesQueryKey };
}
