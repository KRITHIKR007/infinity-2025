import { AuthService } from './services/auth-service.js';

/**
 * Middleware to protect admin routes
 * Redirects to login page if user is not authenticated or not an admin
 */
export async function adminAuthCheck() {
    try {
        // Check if user is authenticated
        const isAuthenticated = await AuthService.isAuthenticated();
        
        if (!isAuthenticated) {
            // Redirect to login page if not authenticated
            window.location.href = '/admin/login.html';
            return false;
        }
        
        // Check if user is an admin
        const isAdmin = await AuthService.isAdmin();
        
        if (!isAdmin) {
            // Redirect to unauthorized page if not an admin
            window.location.href = '/admin/unauthorized.html';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/admin/login.html';
        return false;
    }
}

// Check auth on page load for admin pages
if (window.location.pathname.includes('/admin/') && 
    !window.location.pathname.includes('/admin/login.html') && 
    !window.location.pathname.includes('/admin/forgot-password.html') &&
    !window.location.pathname.includes('/admin/unauthorized.html')) {
    
    // Run the auth check when the DOM is loaded
    document.addEventListener('DOMContentLoaded', adminAuthCheck);
}
