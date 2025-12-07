import { RefreshCw } from 'lucide-react';
import { Alert, Button } from '@/components/ui';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="w-full space-y-4">
      <Alert variant="error" title="Erro na consulta">
        {message}
      </Alert>
      {onRetry && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Tentar novamente
          </Button>
        </div>
      )}
    </div>
  );
}
