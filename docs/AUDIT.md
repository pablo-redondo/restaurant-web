# Auditoría técnica — restaurant-web

Revisión de manejo de errores/carga, accesibilidad y cobertura de tests. Fecha: julio 2026.

## 1. Manejo de estados de carga y error en las llamadas a la API

### Causa raíz: `src/lib/api.ts` no distingue fallos de red de respuestas válidas

```ts
const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
const data = await res.json();
if (!res.ok) throw data;
return data as T;
```

- Si `fetch()` falla a nivel de red (API caída, sin conexión, CORS, DNS) se lanza un `TypeError` crudo, no un objeto `{ error: string }` como espera el resto de la app.
- Si el servidor responde con un cuerpo no-JSON (por ejemplo una página de error HTML de Render/Vercel en un 502/504), `res.json()` lanza un `SyntaxError` no controlado.
- Los componentes que hacen `catch (err) { setError((err as {error?:string})?.error ?? 'mensaje genérico') }` no se rompen gracias al `?.` defensivo, pero el mensaje mostrado nunca distingue "la API dijo que no" de "no hemos podido hablar con la API".

**Recomendación**: en `request()`, envolver el `fetch` y el `res.json()` en su propio `try/catch` y normalizar siempre a `{ error: string }`, p. ej. `'No se pudo conectar con el servidor. Inténtalo de nuevo.'` cuando no hay respuesta JSON válida.

### Errores silenciados en listados (`.catch(() => {})` o equivalente)

El patrón más repetido del proyecto: si la petición GET falla, se traga el error y se muestra el mismo estado que "no hay datos". El usuario no puede distinguir un fallo real de una lista vacía legítima.

| Archivo | Qué se oculta |
|---|---|
| `src/app/reservations/page.tsx` (`goToStep2`) | Si `tablesApi.list()` falla, se muestra "No hay mesas disponibles en {zona}." como si de verdad no hubiera mesas. |
| `src/app/reservations/me/page.tsx` | Si falla la carga de reservas, se muestra "No tienes reservas." |
| `src/app/admin/reservations/page.tsx` | Mismo patrón → "No hay reservas." |
| `src/app/admin/tables/page.tsx` | **Ni siquiera tiene `.catch()`** — promesa rechazada = *unhandled rejection* en consola; tabla vacía sin explicación. |
| `src/app/admin/reviews/page.tsx` | Mismo patrón → "No hay reseñas." |
| `src/app/admin/page.tsx` (Dashboard) | `Promise.all([...]).catch(() => {})`: si cualquiera de las 4 llamadas falla, `stats` se queda en `null` para siempre y el dashboard se queda mostrando los *skeletons* de carga indefinidamente, sin mensaje ni reintento. |

Por contraste, las **mutaciones** (login, registro, crear/cancelar reserva, crear reseña, crear/activar mesa) sí manejan el error correctamente y lo muestran al usuario — el problema está concentrado en las peticiones GET de colecciones, no en los envíos de formularios.

### Hallazgo adicional: el estado de carga del listado de disponibilidad es inalcanzable

Al escribir los tests de `reservations/page.tsx` se detectó que `goToStep2` llama a `setStep(2)` **después** del `finally` del fetch:

```ts
const goToStep2 = async () => {
  if (!date || !time) return;
  setLoadingTables(true);
  try { ... } finally { setLoadingTables(false); }
  setStep(2); // ← solo ocurre cuando el fetch ya terminó
};
```

El texto "Buscando mesas disponibles..." vive dentro del bloque `{step === 2 && ...}`, así que en la práctica nunca se llega a ver: mientras la API responde, el usuario sigue viendo el paso 1 sin ningún indicador. Además, el botón "Continuar" no se deshabilita durante el fetch, por lo que un doble clic dispara dos peticiones en paralelo.

## 2. Accesibilidad

### Corregido en esta revisión (trivial)

- **7 pares `<label>`/`<input>`·`<textarea>` sin asociación programática** (`htmlFor`/`id`): un lector de pantalla no anunciaba la etiqueta al enfocar el campo. Corregido en login (email, contraseña), registro (3 campos), reseña de una reserva (comentario) y notas del formulario de reserva.
- **2 inputs de búsqueda en el panel de administración** (reservas, reseñas) sin label visible ni `aria-label` — solo tenían `placeholder`, que no es un sustituto fiable de un label. Añadido `aria-label`.
- **5 iconos SVG puramente decorativos** en la página de contacto (siempre acompañados de su texto, p. ej. el icono de teléfono junto a "Teléfono") marcados con `aria-hidden="true"` para que no se anuncien dos veces.

