import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { cepSchema, type CepFormData } from '@/schemas';

interface CepFormProps {
  onSubmit: (cep: string) => void;
  isLoading?: boolean;
  defaultValue?: string;
}

export function CepForm({ onSubmit, isLoading = false, defaultValue = '' }: CepFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CepFormData>({
    resolver: zodResolver(cepSchema),
    defaultValues: {
      cep: defaultValue,
    },
  });

  const handleFormSubmit = (data: CepFormData) => {
    onSubmit(data.cep);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            {...register('cep')}
            mask="_____-___"
            placeholder="00000-000"
            error={errors.cep?.message}
            aria-label="CEP"
            aria-describedby={errors.cep ? 'cep-error' : undefined}
          />
        </div>
        <Button
          type="submit"
          isLoading={isLoading}
          leftIcon={<Search className="w-5 h-5" />}
          className="sm:w-auto w-full"
        >
          Buscar
        </Button>
      </div>
    </form>
  );
}
