import { Clock, Trash2, MapPin, X } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import type { CepHistoryItem } from '@/types';
import { formatRelativeTime } from '@/lib/dateUtils';

interface HistoryListProps {
  history: CepHistoryItem[];
  onSelect: (cep: string) => void;
  onClear: () => void;
  onRemove: (cep: string) => void;
}

function formatCep(cep: string): string {
  const clean = cep.replace(/\D/g, '');
  if (clean.length === 8) {
    return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  }
  return cep;
}

export function HistoryList({ history, onSelect, onClear, onRemove }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-slate-700 mb-3">
              <Clock className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Nenhuma consulta recente
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Suas últimas buscas aparecerão aqui
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Consultas Recentes
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-xs text-gray-500 dark:text-gray-400">
              {history.length}
            </span>
          </div>
          <button
            onClick={onClear}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              text-red-600 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-900/20
              transition-colors duration-200
            "
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {history.map((item, index) => (
            <div
              key={item.cep}
              className="
                group flex items-center gap-3 p-3 rounded-xl
                bg-gray-50 dark:bg-slate-700/50
                hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800
                cursor-pointer
                transition-all duration-200 ease-out
                animate-in fade-in slide-in-from-top-2
              "
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'backwards',
              }}
              onClick={() => onSelect(item.cep)}
            >
              <div className="p-2 rounded-lg bg-white dark:bg-slate-600 shadow-sm group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800 transition-colors duration-200">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatCep(item.cep)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {item.cidade}, {item.uf}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  {formatRelativeTime(item.timestamp)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.cep);
                  }}
                  className="
                    p-1.5 rounded-lg opacity-0 group-hover:opacity-100
                    text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30
                    transition-all duration-200
                  "
                  title="Remover do histórico"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
