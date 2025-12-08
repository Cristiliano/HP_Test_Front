# 🗺️ Consulta de CEP e Clima - Projeto Front-end

Aplicação React para consulta de CEP brasileiro com previsão do tempo, interface responsiva e dark mode.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss)
![Tests](https://img.shields.io/badge/Tests-129%20passing-brightgreen)

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Docker](#-docker)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura e Decisões Técnicas](#-arquitetura-e-decisões-técnicas)
- [APIs Utilizadas](#-apis-utilizadas)
- [Testes](#-testes)
- [Configurações](#-configurações)

---

## ✨ Funcionalidades

### Consulta de CEP
- ✅ Formulário com validação em tempo real (8 dígitos)
- ✅ Máscara automática de CEP (XXXXX-XXX)
- ✅ Debounce na digitação (300ms)
- ✅ Consulta BrasilAPI como primária com fallback para ViaCEP
- ✅ Exibição completa do endereço (logradouro, bairro, cidade, UF, DDD, IBGE, SIAFI)
- ✅ Coordenadas geográficas (quando disponível)
- ✅ Indicador do provedor utilizado

### Previsão do Tempo
- ✅ Clima atual (temperatura, sensação térmica, umidade, vento, nuvens)
- ✅ Previsão para 3, 5 ou 7 dias
- ✅ Geocodificação automática para CEPs sem coordenadas
- ✅ Ícones de condição climática
- ✅ Probabilidade de precipitação

### Histórico
- ✅ Últimas 6 consultas salvas em localStorage
- ✅ Tempo relativo (agora, há 5 minutos, ontem...)
- ✅ Clique para reconsultar
- ✅ Opção de limpar histórico

### Interface
- ✅ Dark mode com persistência
- ✅ Layout totalmente responsivo
- ✅ Feedback visual durante carregamento
- ✅ Tratamento de erros com mensagens amigáveis
- ✅ Botão "Tentar novamente" em caso de erro

---

## 🚀 Tecnologias

### Core
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | 19.2 | Biblioteca UI com hooks |
| TypeScript | 5.9 | Tipagem estática |
| Vite | 7.2 | Build tool e dev server |

### Estado e Dados
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| TanStack Query | 5.90 | Cache e estado do servidor |
| React Hook Form | 7.68 | Gerenciamento de formulários |
| Zod | 4.1 | Validação de schemas |
| Axios | 1.13 | Cliente HTTP |

### UI
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Tailwind CSS | 4.1 | Estilização utility-first |
| Lucide React | 0.556 | Biblioteca de ícones |
| React Router | 7.10 | Roteamento SPA |

### Testes
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Vitest | 4.0 | Framework de testes |
| Testing Library | 16.3 | Testes de componentes |
| MSW | 2.12 | Mock de APIs |

### Qualidade de Código
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| ESLint | 9.39 | Linting |
| Prettier | 3.5 | Formatação |
| TypeScript ESLint | 8.46 | Regras TS |

---

## 📋 Requisitos

- **Node.js** 20.x ou superior
- **npm** 10.x ou superior
- **Docker** (opcional, para containerização)

---

## 📦 Instalação

```bash
# Clonar o repositório
git clone https://github.com/Cristiliano/HP_Test_Front.git
cd HP_Test_Front

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev

# Acessar em http://localhost:5173
```

---

## 📜 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **dev** | `npm run dev` | Inicia servidor de desenvolvimento |
| **build** | `npm run build` | Compila para produção |
| **preview** | `npm run preview` | Preview do build de produção |
| **test** | `npm run test` | Executa testes em modo watch |
| **test:run** | `npm run test:run` | Executa testes uma vez |
| **test:coverage** | `npm run test:coverage` | Executa testes com cobertura |
| **lint** | `npm run lint` | Verifica erros de linting |
| **lint:fix** | `npm run lint:fix` | Corrige erros de linting |
| **format** | `npm run format` | Formata código com Prettier |
| **format:check** | `npm run format:check` | Verifica formatação |

---

## 🐳 Docker

A aplicação usa um Dockerfile multi-stage otimizado com Nginx para produção.

### Build e Execução

```bash
# Build da imagem
docker build -t hp-test-front .

# Executar o container
docker run -d -p 8081:80 --name hp-test-front hp-test-front

# Acessar em http://localhost:8081
```

### Comandos Úteis

```bash
# Ver logs
docker logs hp-test-front

# Parar container
docker stop hp-test-front

# Remover container
docker rm hp-test-front

# Rebuild completo
docker rm -f hp-test-front && docker build -t hp-test-front . && docker run -d -p 8081:80 --name hp-test-front hp-test-front
```

### Docker Compose

O projeto inclui um arquivo `docker-compose.yml` pronto para uso:

```bash
# Iniciar a aplicação
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Parar a aplicação
docker-compose down

# Rebuild após mudanças no código
docker-compose up -d --build

# Rebuild completo (remove imagens antigas)
docker-compose down --rmi all && docker-compose up -d --build
```

**Resolver conflito de container:**

Se aparecer erro de conflito de nome, remova o container existente:

```bash
docker rm -f hp-test-front && docker-compose up -d
```

### Características do Container

- **Multi-stage build**: Node 20 Alpine (build) + Nginx Alpine (produção)
- **Imagem final**: ~25MB
- **Gzip**: Habilitado para assets
- **Cache**: 1 ano para arquivos estáticos
- **Security headers**: X-Frame-Options, X-Content-Type-Options, XSS Protection
- **Health check**: Verificação automática de saúde

---

## 🏗️ Estrutura do Projeto

```
src/
├── api/                      # Serviços de API
│   ├── brasilApi.ts          # Cliente BrasilAPI CEP
│   ├── viaCepApi.ts          # Cliente ViaCEP (fallback)
│   ├── cepService.ts         # Orquestrador com fallback
│   ├── geocodingApi.ts       # Geocodificação Open-Meteo
│   └── weatherApi.ts         # Previsão do tempo Open-Meteo
│
├── components/               # Componentes React
│   ├── ui/                   # Componentes base reutilizáveis
│   │   ├── Alert.tsx         # Alertas de erro/sucesso
│   │   ├── Button.tsx        # Botão estilizado
│   │   ├── Card.tsx          # Container card
│   │   ├── DarkModeToggle.tsx# Toggle de tema
│   │   ├── Input.tsx         # Input com máscara
│   │   └── Spinner.tsx       # Indicador de loading
│   ├── AddressCard/          # Exibição do endereço
│   ├── CepForm/              # Formulário de busca
│   ├── CurrentWeatherCard/   # Clima atual
│   ├── DaysSelector/         # Seletor de dias de previsão
│   ├── ErrorDisplay/         # Exibição de erros
│   ├── Footer/               # Rodapé com créditos
│   ├── ForecastList/         # Lista de previsão
│   ├── HistoryList/          # Histórico de consultas
│   └── WeatherSection/       # Seção completa de clima
│
├── config/                   # Configurações centralizadas
│   └── constants.ts          # URLs de API, tempos de cache
│
├── hooks/                    # Hooks customizados
│   ├── useCepQuery.ts        # Query de CEP com TanStack Query
│   ├── useCepHistory.ts      # Gerenciamento do histórico
│   ├── useWeatherQuery.ts    # Query de clima
│   ├── useDarkMode.ts        # Controle de tema
│   └── useDebounce.ts        # Debounce de valores
│
├── lib/                      # Bibliotecas e configurações
│   └── queryClient.ts        # Configuração TanStack Query
│
├── pages/                    # Páginas da aplicação
│   └── Home/                 # Página principal
│
├── schemas/                  # Schemas de validação Zod
│   └── cepSchema.ts          # Validação de CEP
│
├── types/                    # Tipos TypeScript
│   ├── address.ts            # Tipo unificado de endereço
│   ├── brasilApi.ts          # Tipos da BrasilAPI
│   ├── viaCep.ts             # Tipos da ViaCEP
│   └── weather.ts            # Tipos de clima/geocoding
│
└── utils/                    # Utilitários
    └── formatters.ts         # Formatação de CEP, datas relativas

tests/
├── setup.ts                  # Configuração MSW + jest-dom
├── mocks/                    # Mocks de API
│   ├── handlers.ts           # Handlers HTTP
│   └── server.ts             # Servidor MSW
├── api/                      # Testes de serviços
├── components/               # Testes de componentes
├── hooks/                    # Testes de hooks
├── integration/              # Testes de integração
├── schemas/                  # Testes de validação
└── utils/                    # Testes de utilitários
```

---

## 🏛️ Arquitetura e Decisões Técnicas

### Padrão de Fallback para CEP

```
Usuário digita CEP
       ↓
   BrasilAPI ──────→ Sucesso → Exibe dados (com coordenadas)
       ↓ Falha
     ViaCEP ───────→ Sucesso → Exibe dados (sem coordenadas)
       ↓ Falha
  Erro exibido ←────────────────┘
```

**Por quê?**
- BrasilAPI fornece coordenadas geográficas
- ViaCEP é mais estável como fallback
- Timeout de 5 segundos para evitar lentidão

### Geocodificação para Clima

Quando o CEP vem do ViaCEP (sem coordenadas), a aplicação:
1. Busca coordenadas via Open-Meteo Geocoding usando cidade + estado
2. Filtra resultados pelo país (Brasil)
3. Usa as coordenadas para buscar previsão do tempo

### Gerenciamento de Estado

| Tipo de Estado | Solução | Justificativa |
|----------------|---------|---------------|
| Dados do servidor | TanStack Query | Cache automático, refetch, loading states |
| Formulário | React Hook Form | Performance, validação integrada |
| Tema | useState + localStorage | Simples, persiste preferência |
| Histórico | useState + localStorage | Persiste entre sessões |

### Configuração de Cache (TanStack Query)

| Parâmetro | CEP | Clima |
|-----------|-----|-------|
| Stale Time | 5 min | 10 min |
| GC Time | 30 min | 30 min |

### Path Aliases

```typescript
// Ao invés de:
import { Button } from '../../../components/ui/Button';

// Usar:
import { Button } from '@/components';
```

---

## 🌐 APIs Utilizadas

### BrasilAPI - CEP v2
- **URL**: `https://brasilapi.com.br/api/cep/v2/{cep}`
- **Retorna**: Endereço completo + coordenadas geográficas
- **Documentação**: [brasilapi.com.br](https://brasilapi.com.br)

### ViaCEP
- **URL**: `https://viacep.com.br/ws/{cep}/json/`
- **Retorna**: Endereço completo (sem coordenadas)
- **Documentação**: [viacep.com.br](https://viacep.com.br)

### Open-Meteo Geocoding
- **URL**: `https://geocoding-api.open-meteo.com/v1/search`
- **Retorna**: Coordenadas por nome de cidade
- **Documentação**: [open-meteo.com](https://open-meteo.com/en/docs/geocoding-api)

### Open-Meteo Weather Forecast
- **URL**: `https://api.open-meteo.com/v1/forecast`
- **Retorna**: Clima atual + previsão diária
- **Documentação**: [open-meteo.com](https://open-meteo.com/en/docs)

---

## 🧪 Testes

### Executar Testes

```bash
# Modo watch (desenvolvimento)
npm run test

# Execução única
npm run test:run

# Com cobertura
npm run test:coverage
```

### Cobertura

| Métrica | Threshold | Atual |
|---------|-----------|-------|
| Statements | 80% | ~89% |
| Branches | 75% | ~76% |
| Functions | 80% | ~97% |
| Lines | 80% | ~88% |

### Estrutura de Testes

```
tests/
├── api/           # Testes dos serviços de API
├── components/    # Testes de componentes isolados
├── hooks/         # Testes de hooks customizados
├── integration/   # Testes de fluxo completo
├── schemas/       # Testes de validação Zod
└── utils/         # Testes de utilitários
```

### Total: 129 testes em 18 arquivos

---

## ⚙️ Configurações

### TypeScript

```json
{
  "target": "ES2022",
  "module": "ESNext",
  "strict": true,
  "jsx": "react-jsx",
  "paths": { "@/*": ["./src/*"] }
}
```

### ESLint

- TypeScript ESLint (recomendado)
- React Hooks rules
- Prettier integrado
- Console.log como warning

### Prettier

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### Vite

- Plugin React com SWC
- Plugin Tailwind CSS 4
- Path alias `@/` → `./src/`
- Vitest integrado

---

## 🎨 Design

- Gradiente de fundo suave (indigo/purple)
- Cards com sombras e bordas arredondadas
- Ícones consistentes (Lucide React)
- Dark mode completo
- Transições suaves
- Totalmente responsivo (mobile-first)

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT** - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

**Cristiliano Cardoso**

- GitHub: [@Cristiliano](https://github.com/Cristiliano)
- Projeto: [HP_Test_Front](https://github.com/Cristiliano/HP_Test_Front)


