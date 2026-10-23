# Bioferia 2027 · landing

Sitio estático (HTML, CSS y JavaScript). No hay que instalar nada ni compilar.

## Subirlo
Subir **el contenido de esta carpeta** (que `index.html` quede en la raíz): GitHub Pages, Vercel o Netlify.

## Probarlo en la computadora
Los archivos no cargan bien con doble clic; hay que servirlos. Desde esta carpeta:

    npx serve .

o, con Node:

    node -e "require('http').createServer((q,r)=>require('fs').readFile('.'+(q.url.split('?')[0]==='/'?'/index.html':q.url.split('?')[0]),(e,d)=>e?(r.writeHead(404),r.end()):r.end(d))).listen(5174)"

y abrir http://localhost:5174/

## Dónde se edita cada cosa
- `content.js`: textos, agenda, categorías, videos, apps, colores por espacio.
- `assets/`: imágenes, videos, QR y gráficas de la marca.
- `bienvenida.js` / `bienvenida.css`: el pop de apertura. Se ve de nuevo con `?bienvenida=anim` en la dirección.
- `lenguaje.css`: papel, texturas y collage. `extras.css`: galería, agenda, contador, apps.

## Pendientes antes de publicar
- El formulario de contacto está en modo demostración (no envía mensajes).
- Las fotos de la galería y el video del predio provienen de bioferia.info: pedir autorización.
- Las capturas de las apps (`assets/apps`) son de la fecha de armado.
