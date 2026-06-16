# Mapa de Navegación y Flujo de Usuario - Freddy Bakes

El sistema contempla dos flujos principales dependiendo del rol del usuario (Cliente o Administrador), conectando las 7 vistas estáticas obligatorias del Sprint 1.

## 1. Flujo de Compra (Cliente)
Este es el recorrido feliz (*Happy Path*) que hace un usuario normal que entra a comprar dulces:

1. **🏠 Landing Page (`index.html`):** El cliente ingresa a la página principal. Puede ver el banner y la sección de productos "Destacados".
   * *Acción:* Hace clic en "Ver todo" o en el Navbar.
   * *Deriva a:* Catálogo.
2. **📋 Catálogo (`catalogo.html`):** Visualiza la grilla completa de productos con los filtros laterales visuales.
   * *Acción:* Hace clic en la tarjeta de los Cinnamon Rolls.
   * *Deriva a:* Detalle de Producto.
3. **🔍 Detalle de Producto (`detalle.html`):** Ve la foto grande, descripción y precio.
   * *Acción:* Hace clic en el botón "Agregar al Carrito".
   * *Deriva a:* Carrito de Compras.
4. **🛒 Carrito de Compras (`carrito.html`):** Revisa la tabla con los productos estáticos seleccionados y el subtotal.
   * *Acción:* Hace clic en "Finalizar Compra".
   * *Deriva a:* Checkout.
5. **👤 Checkout (`checkout.html`):** Completa el formulario con sus datos de envío y confirma el pedido.

## 2. Flujo de Gestión (Administrador)
Recorrido destinado al dueño del negocio para gestionar el stock y los precios:

1. **⚙️ Panel de Administración (`admin.html`):** El usuario con rol de administrador accede a la vista de Backoffice.
   * *Acción:* Visualiza la tabla de productos. Utiliza los botones de acción para abrir el formulario modal y crear, editar o eliminar un producto.

## 3. Excepciones y Desvíos
* **📄 Página 404 (`404.html`):** Si en cualquier momento del flujo (tanto cliente como admin) el usuario tipea una ruta incorrecta en el navegador, el sistema lo redirige a esta vista de error que contiene un botón de rescate para devolverlo a la `Landing Page`.