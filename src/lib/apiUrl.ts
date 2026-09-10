/**
 * Resolución de la URL base de la API.
 *
 * `NEXT_PUBLIC_API_URL` se hornea en el bundle durante el build, así que
 * depende por completo de que la plataforma de despliegue la inyecte. Definirla
 * solo en `vercel.json` no basta: ese fichero lo lee Vercel y nadie más —
 * Cloudflare Workers lo ignora—, con lo que el sitio publicado se quedaba
 * apuntando a `localhost` y ninguna petición llegaba a la API.
 *
 * Por eso la URL de producción vive también aquí, en el código: la variable de
 * entorno sigue mandando cuando existe (útil para apuntar a un entorno de
 * pruebas), pero si falta se decide por el host en el que se está sirviendo la
 * web en vez de caer siempre a localhost.
 */
export const PRODUCTION_API_URL = 'https://restaurant-api-yibc4a.fly.dev';
export const LOCAL_API_URL = 'http://localhost:3000';

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '[::1]', '0.0.0.0']);

/** Lógica pura, separada de `window` para poder testearla sin jsdom de por medio. */
export function resolveApiBaseUrl(configured: string | undefined, hostname: string | undefined): string {
  if (configured) return configured;

  // Si la web no se sirve desde un host local, una API en localhost no existe
  // para quien visita el sitio, así que se usa la de producción.
  if (hostname !== undefined && !LOCAL_HOSTNAMES.has(hostname)) {
    return PRODUCTION_API_URL;
  }

  return LOCAL_API_URL;
}

export function getApiBaseUrl(): string {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : undefined;
  return resolveApiBaseUrl(process.env.NEXT_PUBLIC_API_URL, hostname);
}
