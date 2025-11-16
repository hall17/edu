import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ContentSectionProps {
  title: string;
  desc: string;
  children: React.JSX.Element;
  className?: string;
  action?: React.ReactNode;
}

export function ContentSection({
  title,
  desc,
  children,
  className,
  action,
}: ContentSectionProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-none">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-muted-foreground text-sm">{desc}</p>
          </div>
          {action && <div className="ml-4">{action}</div>}
        </div>
      </div>
      <Separator className="my-4 flex-none" />
      <div className="faded-bottom h-full w-full overflow-y-auto scroll-smooth pr-4 pb-12">
        <div className={cn('px-1.5 lg:max-w-3xl', className)}>{children}</div>
      </div>
    </div>
  );
}
