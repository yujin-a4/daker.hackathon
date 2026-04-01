import { LucideProps } from 'lucide-react';

interface EmptyStateProps {
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-[60px] px-6 bg-card rounded-[10px] border border-border">
      <Icon className="h-[48px] w-[48px] text-primary mb-[24px]" />
      <h3 className="text-[20px] font-bold text-foreground">{title}</h3>
      <p className="mt-[8px] text-[14px] text-muted-foreground max-w-[400px]">{description}</p>
      {children && (
        <div className="mt-[32px] w-full max-w-[400px]">
          {children}
        </div>
      )}
    </div>
  );
}
