# Decisiones de Diseño (UI) - Freddy Bakes

## Paleta de Colores
Definimos una paleta cromática cálida que evoca los ingredientes principales de la pastelería (harina, manteca, dulce de leche y chocolate), alejándonos del blanco puro clínico:
* **Cream (`#FDF6EE`) / Cream-dk (`#F2E4D0`):** Utilizados como fondos principales y tarjetas para dar una sensación de limpieza, calidez y estética hogareña.
* **Caramel (`#C97D4E`) / Car-light (`#E8C4A0`):** Colores de acento interactivos. Se aplican en botones principales, precios y llamados a la acción (CTAs) para captar la atención del usuario.
* **Brown (`#3D1F0A`) / Brown-md (`#6B3A20`):** Utilizados para los textos principales, barras de navegación y encabezados, asegurando un alto contraste y accesibilidad de lectura.
* **Blush (`#F4D5C8`):** Color secundario suave para detalles gráficos sutiles (blobs o fondos de etiquetas).

## ipografías
Se implementó una combinación dual de Google Fonts para equilibrar la elegancia comercial con la usabilidad del sistema:
* **Playfair Display (Serif):** Aplicada exclusivamente a los encabezados (`h1`, `h2`, `h3`) y la marca. Transmite el aspecto artesanal, clásico y "premium" de los productos de pastelería fina.
* **Inter (Sans-serif):** Aplicada a los cuerpos de texto, descripciones, botones y menús. Al ser geométrica y de palo seco, garantiza una excelente legibilidad en pantallas de dispositivos móviles.

## Componentes, Márgenes y Alineación
* **Tarjetas de Producto (Cards):** Se diseñaron con bordes muy redondeados (`rounded-[1.6rem]`) y sombras suaves en el estado `hover` para generar una interfaz amigable y moderna que invite al clic.
* **Espaciados y Layout:** Se adoptó el sistema de espaciado nativo de Tailwind (múltiplos de 4px). Para garantizar el equilibrio visual en resoluciones de escritorio y evitar que el contenido principal quedara desfasado o recostado demasiado hacia la izquierda, se estandarizó el uso de contenedores con anchos máximos (`max-w-7xl`) y márgenes laterales automáticos (`mx-auto`), asegurando una alineación central perfecta.

## Estados de Error y Excepciones
* **Página 404 (Not Found):** Se diseñó una vista de error personalizada y empática (`404.html`) para evitar la frustración del cliente ante una ruta rota. En lugar de un código técnico, se implementó un *copywriting* temático ("Parece que este dulce se cayó del horno") junto a un CTA de rescate para regresar al inicio.
* **Formularios (Checkout/Admin):** Los inputs poseen un estado `focus` que ilumina el borde en color `caramel` para orientar al usuario. Se dejó planificada para el Sprint 2 la incorporación de lógica JS que alterne los bordes a tonos rojos (alerta) al detectar campos vacíos o datos inválidos.