document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');

    // Toggle between login and register forms
    showRegister.onclick = function(e) {
        e.preventDefault();
        document.querySelector('.login-container').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    }

    showLogin.onclick = function(e) {
        e.preventDefault();
        document.querySelector('.login-container').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
    }

    // Handle login
    loginForm.onsubmit = async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userToken', data.token);
                window.location.href = 'calendar.html';
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Login failed');
        }
    }

    // Handle registration
    signupForm.onsubmit = async function(e) {
        e.preventDefault();
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('Registration successful! Please login.');
                showLogin.click();
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Registration failed');
        }
    }
});
