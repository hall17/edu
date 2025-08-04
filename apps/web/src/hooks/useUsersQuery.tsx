import { useQuery } from '@tanstack/react-query';

import { RouterInput, trpc } from '@/lib/trpc';

export function useUsersQuery(filters: RouterInput['user']['findAll']) {
  const usersQuery = useQuery(trpc.user.findAll.queryOptions(filters));
  const usersQueryKey = trpc.user.findAll.queryKey(filters);

  return { usersQuery, usersQueryKey };
}
