import { useQuery } from '@tanstack/react-query';
import { fetchCep, CepNotFoundError, CepServiceError } from '@/api';
import type { Address } from '@/types';
import { CACHE_TIMES } from '@/config';

interface UseCepQueryOptions {
  enabled?: boolean;
}

export function useCepQuery(cep: string, options: UseCepQueryOptions = {}) {
  const cleanCep = cep.replace(/\D/g, '');
  const isValidCep = cleanCep.length === 8;

  const query = useQuery<Address, Error>({
    queryKey: ['cep', cleanCep],
    queryFn: () => fetchCep(cleanCep),
    enabled: isValidCep && (options.enabled ?? true),
    retry: false,
    staleTime: CACHE_TIMES.FIVE_MINUTES,
    gcTime: CACHE_TIMES.THIRTY_MINUTES,
  });

  const getErrorMessage = (): string | null => {
    if (!query.error) return null;

    if (query.error instanceof CepNotFoundError) {
      return 'CEP não encontrado. Verifique o número digitado.';
    }

    if (query.error instanceof CepServiceError) {
      return 'Erro ao consultar CEP. Tente novamente mais tarde.';
    }

    return 'Ocorreu um erro inesperado. Tente novamente.';
  };

  return {
    data: query.data ?? null,
    isLoading: query.isLoading || query.isFetching,
    isError: query.isError,
    error: query.error,
    errorMessage: getErrorMessage(),
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
}
