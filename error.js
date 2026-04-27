// Shared client-side handlers.
// Currently used by login.html.

(function () {
	const form = document.getElementById('login-form');
	if (!form) return;

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		try {
			const body = new URLSearchParams(new FormData(form));
			const res = await fetch(form.action, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body,
			});

			if (res.ok) {
				window.location.href = '/';
				return;
			}

			const message = await res.text();
			if (res.status === 401) {
				alert(message || 'Invalid username/email or password.');
				return;
			}

			alert(message || 'Login failed.');
		} catch (err) {
			alert('Login failed. Please try again.');
		}
	});
})();
