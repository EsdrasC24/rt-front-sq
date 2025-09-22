# Aplicación de Personajes de Rick and Morty

Aplicación web React que permite explorar y filtrar personajes del universo de Rick and Morty.

## Tecnologías Utilizadas

- **[React 19.1.1](https://reactjs.org/)** - Librería de UI con hooks
- **[TypeScript 5.8.3](https://www.typescriptlang.org/)** - Tipado estático
- **[Material UI 5.18.0](https://mui.com/)** - Sistema de componentes
- **[Zustand 5.0.8](https://zustand-demo.pmnd.rs/)** - Gestión de estado ligera
- **[Vite 7.1.6](https://vitejs.dev/)** - Bundler moderno y rápido
- **[Jest 30.1.3](https://jestjs.io/)** - Framework de pruebas
- **[React Testing Library](https://testing-library.com/)** - Utilidades de testing

## Estructura del Proyecto

```
rt-front-sq/
├── public/
│   └── vite.svg
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── icons/           # Iconos personalizados
│   │   │   ├── CheckCircleIcon.tsx
│   │   │   ├── FilterIcon.tsx
│   │   │   ├── QuestionCircleIcon.tsx
│   │   │   ├── SearchIcon.tsx
│   │   │   ├── StarIcon.tsx
│   │   │   └── XCircleIcon.tsx
│   │   ├── layouts/         # Componentes de layout
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── CharacterCard.tsx
│   │   ├── CharacterDetailModal.tsx
│   │   ├── FilterModal.tsx
│   │   ├── FilterTabs.tsx
│   │   ├── RelatedCharacterCard.tsx
│   │   ├── StatusBadge.tsx
│   │   └── Welcome.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useCharacters.ts
│   │   ├── useEpisode.ts
│   │   ├── useEpisodeCache.ts
│   │   ├── useOptimizedStores.ts
│   │   └── index.ts
│   ├── pages/               # Páginas de la aplicación
│   │   └── Home.tsx
│   ├── router/              # Configuración de rutas
│   │   ├── AppRouter.tsx
│   │   ├── routes.tsx
│   │   └── index.ts
│   ├── services/            # Servicios y API
│   │   ├── api/            # Clientes de API
│   │   │   ├── character.service.ts
│   │   │   ├── client.ts
│   │   │   └── episode.service.ts
│   │   ├── mappers/        # Transformadores de datos
│   │   │   └── character.mapper.ts
│   │   ├── types/          # Tipos TypeScript
│   │   │   └── api.types.ts
│   │   └── index.ts
│   ├── store/              # Estado global con Zustand
│   │   ├── useFavoritesStore.ts
│   │   ├── useFilterStore.ts
│   │   └── index.ts
│   ├── theme/              # Configuración de tema
│   │   └── theme.ts
│   ├── types/              # Tipos globales
│   │   └── assets.d.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── jest.config.cjs
├── eslint.config.js
└── README.md
```

## Inicio Rápido

### Prerequisitos
- Node.js 18.0.0 o superior
- pnpm

### Instalación y ejecución

1. **Clonar e instalar:**
```bash
git clone https://github.com/EsdrasC24/rt-front-sq.git
cd rt-front-sq
pnpm install
```

2. **Ejecutar el proyecto:**
```bash
pnpm dev
```

3. **Abrir en el navegador:**
```
http://localhost:5174
```

4. **Explorar la aplicación:**
- Busca personajes por nombre
- Aplica filtros por especie, género o estado
- Marca personajes como favoritos
- Explora detalles y personajes relacionados

## Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia el servidor de desarrollo (puerto 5174)
pnpm build            # Construye la aplicación para producción
pnpm preview          # Previsualiza la build de producción

# Testing
pnpm test             # Ejecuta las pruebas en modo watch
pnpm test:run         # Ejecuta las pruebas una vez
pnpm test:coverage    # Ejecuta las pruebas con reporte de cobertura

# Linting
pnpm lint             # Ejecuta ESLint
```






