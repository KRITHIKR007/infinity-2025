/**
 * Service for validating form inputs
 */
export class ValidationService {
    
    /**
     * Validate personal information
     * @param {Object} data - Personal information data
     * @returns {Object} - Validation result with errors if any
     */
    static validatePersonalInfo(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length === 0) {
            errors.push('Please enter your full name');
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.phone || !this.isValidPhone(data.phone)) {
            errors.push('Please enter a valid 10-digit phone number');
        }
        
        if (!data.university || data.university.trim().length === 0) {
            errors.push('Please enter your university/college name');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether email is valid
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Validate phone number format
     * @param {string} phone - Phone number to validate
     * @returns {boolean} - Whether phone number is valid
     */
    static isValidPhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    }
    
    /**
     * Validate event selection
     * @param {Set} selectedEvents - Set of selected event IDs
     * @returns {Object} - Validation result with errors if any
     */
    static validateEventSelection(selectedEvents) {
        const errors = [];
        
        if (!selectedEvents || selectedEvents.size === 0) {
            errors.push('Please select at least one event');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// Make service available globally for non-module scripts
if (typeof window !== 'undefined') {
    window.ValidationService = ValidationService;
}
