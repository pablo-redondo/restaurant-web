import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

// Next 16 elimina `next lint`: el linter se invoca ya por el CLI de ESLint y la
// configuración usa el formato plano, que eslint-config-next exporta de serie.
const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  ...coreWebVitals,
  ...typescript,
  {
    // Los ficheros de configuración en la raíz son CommonJS por diseño.
    files: ['*.js', '*.cjs'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    // Reglas nuevas que llegan con Next 16 (era del React Compiler). Señalan
    // patrones que hoy funcionan correctamente en toda la app, así que quedan
    // como aviso: revisarlos es una tarea aparte, no parte de la migración.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
];

export default config;
