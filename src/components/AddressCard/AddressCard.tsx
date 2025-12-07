import {
  MapPin,
  Navigation,
  Building2,
  Map,
  Hash,
  Phone,
  Globe,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import type { Address } from '@/types';

interface AddressCardProps {
  address: Address;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
  className?: string;
}

function InfoItem({ icon, label, value, className = '' }: InfoItemProps) {
  if (!value) return null;

  return (
    <div
      className={`
        p-4 rounded-xl
        bg-gray-50 dark:bg-slate-700/50
        border border-gray-100 dark:border-slate-600
        ${className}
      `}
    >
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-gray-900 dark:text-gray-100 font-medium">{value}</p>
    </div>
  );
}

export function AddressCard({ address }: AddressCardProps) {
  const hasCoordinates = address.latitude !== undefined && address.longitude !== undefined;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
            <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Endereço Encontrado
          </h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* CEP */}
          <InfoItem
            icon={<Navigation className="w-4 h-4" />}
            label="CEP"
            value={address.cep}
          />

          {/* Logradouro */}
          <InfoItem
            icon={<Building2 className="w-4 h-4" />}
            label="Logradouro"
            value={address.logradouro}
          />

          {/* Bairro */}
          <InfoItem
            icon={<Map className="w-4 h-4" />}
            label="Bairro"
            value={address.bairro}
            className="sm:col-span-2"
          />

          {/* Cidade */}
          <InfoItem
            icon={<MapPin className="w-4 h-4" />}
            label="Cidade"
            value={address.cidade}
          />

          {/* Estado */}
          <InfoItem
            icon={<Building2 className="w-4 h-4" />}
            label="Estado"
            value={address.uf}
          />

          {/* DDD */}
          {address.ddd && (
            <InfoItem
              icon={<Phone className="w-4 h-4" />}
              label="DDD"
              value={address.ddd}
            />
          )}

          {/* Código IBGE */}
          <InfoItem
            icon={<Hash className="w-4 h-4" />}
            label="Código IBGE"
            value={address.ibge}
          />

          {/* Código SIAFI */}
          {address.siafi && (
            <InfoItem
              icon={<Hash className="w-4 h-4" />}
              label="Código SIAFI"
              value={address.siafi}
            />
          )}

          {/* Coordinates - only show when available (BrasilAPI) */}
          {hasCoordinates && (
            <InfoItem
              icon={<Globe className="w-4 h-4" />}
              label="Coordenadas"
              value={`${address.latitude?.toFixed(6)}, ${address.longitude?.toFixed(6)}`}
              className="sm:col-span-2"
            />
          )}
        </div>

        {/* Provider Badge */}
        <div className="mt-4 flex justify-end">
          <span
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              ${
                address.provider === 'BrasilAPI'
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                  : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
              }
            `}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                address.provider === 'BrasilAPI'
                  ? 'bg-emerald-500'
                  : 'bg-blue-500'
              }`}
            />
            {address.provider}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
