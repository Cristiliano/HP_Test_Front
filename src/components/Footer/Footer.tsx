import type { Provider } from '@/types';

interface FooterProps {
  provider?: Provider;
}

export function Footer({ provider }: FooterProps) {
  return (
    <footer className="py-6 text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {provider ? (
          <>
            Dados fornecidos pela{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              API {provider}
            </span>
          </>
        ) : (
          <>
            Consulta de CEP utilizando{' '}
            <a
              href="https://brasilapi.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              BrasilAPI
            </a>
            {' '}|{' '}
            <a
              href="https://viacep.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              ViaCEP
            </a>
          </>
        )}
      </p>
    </footer>
  );
}
