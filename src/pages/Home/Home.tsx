import { useState, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  DarkModeToggle,
  Spinner,
  CepForm,
  AddressCard,
  ErrorDisplay,
  Footer,
} from '@/components';
import { useDarkMode, useCepQuery, useDebounce } from '@/hooks';

export function Home() {
  const { isDark, toggle } = useDarkMode();
  const [cep, setCep] = useState('');
  const [searchCep, setSearchCep] = useState('');
  
  const debouncedCep = useDebounce(searchCep, 300);
  const { data, isLoading, isError, errorMessage, refetch } = useCepQuery(debouncedCep, {
    enabled: debouncedCep.length === 8,
  });

  const handleSearch = useCallback((value: string) => {
    const cleanCep = value.replace(/\D/g, '');
    setCep(value);
    setSearchCep(cleanCep);
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-4">
        <div className="max-w-2xl mx-auto flex justify-end">
          <DarkModeToggle isDark={isDark} onToggle={toggle} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-2xl space-y-6">
          {/* Search Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 dark:bg-indigo-500">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Consulta de CEP
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Digite o CEP para buscar o endereço completo
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CepForm
                onSubmit={handleSearch}
                isLoading={isLoading}
                defaultValue={cep}
              />
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="py-8">
              <Spinner size="lg" />
              <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
                Buscando endereço...
              </p>
            </div>
          )}

          {/* Error State */}
          {isError && errorMessage && !isLoading && (
            <ErrorDisplay message={errorMessage} onRetry={handleRetry} />
          )}

          {/* Success State - Address Card */}
          {data && !isLoading && !isError && <AddressCard address={data} />}
        </div>
      </main>

      {/* Footer */}
      <Footer provider={data?.provider} />
    </div>
  );
}
