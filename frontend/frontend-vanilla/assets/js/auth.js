// Maneja el login: envía credenciales, guarda el usuario en localStorage
// y redirecciona al Home.
(function initAuth() {
  const { api } = window.SweetBytes;
  const STORAGE_KEY = 'sb_user';

  function getCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function isLoggedIn() {
    return Boolean(getCurrentUser());
  }

  function showFormError(form, message) {
    const errorBox = form.querySelector('[data-form-error]');
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
  }

  function showFormSuccess(form, message) {
    const successBox = form.querySelector('[data-form-success]');
    if (!successBox) return;
    successBox.textContent = message;
    successBox.classList.remove('hidden');
  }

  function wireRegisterForm() {
    const form = document.querySelector('[data-register-form]');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const password = form.querySelector('[name="password"]').value;
      const confirmPassword = form.querySelector('[name="confirmPassword"]').value;
      const submitButton = form.querySelector('button[type="submit"]');

      form.querySelector('[data-form-error]')?.classList.add('hidden');
      form.querySelector('[data-form-success]')?.classList.add('hidden');

      if (password !== confirmPassword) {
        showFormError(form, 'Las contraseñas no coinciden');
        return;
      }

      submitButton.disabled = true;

      try {
        await api.register({ name, email, password });
        showFormSuccess(form, 'Usuario creado con éxito. Redirigiendo al login...');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } catch (err) {
        showFormError(form, err.message);
        submitButton.disabled = false;
      }
    });
  }

  function wireLoginForm() {
    const form = document.querySelector('[data-login-form]');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = form.querySelector('[name="email"]').value.trim();
      const password = form.querySelector('[name="password"]').value;
      const submitButton = form.querySelector('button[type="submit"]');

      submitButton.disabled = true;
      form.querySelector('[data-form-error]')?.classList.add('hidden');

      try {
        const { user } = await api.login({ email, password });
        setCurrentUser(user);
        window.location.href = 'index.html';
      } catch (err) {
        showFormError(form, err.message);
        submitButton.disabled = false;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    wireLoginForm();
    wireRegisterForm();
  });

  window.SweetBytes.auth = {
    getCurrentUser,
    setCurrentUser,
    logout,
    isLoggedIn,
  };
})();
