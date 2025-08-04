import { useNavigate } from '@tanstack/react-router';

import edusama from '@/assets/edusama.png';
import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-primary-foreground container grid h-svh max-w-none items-center justify-center">
      <div
        className={cn(
          'mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8',
          className
        )}
      >
        <div
          className="mb-8 flex cursor-pointer items-center justify-center"
          onClick={() => navigate({ to: '/' })}
        >
          <img src={edusama} className="w-[250px]" alt="Edusama" />
        </div>
        {children}
      </div>
    </div>
  );
}
