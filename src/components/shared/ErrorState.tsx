import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  description = "잠시 후 다시 시도해주세요.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="max-w-lg mx-auto">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>문제가 발생했습니다</AlertTitle>
      <AlertDescription>
        {description}
        {onRetry && (
          <div className="mt-4">
            <Button variant="destructive" onClick={onRetry}>
              다시 시도
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
