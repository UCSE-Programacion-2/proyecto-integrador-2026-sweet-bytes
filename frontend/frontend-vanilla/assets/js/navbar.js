// Muestra opciones de navegación distintas según si hay sesión activa,
// y si el usuario logueado es admin.
(function initNavbar() {
  const { auth } = window.SweetBytes;

  function loggedOutHTML() {
    return `
      <a href="login.html" class="text-[.82rem] font-medium text-brown-md hover:text-caramel transition-colors">Ingresar</a>
    `;
  }

  function loggedInHTML(user) {
    const adminLink = user.role === 'admin'
      ? '<a href="admin.html" class="text-[.82rem] font-medium text-brown-md hover:text-caramel transition-colors">Admin</a>'
      : '';

    return `
      <span class="text-[.82rem] font-medium text-brown-md/70 hidden sm:inline">Hola, ${user.name}</span>
      ${adminLink}
      <button data-logout-btn type="button" class="text-[.82rem] font-medium text-brown-md hover:text-caramel transition-colors">Salir</button>
    `;
  }

  function render() {
    const user = auth.getCurrentUser();

    document.querySelectorAll('[data-nav-auth]').forEach((slot) => {
      slot.innerHTML = user ? loggedInHTML(user) : loggedOutHTML();
    });

    document.querySelectorAll('[data-logout-btn]').forEach((button) => {
      button.addEventListener('click', () => {
        auth.logout();
        window.location.href = 'index.html';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();
