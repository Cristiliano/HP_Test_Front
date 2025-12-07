export type Provider = 'BrasilAPI' | 'ViaCEP';

export interface Address {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  ddd?: string;
  ibge?: string;
  siafi?: string;
  latitude?: number;
  longitude?: number;
  provider: Provider;
}

export interface CepQueryResult {
  data: Address | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
