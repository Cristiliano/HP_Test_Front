import { useState, useCallback, useEffect, useRef } from 'react';
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
  WeatherSection,
  HistoryList,
} from '@/components';
import { useDarkMode, useCepQuery, useDebounce, useCepHistory } from '@/hooks';

export function Home() {
  const { isDark, toggle } = useDarkMode();
  const [cep, setCep] = useState('');
  const [searchCep, setSearchCep] = useState('');
  const lastAddedCepRef = useRef<string | null>(null);
  
  const debouncedCep = useDebounce(searchCep, 300);
  const { data, isLoading, isError, errorMessage, refetch } = useCepQuery(debouncedCep, {
    enabled: debouncedCep.length === 8,
  });

  const { history, addToHistory, clearHistory, removeFromHistory } = useCepHistory();

  useEffect(() => {
    if (data && data.cep !== lastAddedCepRef.current) {
      addToHistory(data);
      lastAddedCepRef.current = data.cep;
    }
  }, [data, addToHistory]);

  const handleSearch = useCallback((value: string) => {
    const cleanCep = value.replace(/\D/g, '');
    setCep(value);
    setSearchCep(cleanCep);
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleSelectFromHistory = useCallback((selectedCep: string) => {
    const formatted = selectedCep.replace(/(\d{5})(\d{3})/, '$1-$2');
    setCep(formatted);
    setSearchCep(selectedCep.replace(/\D/g, ''));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-4 px-4">
        <div className="max-w-4xl mx-auto flex justify-end">
          <DarkModeToggle isDark={isDark} onToggle={toggle} />
        </div>
      </header>

      <main className="flex-1 px-4 py-4">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 dark:bg-indigo-500">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Consulta de CEP e Clima
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Digite o CEP para buscar o endereço e a previsão do tempo
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

          <HistoryList
            history={history}
            onSelect={handleSelectFromHistory}
            onClear={clearHistory}
            onRemove={removeFromHistory}
          />

          {isLoading && (
            <div className="py-8">
              <Spinner size="lg" />
              <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
                Buscando endereço...
              </p>
            </div>
          )}

          {isError && errorMessage && !isLoading && (
            <ErrorDisplay message={errorMessage} onRetry={handleRetry} />
          )}

          {data && !isLoading && !isError && (
            <>
              <AddressCard address={data} />
              <WeatherSection address={data} />
            </>
          )}
        </div>
      </main>

      <Footer provider={data?.provider} />
    </div>
  );
}
