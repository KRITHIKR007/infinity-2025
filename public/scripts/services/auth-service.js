/**
 * Service for handling user authentication
 */
export class AuthService {
    /**
     * Sign in with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {boolean} rememberMe - Whether to remember the user
     * @returns {Promise<Object>} - Authentication result
     */
    static async signIn(email, password, rememberMe = false) {
        try {
            const supabase = window.supabaseConfig.initSupabase();
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
                options: {
                    // Set session expiry based on rememberMe flag
                    expiresIn: rememberMe ? 30 * 24 * 60 * 60 : 8 * 60 * 60 // 30 days or 8 hours
                }
            });
            
            if (error) throw error;
            
            return {
                success: true,
                session: data.session,
                user: data.user
            };
        } catch (error) {
            console.error('Authentication error:', error);
            return {
                success: false,
                error: error.message || 'Failed to sign in'
            };
        }
    }
    
    /**
     * Sign out the current user
     * @returns {Promise<Object>} - Sign out result
     */
    static async signOut() {
        try {
            const supabase = window.supabaseConfig.initSupabase();
            const { error } = await supabase.auth.signOut();
            
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return {
                success: false,
                error: error.message || 'Failed to sign out'
            };
        }
    }
    
    /**
     * Get the current session
     * @returns {Promise<Object>} - Session data
     */
    static async getSession() {
        try {
            const supabase = window.supabaseConfig.initSupabase();
            const { data, error } = await supabase.auth.getSession();
            
            if (error) throw error;
            
            return {
                success: true,
                session: data.session
            };
        } catch (error) {
            console.error('Session error:', error);
            return {
                success: false,
                error: error.message || 'Failed to get session'
            };
        }
    }
    
    /**
     * Request a password reset
     * @param {string} email - User email
     * @returns {Promise<Object>} - Password reset result
     */
    static async resetPassword(email) {
        try {
            const supabase = window.supabaseConfig.initSupabase();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password.html`
            });
            
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            return {
                success: false,
                error: error.message || 'Failed to reset password'
            };
        }
    }
    
    /**
     * Check if user has admin role
     * @returns {Promise<boolean>} - Whether user is admin
     */
    static async isAdmin() {
        try {
            const { success, session } = await this.getSession();
            
            if (!success || !session) {
                return false;
            }
            
            // Check user metadata or role claim
            const user = session.user;
            return user && (
                user.app_metadata?.role === 'admin' || 
                user.user_metadata?.isAdmin === true
            );
        } catch (error) {
            console.error('Admin check error:', error);
            return false;
        }
    }
    
    /**
     * Check if user is authenticated
     * @returns {Promise<boolean>} - Whether user is authenticated
     */
    static async isAuthenticated() {
        const { success, session } = await this.getSession();
        return success && !!session;
    }
}
