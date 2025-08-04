import { Loader2Icon } from 'lucide-react';

import { Button } from './ui/button';

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
}

export function LoadingButton(props: LoadingButtonProps) {
  return (
    <Button disabled={props.isLoading} {...props}>
      {props.isLoading && <Loader2Icon className="animate-spin" />}
      {props.children}
    </Button>
  );
}
