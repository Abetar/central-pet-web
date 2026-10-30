# Central Pet · Veterinaria

Demo de una web veterinaria en Next.js, TypeScript y Tailwind. Prioriza solicitar una cita por WhatsApp. No incluye agenda automática, cobros ni base de datos.

## Ejecutar

Desde esta carpeta, con Node.js 20.9 o superior y pnpm:

```bash
pnpm install
pnpm dev
```

Producción: `pnpm build` y `pnpm start`. Comprobación de tipos: `pnpm typecheck`.

## Personalizar

Copia `.env.example` a `.env.local` y configura el WhatsApp real en formato internacional. Los datos son públicos. El teléfono es necesario para enviar solicitudes: sin él se muestra un aviso de demo y se permite copiar el mensaje, sin simular un envío. Reinicia o recompila después de cambiar variables.

Edita los servicios en `src/lib/veterinary.ts`, las preguntas y textos en `src/app/page.tsx` y la identidad visual en `src/app/globals.css`. Las nuevas fotografías WebP están en `public/assets/vet-*.webp`.

Los servicios, fotografías y marca son ilustrativos; valida la oferta y sustituye las imágenes por fotos reales del negocio antes de publicarlo. No hay reseñas, credenciales, tarifas ni horarios inventados. El sitio tiene `noindex` mientras es demo; cambia los metadatos y robots en `src/app/layout.tsx` cuando se publique para un negocio real.

La solicitud permite revisar y editar el mensaje antes de abrir WhatsApp. El negocio debe confirmar fecha, costo y disponibilidad. Los datos del formulario no se almacenan en un servidor. No se utiliza para atención de urgencias.

Animaciones suaves de entrada, transiciones de servicios y fotografías, y parallax discreto con GSAP/ScrollTrigger cuando está disponible. Respetan la preferencia de movimiento reducido; sin GSAP se usan entradas nativas.

Si Windows bloquea una carpeta de compilación antigua, puedes usar otra salida: en PowerShell, `$env:BLOWOUT_BUILD_DIR='build-local'` antes de `pnpm build`; usa la misma variable para `pnpm start`.

## Hero interactivo

El perrito usa una textura WebP con transparencia y una malla Canvas que anima la respiración y comprime localmente el pecho al apoyar el estetoscopio SVG. La escena sigue una secuencia automática; el puntero interactúa únicamente en el pecho. En dispositivos táctiles permanece automática y no bloquea el scroll. Incluye pausa, respeto de movimiento reducido y detención fuera de pantalla. El pulso es decorativo, sin datos clínicos.

WhatsApp configurado: +52 33 2355 3635. El modal abre el chat con nombre, mascota, especie, servicio, fecha preferida y comentarios. El visitante envía el mensaje desde WhatsApp; el negocio confirma la cita. El número puede reemplazarse con NEXT_PUBLIC_WHATSAPP_NUMBER.
