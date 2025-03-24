import { hasTeamEvents } from '../registration-helpers.js';

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
            
            // Step 1: Upload payment proof if provided
            let paymentProofUrl = null;
            let paymentProofPath = null;
            
            if (formData.paymentMethod === 'qr' && formData.paymentProof) {  
                console.log('RegistrationService: Uploading payment proof');              
                try {
                    // Try to use PhotoService from window or directly import if needed
                    const photoService = window.PhotoService || (await import('./photo-service.js')).PhotoService;
                    
                    const uploadResult = await photoService.uploadPhoto(
                        formData.paymentProof,
                        'payment_proofs',
                        'payment-proofs',
                        true // optimize image
                    );
                    
                    if (!uploadResult.success) {
                        console.error('RegistrationService: Payment proof upload failed', uploadResult.error);
                        throw new Error(uploadResult.error || 'Failed to upload payment proof');
                    }
                    
                    paymentProofUrl = uploadResult.url;
                    paymentProofPath = uploadResult.path;
                    console.log('RegistrationService: Payment proof uploaded successfully', paymentProofUrl);
                } catch (uploadError) {
                    console.error('RegistrationService: Error in payment proof upload:', uploadError);
                    // Try direct upload as fallback
                    const file = formData.paymentProof;
                    const fileName = `${Date.now()}-payment-proof.${file.name.split('.').pop()}`;
                    
                    console.log('RegistrationService: Attempting direct upload as fallback');
                    const { data: uploadData, error: directUploadError } = await supabase.storage
                        .from('payment_proofs')
                        .upload(fileName, file);
                        
                    if (directUploadError) {
                        console.error('RegistrationService: Direct upload failed:', directUploadError);
                        throw directUploadError;
                    }
                    
                    const { data: urlData } = supabase.storage
                        .from('payment_proofs')
                        .getPublicUrl(fileName);
                        
                    paymentProofUrl = urlData.publicUrl;
                    paymentProofPath = fileName;
                    console.log('RegistrationService: Direct upload successful:', paymentProofUrl);
                }
            }
            
            // Step 2: Create the registration record
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
                payment_status: formData.paymentMethod === 'venue' ? 'pending' : 'pending', // Always pending until verified
                payment_proof_url: paymentProofUrl,
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
