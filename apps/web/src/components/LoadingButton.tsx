import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
}

export function LoadingButton(props: LoadingButtonProps) {
  return (
    <Button disabled={props.isLoading} {...props}>
      {props.isLoading && <Spinner />}
      {props.children}
    </Button>
  );
}
