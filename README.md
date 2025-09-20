# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# Librería de Componentes Tarjeta 🎴

Una moderna librería de componentes React que incluye un componente **Tarjeta** altamente configurable, construida con las mejores tecnologías y prácticas de desarrollo.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3.2-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.6-green)
![Vitest](https://img.shields.io/badge/Vitest-3.2.4-green)

## 🌟 Características

- **5 Variantes de Tarjeta**: default, compact, featured, product, article
- **Sistema de Calificaciones**: Integración con Material UI Rating
- **Badges y Etiquetas**: Sistema personalizable de badges y chips
- **Precios con Descuentos**: Soporte para precios originales y ofertas
- **Información de Autor**: Avatar y nombre para artículos
- **Estado de Stock**: Indicadores visuales para disponibilidad
- **Internacionalización**: Soporte completo para múltiples idiomas
- **Gestión de Estado**: Zustand para favoritos y notificaciones
- **Totalmente Tipado**: TypeScript para mayor seguridad
- **Pruebas Completas**: Cobertura de pruebas con Vitest
- **Accesibilidad**: Cumple con estándares WCAG
- **Responsivo**: Diseño adaptable a todos los dispositivos

## 🚀 Tecnologías Utilizadas

- **[React 19.1.1](https://reactjs.org/)** - Librería de UI
- **[TypeScript 5.8.3](https://www.typescriptlang.org/)** - Tipado estático
- **[Material UI 7.3.2](https://mui.com/)** - Componentes y diseño
- **[i18Next React 15.7.3](https://react.i18next.com/)** - Internacionalización
- **[Zustand 5.0.8](https://zustand-demo.pmnd.rs/)** - Gestión de estado
- **[Vite 7.1.6](https://vitejs.dev/)** - Bundler y herramientas de desarrollo
- **[Vitest 3.2.4](https://vitest.dev/)** - Framework de pruebas
- **[Testing Library](https://testing-library.com/)** - Utilidades de testing

## 📦 Instalación

### Prerequisitos

- Node.js 18.0.0 o superior
- pnpm (recomendado) o npm

### Clonar el Repositorio

```bash
git clone https://github.com/EsdrasC24/rt-front-sq.git
cd rt-front-sq
```

### Instalar Dependencias

```bash
# Con pnpm (recomendado)
pnpm install

# Con npm
npm install
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia el servidor de desarrollo
pnpm build            # Construye la aplicación para producción
pnpm preview          # Previsualiza la build de producción

# Testing
pnpm test             # Ejecuta las pruebas en modo watch
pnpm test:run         # Ejecuta las pruebas una vez
pnpm test:ui          # Abre la interfaz de usuario de Vitest

# Linting
pnpm lint             # Ejecuta ESLint
```

## 🎯 Uso del Componente

### Importación

```tsx
import { Tarjeta } from './components/Tarjeta';
// O importar con tipos
import { Tarjeta, type TarjetaProps } from './components/Tarjeta';
```

### Ejemplo Básico

```tsx
<Tarjeta
  title="MacBook Pro 14\""
  subtitle="Apple M3 Pro"
  description="Potente laptop profesional con chip M3 Pro"
  price="$2,499.00"
  imageUrl="https://example.com/macbook.jpg"
  tags={['Tecnología', 'Apple', 'Profesional']}
  onPrimaryAction={() => console.log('Ver detalles')}
  onSecondaryAction={() => console.log('Agregar al carrito')}
/>
```

### Variantes del Componente

#### 1. Tarjeta Compacta
```tsx
<Tarjeta
  variant="compact"
  title="Coffee Beans"
  price="$24.99"
  imageUrl="/coffee.jpg"
  onPrimaryAction={handleAddToCart}
  primaryActionIcon={<ShoppingCart />}
/>
```

#### 2. Tarjeta Destacada
```tsx
<Tarjeta
  variant="featured"
  title="Gaming Laptop"
  subtitle="High Performance"
  description="Experience gaming like never before..."
  price="$1,299.99"
  originalPrice="$1,499.99"
  rating={4.8}
  reviewCount={245}
  badge="Best Seller"
  badgeColor="warning"
  elevated
  maxWidth={450}
/>
```

#### 3. Tarjeta de Producto
```tsx
<Tarjeta
  variant="product"
  title="Bluetooth Speaker"
  price="$79.99"
  originalPrice="$99.99"
  rating={4.5}
  reviewCount={127}
  badge="20% Off"
  badgeColor="error"
  inStock={true}
  primaryActionIcon={<ShoppingCart />}
/>
```

#### 4. Tarjeta de Artículo
```tsx
<Tarjeta
  variant="article"
  title="The Future of Technology"
  author="John Smith"
  authorAvatar="/avatar.jpg"
  description="Explore the latest technological advancements..."
  primaryActionIcon={<Visibility />}
  primaryActionText="Read More"
/>
```

## 🌍 Internacionalización

El componente soporta internacionalización con i18Next. Los textos están disponibles en:

- **Español (es)** - Idioma por defecto
- **Inglés (en)**

## 🧪 Testing

### Ejecutar Pruebas

```bash
# Modo watch
pnpm test

# Ejecutar una vez
pnpm test:run

# Con interfaz de usuario
pnpm test:ui
```

## 🚀 Inicio Rápido

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
http://localhost:5173
```

4. **Ejecutar pruebas:**
```bash
pnpm test:run
```

## 📱 Demo en Vivo

La aplicación incluye una demo interactiva que muestra:

- 5 variantes diferentes del componente Tarjeta
- Sistema de favoritos funcional
- Cambio de idioma dinámico
- Todas las características y props disponibles
- Ejemplos de uso en diferentes contextos

## 🎨 Características Avanzadas

### Sistema de Calificaciones
- Componente Rating integrado de Material UI
- Soporte para calificaciones decimales
- Contador de reseñas

### Badges Dinámicos
- Múltiples colores: primary, secondary, error, warning, info, success
- Posicionamiento automático
- Textos personalizables

### Gestión de Estado Global
- Zustand para estado de favoritos
- Sistema de notificaciones
- Persistencia opcional

### Accesibilidad
- Roles ARIA apropiados
- Navegación por teclado
- Lectores de pantalla compatibles
- Contrastes de color optimizados

## 🔧 Configuración Avanzada

### Personalización de Tema

El proyecto incluye un tema personalizado en `src/theme/tarjetaTheme.ts` que puede ser modificado según las necesidades del proyecto.

### Variables de Entorno

```env
VITE_APP_TITLE=Librería de Componentes Tarjeta
VITE_DEFAULT_LANGUAGE=es
```

## 📞 Soporte

¿Necesitas ayuda? Puedes:

- Abrir un [issue](https://github.com/EsdrasC24/rt-front-sq/issues)
- Ver la documentación en el código
- Revisar los ejemplos en la demo

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Escribe pruebas para tu código
4. Asegúrate de que todas las pruebas pasen
5. Envía un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

⭐ **¡Desarrollado como parte del reto técnico con las mejores prácticas de Clean Code y principios SOLID!**

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
