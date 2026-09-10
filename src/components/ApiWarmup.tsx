'use client';
import { useEffect } from 'react';
import { getApiBaseUrl } from '@/lib/apiUrl';

/** Precalienta la API en cuanto carga la página: la máquina de Fly.io se
 *  duerme tras un rato de inactividad y así la primera petición real (buscar
 *  disponibilidad, iniciar sesión) no paga el arranque en frío. */
export default function ApiWarmup() {
  useEffect(() => {
    fetch(`${getApiBaseUrl()}/api/reviews?limit=1`).catch(() => {});
  }, []);
  return null;
}