### Revisado, sin cambios necesarios

- Todas las imágenes (`next/image`) tienen `alt` descriptivo — ninguna decorativa mal etiquetada, ninguna con `alt` vacío indebido.
- `StarRating` ya expone `aria-label="{n} estrellas"` en cada botón individual.
- Contraste de color: verificados los pares de texto muted más usados en todo el sitio — `#5A6B60` sobre blanco (≈5.7:1) y `#8AB5A0` sobre el verde de marca `#172E22` (≈6.3:1) — ambos superan el mínimo AA (4.5:1) con margen. El tono más claro `#C4D5CA` solo se usa en estados deshabilitados (días pasados del calendario), que WCAG exime del requisito de contraste.
- `lang="es"` correctamente declarado en `<html>` (`src/app/layout.tsx`).

### Señalado para el futuro (no trivial, requiere más que un atributo suelto)

- `StarRating` es un grupo de botones sin `role="radiogroup"` ni agrupación semántica explícita — funciona (cada botón se anuncia individualmente) pero se beneficiaría de revisión de diseño al tocar un componente compartido en 3 sitios.
- El calendario de `reservations/page.tsx` no implementa navegación de teclado tipo grid (flechas) ni anuncia la fecha completa por día (solo el número).
- No hay enlace "saltar al contenido" antes de la navegación.

## 3. Tests

No existía ninguna infraestructura de testing en este repo. Se añadió:

- **Jest 30 + jest-environment-jsdom + Testing Library** (`@testing-library/react`, `jest-dom`, `user-event`) configurado vía `next/jest` (`jest.config.js`, `jest.setup.ts`). Script `npm test`.
- **`src/app/reservations/page.test.tsx`** — cubre los dos componentes pedidos explícitamente (formulario de reserva y listado de disponibilidad; en este código conviven en la misma página):
  - "Continuar" deshabilitado hasta elegir fecha y hora.
  - El listado de disponibilidad muestra solo mesas activas (filtra las inactivas).
  - Estado vacío: "No hay mesas disponibles en {zona}."
  - Sin sesión: al confirmar, guarda el borrador en `sessionStorage` y redirige a `/login` en vez de reservar (regresión del fix de pérdida de datos al iniciar sesión).
  - Con sesión: reserva con éxito → pantalla de confirmación con referencia.
  - La API rechaza la reserva → mensaje de error visible, no navega a la pantalla de éxito.
- **`src/app/login/page.test.tsx`** — segundo ejemplo del patrón (formulario + `AuthContext` mockeado): asociación label/input, redirección según rol (`admin` → `/admin`, cliente → `/reservations/me`), error de credenciales.

`@/lib/api` se mockea directamente con `jest.mock` (sin MSW) para mantener la barrera de entrada baja. Si el proyecto crece, migrar a **MSW** sería el siguiente paso natural para tests más realistas a nivel de red.

**Tests sugeridos, no escritos** (siguiente prioridad si se amplía la suite):
- `reservations/me/page.tsx` (listado con filtros de estado y paginación).
- `admin/reservations/page.tsx` (tabla, filtros, cambio de estado optimista).
- `AuthContext` en aislado (persistencia de token en `localStorage`, logout).
- `jest-axe` sobre las páginas principales para detectar regresiones de accesibilidad automáticamente.

## 4. Resumen final priorizado (para portfolio)

**Alta prioridad — antes de compartir el repo:**
1. Sustituir las capturas placeholder del README por capturas reales.
2. Cerrar el patrón de error silencioso en listados (mínimo los 5 sitios con `.catch(() => {})`, empezando por `admin/tables` que ni siquiera tiene `catch`).
3. Tener en cuenta el cold start de Render en la primera impresión — considerar un mensaje "cargando el servidor..." si la primera petición tarda.

**Prioridad media:**
4. Feedback de carga real en el paso 2 del flujo de reserva (ver hallazgo del punto 1).
5. Ampliar la suite de tests a `reservations/me` y `admin/reservations` — el patrón de listado es el más repetido y el más frágil del proyecto.
6. Añadir un README también a `restaurant-api` (está vacío) para que el sistema se lea como coherente desde ambos repos.

**Nice to have:**
7. `role="radiogroup"` en `StarRating` y navegación de teclado tipo grid en el calendario.
8. Enlace "saltar al contenido".
9. Migrar los tests a MSW si el proyecto sigue creciendo.
