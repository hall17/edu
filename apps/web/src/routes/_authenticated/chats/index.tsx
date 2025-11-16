import { createFileRoute } from '@tanstack/react-router';

import { Chats } from '@/features/admin/chats';

export const Route = createFileRoute('/_authenticated/chats/')({
  component: Chats,
});
