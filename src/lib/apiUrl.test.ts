import { resolveApiBaseUrl, PRODUCTION_API_URL, LOCAL_API_URL } from './apiUrl';

describe('resolveApiBaseUrl', () => {
  it('usa la variable de entorno cuando está definida, sea cual sea el host', () => {
    expect(resolveApiBaseUrl('https://api-de-pruebas.example', 'restaurant-web.workers.dev')).toBe(
      'https://api-de-pruebas.example'
    );
    expect(resolveApiBaseUrl('https://api-de-pruebas.example', 'localhost')).toBe(
      'https://api-de-pruebas.example'
    );
  });

  it('cae a la API local en desarrollo cuando no hay variable', () => {
    expect(resolveApiBaseUrl(undefined, 'localhost')).toBe(LOCAL_API_URL);
    expect(resolveApiBaseUrl(undefined, '127.0.0.1')).toBe(LOCAL_API_URL);
  });

  // La regresión que rompió el despliegue en Cloudflare: la variable solo estaba
  // en vercel.json, que Cloudflare ignora, así que el sitio publicado quedaba
  // pidiendo a localhost desde el navegador del visitante.
  it('cae a la API de producción en un host desplegado cuando no hay variable', () => {
    for (const host of ['restaurant-web.workers.dev', 'restaurant-web-lilac.vercel.app', 'marques.com']) {
      expect(resolveApiBaseUrl(undefined, host)).toBe(PRODUCTION_API_URL);
    }
  });

  it('cae a la API local cuando se renderiza en servidor (sin hostname) y no hay variable', () => {
    expect(resolveApiBaseUrl(undefined, undefined)).toBe(LOCAL_API_URL);
  });
});
