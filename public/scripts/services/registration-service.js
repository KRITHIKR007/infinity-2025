import { hasTeamEvents } from '../registration-helpers.js';
import { ValidationService } from './validation-service.js';

/**
 * Service for handling event registrations
 */
export class RegistrationService {
    /**
     * Submit a new registration
     * @param {Object} formData - Registration form data
     * @returns {Promise<Object>} - Result of registration operation
     */
    static async submitRegistration(formData) {
        try {
            console.log('RegistrationService: Starting registration submission');
            const supabase = window.supabaseConfig.initSupabase();
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }
            
            console.log('RegistrationService: Supabase client initialized');
            
            // Validate inputs
            const personalValidation = ValidationService.validatePersonalInfo({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                university: formData.university
            });
            
            if (!personalValidation.valid) {
                console.error('RegistrationService: Personal info validation failed', personalValidation.errors);
                return {
                    success: false,
                    error: personalValidation.errors[0]
                };
            }
            
            const eventValidation = ValidationService.validateEventSelection(
                new Set(formData.selectedEvents)
            );
            
            if (!eventValidation.valid) {
                console.error('RegistrationService: Event selection validation failed', eventValidation.errors);
                return {
                    success: false,
                    error: eventValidation.errors[0]
                };
            }
            
            // Generate registration ID
            const registrationId = `INF-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
            console.log('RegistrationService: Generated registration ID:', registrationId);
            
            // Get transaction ID
            const transactionId = formData.transactionId || null;
            console.log('RegistrationService: Transaction ID:', transactionId);
            
            if (!transactionId) {
                return {
                    success: false,
                    error: 'Transaction ID is required'
                };
            }
            
            // Create the registration record
            console.log('RegistrationService: Creating registration record');
            const registrationData = {
                registration_id: registrationId,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                university: formData.university,
                category: formData.category,
                team_name: formData.teamName || null,
                payment_method: formData.paymentMethod,
                payment_status: 'pending', // Always pending until verified
                transaction_id: transactionId,
                created_at: new Date().toISOString(),
                events: formData.selectedEvents,
                event_name: formData.eventNames.join(', '),
                team_members: formData.teamMembers || [],
                fee: formData.totalFee
            };
            
            console.log('RegistrationService: Registration data prepared:', registrationData);
            
            const { data: registration, error: registrationError } = await supabase
                .from('registrations')
                .insert(registrationData)
                .select();
                
            if (registrationError) {
                console.error('RegistrationService: Error inserting registration:', registrationError);
                throw registrationError;
            }
            
            console.log('RegistrationService: Registration saved successfully:', registration);
            
            return {
                success: true,
                registrationId,
                data: registration[0] || { registration_id: registrationId }
            };
        } catch (error) {
            console.error('RegistrationService: Unhandled error:', error);
            return {
                success: false,
                error: error.message || 'Failed to complete registration'
            };
        }
    }
    
    /**
     * Check if an event is a team event
     * @param {string} eventId - Event ID to check
     * @returns {boolean} - Whether this is a team event
     */
    static isTeamEvent(eventId) {
        const teamEvents = [
            'pitch4sustain', 'ctrl-z', 'phantom-hunt', 
            'nritya-vedika', 'resonance', 'cosmic-drift', 
            'innovathon', 'drone-xtreme', 'model-blitz',
            'aether-frames'
        ];
        
        return teamEvents.includes(eventId);
    }
}

// Add a global reference for non-module scripts
if (typeof window !== 'undefined') {
    window.RegistrationService = RegistrationService;
}
