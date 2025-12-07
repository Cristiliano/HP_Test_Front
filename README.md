# Consulta de CEP - Projeto Front-end Hapvida

Aplicação React para consulta de CEP brasileiro com interface amigável e responsiva.

## 🚀 Tecnologias

- **React 19+** com TypeScript
- **React Hook Form + Zod** para validação de formulários
- **TanStack Query** para gerenciamento de estado servidor
- **React Router** para navegação
- **Tailwind CSS** para estilização
- **Vitest + Testing Library** para testes
- **MSW** para mock de APIs nos testes
- **Lucide React** para ícones

## ✨ Funcionalidades

- ✅ Formulário com campo de entrada para CEP (aceita com/sem hífen)
- ✅ Validação de CEP em tempo real (8 dígitos)
- ✅ Máscara de CEP (XXXXX-XXX)
- ✅ Debounce na digitação para evitar consultas excessivas
- ✅ Feedback visual durante carregamento
- ✅ Consulta BrasilAPI CEP v2 como primária
- ✅ Fallback para ViaCEP em caso de falha
- ✅ Exibição de dados do endereço:
  - CEP formatado
  - Logradouro
  - Bairro
  - Cidade
  - UF
  - DDD
  - Código IBGE
  - Código SIAFI
  - Coordenadas (quando disponível - BrasilAPI)
  - Provedor utilizado (BrasilAPI/ViaCEP)
- ✅ Tratamento de erros com mensagens amigáveis
- ✅ Botão de "Tentar novamente" em caso de erro
- ✅ Dark mode com persistência em localStorage
- ✅ Layout responsivo

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar testes
npm run test

# Rodar testes uma vez
npm run test:run
```

## 🏗️ Estrutura do Projeto

```
src/
├── api/                 # Serviços de API
│   ├── brasilApi.ts     # Cliente BrasilAPI
│   ├── viaCepApi.ts     # Cliente ViaCEP
│   └── cepService.ts    # Serviço com fallback
├── components/          # Componentes React
│   ├── ui/              # Componentes reutilizáveis
│   ├── CepForm/         # Formulário de CEP
│   ├── AddressCard/     # Card de endereço
│   ├── ErrorDisplay/    # Exibição de erros
│   └── Footer/          # Rodapé dinâmico
├── hooks/               # Hooks customizados
│   ├── useDarkMode.ts   # Dark mode
│   ├── useDebounce.ts   # Debounce
│   └── useCepQuery.ts   # Query de CEP
├── lib/                 # Configurações
│   └── queryClient.ts   # TanStack Query client
├── pages/               # Páginas
│   └── Home/            # Página principal
├── schemas/             # Schemas de validação
│   └── cepSchema.ts     # Schema Zod para CEP
└── types/               # Tipos TypeScript
    ├── address.ts       # Tipo unificado de endereço
    ├── brasilApi.ts     # Tipos BrasilAPI
    └── viaCep.ts        # Tipos ViaCEP

tests/
├── api/                 # Testes de API
├── components/          # Testes de componentes
├── schemas/             # Testes de schemas
├── mocks/               # Mocks MSW
│   ├── handlers.ts      # Handlers de requisição
│   └── server.ts        # Servidor MSW
└── setup.ts             # Configuração dos testes
```

## 🎨 Design

A aplicação segue um design moderno com:
- Gradiente de fundo suave (azul/roxo)
- Cards com sombras e bordas arredondadas
- Ícones do Lucide React
- Suporte a Dark Mode
- Layout totalmente responsivo

## 🔄 Fluxo de Fallback

1. Usuário digita CEP
2. Validação em tempo real (8 dígitos)
3. Consulta à **BrasilAPI** (primária)
4. Se falhar → Consulta à **ViaCEP** (fallback)
5. Exibe resultado ou mensagem de erro
6. Botão "Tentar novamente" disponível em caso de erro

## 📄 Licença

MIT
