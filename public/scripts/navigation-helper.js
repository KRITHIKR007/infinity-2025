/**
 * Navigation helper to ensure consistent navigation across all pages
 */

// Setup mobile menu functionality
export function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMenuButton = document.getElementById('closeMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuButton && mobileMenu && closeMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });
        
        closeMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    }
}

// Add common navigation to all pages
export function initCommonNavigation() {
    setupMobileMenu();
    
    // Setup smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}

// Navigate to confirmation page
export function navigateToConfirmation(registrationId) {
    window.location.href = `confirmation.html?id=${registrationId}`;
}

// Navigate to registration page
export function navigateToRegistration() {
    window.location.href = 'register.html';
}

// Initialize Supabase globally if not already done
export function ensureSupabaseInitialized() {
    if (!window.supabase) {
        const supabaseUrl = 'https://ceickbodqhwfhcpabfdq.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaWNrYm9kcWh3ZmhjcGFiZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzU2MTgsImV4cCI6MjA1NzkxMTYxOH0.ZyTG1FkQzjQ0CySlyvkQEYPHWBbZJd--vsB_IqILuo8';
        
        try {
            window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
            console.log('Supabase client initialized by navigation helper');
        } catch (error) {
            console.error('Failed to initialize Supabase client:', error);
        }
    }
    
    return window.supabase;
}

// Navigate to a specific step in multi-step forms
export function navigateToFormStep(step, formId = 'registrationForm') {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID ${formId} not found`);
        return false;
    }
    
    // Find all step elements
    const steps = form.querySelectorAll('[id^="step"]');
    
    // Hide all steps
    steps.forEach(stepEl => stepEl.classList.add('hidden'));
    
    // Show the target step
    const targetStep = form.querySelector(`#step${step}`);
    if (targetStep) {
        targetStep.classList.remove('hidden');
        
        // Update step indicators if they exist
        const stepIndicators = document.querySelectorAll('.step-indicator');
        stepIndicators.forEach((indicator, index) => {
            if (index + 1 === step) {
                indicator.classList.add('active');
            } else if (index + 1 < step) {
                indicator.classList.add('completed');
                indicator.classList.remove('active');
            } else {
                indicator.classList.remove('active', 'completed');
            }
        });
        
        return true;
    }
    
    console.error(`Step ${step} not found in form ${formId}`);
    return false;
}

// Handle form navigation with validation
export function setupFormNavigation(options = {}) {
    const {
        formId = 'registrationForm',
        stepValidators = {},
        onStepChange = null
    } = options;
    
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID ${formId} not found`);
        return;
    }
    
    // Find and attach handlers to navigation buttons
    const nextButtons = form.querySelectorAll('[id$="NextBtn"]');
    const prevButtons = form.querySelectorAll('[id$="PrevBtn"]');
    
    nextButtons.forEach(button => {
        const stepMatch = button.id.match(/step(\d+)NextBtn/);
        if (stepMatch) {
            const currentStep = parseInt(stepMatch[1], 10);
            const nextStep = currentStep + 1;
            
            button.addEventListener('click', () => {
                // Check if validator exists for this step
                const validator = stepValidators[currentStep];
                if (validator && typeof validator === 'function') {
                    const isValid = validator();
                    if (!isValid) return; // Don't proceed if validation fails
                }
                
                const navigated = navigateToFormStep(nextStep, formId);
                if (navigated && onStepChange) {
                    onStepChange(currentStep, nextStep);
                }
            });
        }
    });
    
    prevButtons.forEach(button => {
        const stepMatch = button.id.match(/step(\d+)PrevBtn/);
        if (stepMatch) {
            const currentStep = parseInt(stepMatch[1], 10);
            const prevStep = currentStep - 1;
            
            button.addEventListener('click', () => {
                const navigated = navigateToFormStep(prevStep, formId);
                if (navigated && onStepChange) {
                    onStepChange(currentStep, prevStep);
                }
            });
        }
    });
    
    console.log('Form navigation setup complete');
    return {
        goToStep: (step) => navigateToFormStep(step, formId)
    };
}
