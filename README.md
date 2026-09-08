# Umbría — Las criptas del olvido

Prototipo local de RPG 2D, inspirado en las mecánicas clásicas de Argentum Online. Código y gráficos originales; no incluye recursos del juego original. JavaScript ES2020 y HTML5 Canvas, sin dependencias, red, cuentas ni compilación.

## Ejecutar

Abre **index.html** en un navegador de escritorio moderno (Chrome, Edge, Firefox o Safari). Se usan scripts clásicos con un espacio de nombres compartido para que también funcione mediante `file://`, sin servidor. Teclado y ratón requeridos para la experiencia completa.

Opcional: desde esta carpeta, ejecuta `node serve.cjs` y abre http://127.0.0.1:4173. El servidor escucha solamente en localhost. Detén con Ctrl+C.

## Controles

| Tecla / acción | Resultado |
|---|---|
| WASD o flechas | Moverse en cuatro direcciones |
| Clic sobre un enemigo | Seleccionar objetivo |
| Tab | Rotar entre enemigos cercanos |
| 1 | Descarga: 65 daño, 20 maná, 0,75 s, 7 tiles |
| 2 | Parálisis: inmoviliza 4 s, 25 maná, 4 s, 6 tiles |
| 3 | Apocalipsis: 180 daño, 55 maná, 3 s, 6 tiles |
| 4 | Curación: hasta 85 vida, 30 maná, 2 s |
| 5 | Remover parálisis propia: 15 maná, 1,5 s |
| 6 / 7 | Poción de vida / maná: hasta 100 puntos, 0,3 s |
| 8 | Ataque: 28 daño, 8 energía, 0,6 s, alcance 1,5 tiles |
| E | Recoger objetos del tile actual; también se recogen al terminar un paso |
| Escape | Pausar / continuar |

También puedes hacer clic en la hotbar y en las pociones del inventario. Sonido sintetizado opcional mediante el botón «Sonido». El juego se pausa al perder el foco o cambiar de pestaña.

## Bucle de juego

Derrota a los siete guardianes. Los esqueletos persiguen y atacan cuerpo a cuerpo; los acólitos además paralizan a distancia. La parálisis bloquea nuevos pasos, pero permite castear y beber. Usa Remover para recuperar el movimiento. La derrota permite reiniciar; completar el encargo entrega 350 de oro una sola vez y permite seguir recogiendo el botín. El maná y la energía se regeneran. No hay regeneración pasiva de vida.

Colisiones reservan tanto el tile de destino como el de origen durante cada paso; ningún actor atraviesa otro ni paredes, pilares o tumbas. Los hechizos requieren alcance y línea de visión. El inventario tiene 20 slots y pilas por tipo de objeto. Las pociones se consumen; las cuatro piezas equipadas son una representación fija del equipo inicial, sin bonificaciones ni intercambio. No hay backend, multijugador, persistencia ni reproducción exacta del balance de Argentum Online.

## Arquitectura

- `js/data.js`: mapa de 26 × 19 tiles de 32 × 32, antorchas, enemigos, objetos y configuración de hechizos.
- `js/art.js`: generadores deterministas de tiles, iconos y sprites. Tres tipos de actor × cuatro direcciones × cuatro frames. Mapa y máscara de luz cacheados.
- `js/engine.js`: estado y simulación, movimiento interpolado, IA BFS, combate, cooldowns, botín y victoria/derrota. Independiente del DOM.
- `js/ui.js`: render del mundo, iluminación, partículas, texto flotante, HUD e inventario.
- `js/main.js`: entrada, audio y bucle de simulación fijo de 60 Hz con render por `requestAnimationFrame`.
- `styles.css`: interfaz adaptable, marcos, barras y escalado pixelado.
- `tests/engine.test.cjs`: pruebas del motor con el ejecutor nativo de Node.

## Modificar y validar

Edita `AO.MAP` para construir otra cripta: `.` es transitable; `#`, `o` y `~` representan pared, pilar y tumba. Mantén 26 columnas y 19 filas o cambia también las dimensiones del canvas y las capas de render. Ajusta `AO.SPELLS` para modificar alcance, daño, coste y cooldown. Los enemigos se configuran en `AO.ENEMIES`.

Pruebas: `node --test tests/engine.test.cjs`.

Todos los recursos se generan localmente. No requiere descargar atlas, fuentes ni bibliotecas externas.

## Despliegue en Vercel

El repositorio incluye `vercel.json`. Al importarlo en Vercel, usa la raíz del repositorio como Root Directory. La configuración selecciona Framework «Other», ejecuta `node build.cjs` y publica únicamente `dist/`. No hay variables de entorno, dependencias ni servidor de producción.

Para generar el sitio estático localmente: `node build.cjs`. La carpeta `dist/` contiene solamente HTML, CSS y los cinco módulos JavaScript. GitHub Actions ejecuta las pruebas y la generación del sitio en cada push o pull request.
