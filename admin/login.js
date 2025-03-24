import { AuthService } from '../public/scripts/services/auth-service.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is already logged in
    const { success, session } = await AuthService.getSession();
    
    if (success && session) {
        // Redirect to dashboard if already logged in
        window.location.href = 'dashboard.html';
        return;
    }
    
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeInput = document.getElementById('remember');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginText = document.getElementById('loginText');
    const loginLoading = document.getElementById('loginLoading');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            // Toggle icon
            const icon = togglePasswordBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }
    
    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate inputs
            if (!emailInput.value || !passwordInput.value) {
                showError('Please enter both email and password');
                return;
            }
            
            // Show loading state
            setLoading(true);
            
            // Attempt login
            const result = await AuthService.signIn(
                emailInput.value,
                passwordInput.value,
                rememberMeInput.checked
            );
            
            if (result.success) {
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                showError(result.error || 'Invalid email or password');
                setLoading(false);
            }
        });
    }
    
    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove('hidden');
    }
    
    // Set loading state
    function setLoading(isLoading) {
        if (isLoading) {
            loginBtn.disabled = true;
            loginText.classList.add('hidden');
            loginLoading.classList.remove('hidden');
        } else {
            loginBtn.disabled = false;
            loginText.classList.remove('hidden');
            loginLoading.classList.add('hidden');
        }
    }
});
